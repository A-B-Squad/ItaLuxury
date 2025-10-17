import crypto from "crypto";
import * as fbq from "./pixel";
import { getUserIpAddress } from "../getUserIpAddress";
import { v4 as uuidv4 } from "uuid";
import { sendGTMEvent } from "@next/third-parties/google";

interface UserData {
  [key: string]: string | string[] | undefined;
}

interface CustomData {
  [key: string]: any;
  value?: number;
  contents?: any[];
}

interface EventData {
  user_data: UserData;
  custom_data?: CustomData;
}

interface SendingData {
  event_name: string;
  event_id: string;
  event_time: number;
  action_source: string;
  event_source_url: string;
  user_data: UserData;
  custom_data: CustomData;
  original_event_data: {
    event_name: string;
    event_time: number;
  };
}

// ========== OPTIMIZATION 1: Batch hash operations ==========
function hashData(data: string | undefined): string {
  if (!data) return '';
  return crypto
    .createHash('sha256')
    .update(data.toLowerCase().trim())
    .digest('hex');
}

// ========== OPTIMIZATION 2: Validate and normalize email ==========
function normalizeEmail(email: string): string {
  if (!email) return '';
  return email.toLowerCase().trim();
}

// ========== OPTIMIZATION 3: Normalize phone ==========
function normalizePhone(phone: string): string {
  if (!phone) return '';
  // Remove all non-digit characters
  return phone.replace(/\D/g, '');
}

function removeTypename(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeTypename);
  } else if (obj !== null && typeof obj === 'object') {
    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
      if (key !== '__typename') {
        newObj[key] = removeTypename(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

function cleanContentsData(contents: any[]): any[] {
  const allowedFields = [
    'id',
    'quantity',
    'item_price',
    'title',
    'description',
    'brand',
    'category',
    'delivery_category',
  ];

  return contents.map((item) => {
    const cleanedItem: any = {};
    for (const field of allowedFields) {
      if (item[field] !== undefined) {
        if (field === 'item_price') {
          cleanedItem[field] = Number(item[field]) || 0;
        } else {
          cleanedItem[field] = String(item[field]).trim();
        }
      }
    }
    return cleanedItem;
  });
}

function formatValue(value: any): number {
  const numValue = Number(value);
  return isNaN(numValue) ? 0 : Number(numValue.toFixed(2)); // 2 decimals for currency
}

// ========== OPTIMIZATION 4: Enhanced user data processing ==========
async function createSendingData(
  values: EventData,
  event_name: string,
  eventId: string
): Promise<SendingData> {
  const userIp = await getUserIpAddress();
  const nonHashedFields = ['client_user_agent', 'client_ip_address', 'fbc', 'fbp'];

  let custom_data = removeTypename(values.custom_data || {});

  // Validate and format value
  if (custom_data.value !== undefined) {
    custom_data.value = formatValue(custom_data.value);
  }

  // Ensure currency is uppercase
  if (custom_data.currency) {
    custom_data.currency = String(custom_data.currency).toUpperCase();
  }

  // Clean contents
  if (custom_data.contents) {
    custom_data.contents = Array.isArray(custom_data.contents)
      ? cleanContentsData(custom_data.contents)
      : cleanContentsData([custom_data.contents]);
  }

  // ========== OPTIMIZATION 5: Better user data hashing ==========
  const processedUserData = Object.entries(values.user_data || {}).reduce(
    (acc: any, [key, value]) => {
      if (nonHashedFields.includes(key)) {
        acc[key] = value;
      } else if (Array.isArray(value)) {
        acc[key] = value
          .filter((item: string) => item) // Remove empty values
          .map((item: string) => {
            // Normalize special fields before hashing
            if (key === 'email') return hashData(normalizeEmail(item));
            if (key === 'phone') return hashData(normalizePhone(item));
            return hashData(item);
          });
      } else if (value !== undefined && value !== null && value !== '') {
        // Normalize special fields before hashing
        if (key === 'email') {
          acc[key] = hashData(normalizeEmail(value as string));
        } else if (key === 'phone') {
          acc[key] = hashData(normalizePhone(value as string));
        } else {
          acc[key] = hashData(value as string);
        }
      }
      return acc;
    },
    {}
  );

  const fbc = fbq.getFbc();
  const fbp = fbq.getFbp();

  // ========== OPTIMIZATION 6: Always include FBC/FBP if available ==========
  const user_data = {
    ...processedUserData,
    client_user_agent:
      typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    client_ip_address: userIp || undefined,
  };

  // Only add FBC/FBP if they exist
  if (fbp) user_data.fbp = fbp;
  if (fbc) user_data.fbc = fbc;

  return {
    event_name,
    event_id: eventId,
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    event_source_url:
      typeof window !== 'undefined' ? window.location.href : '',
    user_data,
    custom_data,
    original_event_data: {
      event_name: event_name,
      event_time: Math.floor(Date.now() / 1000),
    },
  };
}

export default async function triggerEvents(
  eventName: string,
  eventData: EventData,
  eventId?: string
): Promise<SendingData | null> {
  try {
    // Check browser environment
    if (typeof window === 'undefined') {
      console.warn('triggerEvents called in non-browser environment');
      return null;
    }

    const response = await fetch('/api/facebookApi', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const PIXEL_ID = data.api_id;
    const ACCESS_TOKEN = data.access_token;

    if (!PIXEL_ID || !ACCESS_TOKEN) {
      console.error('Missing Pixel ID or Access Token');
      return null;
    }

    const finalEventId: string = eventId || uuidv4();
    const sendData = await createSendingData(eventData, eventName, finalEventId);

    // ========== OPTIMIZATION 7: Send BOTH user_data AND custom_data to pixel ==========
    const pixelEventData = {
      ...sendData.custom_data,
      ...sendData.user_data,
    };

    fbq.event(eventName, pixelEventData, finalEventId);
    console.log('Facebook Pixel client-side event:', {
      eventName,
      eventId: finalEventId,
      hasUserData: Object.keys(sendData.user_data).length > 0,
      hasCustomData: Object.keys(sendData.custom_data).length > 0,
      fbc: sendData.user_data.fbc ? 'present' : 'missing',
      fbp: sendData.user_data.fbp ? 'present' : 'missing',
    });

    // Send to GTM
    try {
      sendGTMEvent(eventName, JSON.stringify(pixelEventData));
    } catch (gtmError) {
      console.warn('GTM error:', gtmError);
    }

    // ========== OPTIMIZATION 8: Server-side with validation ==========
    const formData = new FormData();
    formData.append('data', JSON.stringify([sendData]));
    formData.append('access_token', ACCESS_TOKEN);

    const pixelResponse = await fetch(
      `https://graph.facebook.com/v21.0/${PIXEL_ID}/events`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!pixelResponse.ok) {
      const errorData = await pixelResponse.json();
      console.error('Facebook API error:', errorData);
      throw new Error(
        `HTTP ${pixelResponse.status}: ${JSON.stringify(errorData)}`
      );
    }

    const responseData = await pixelResponse.json();
    console.log('Facebook event success:', {
      eventId: finalEventId,
      fblsSuccess: responseData.fblsResult,
    });

    return sendData;
  } catch (error) {
    console.error('Event tracking failed:', error);
    return null;
  }
}