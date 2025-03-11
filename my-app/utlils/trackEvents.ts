import crypto from "crypto";
import * as fbq from "./pixel";
import { getUserIpAddress } from "./getUserIpAddress";
import { v4 as uuidv4 } from "uuid";
import { sendGTMEvent } from "@next/third-parties/google";

// Define types for better type safety
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

function hashData(data: string | undefined): string {
  if (!data) return '';
  return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
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

// Function to clean contents data to only include Facebook-approved fields
function cleanContentsData(contents: any[]): any[] {
  const allowedFields = ['id', 'quantity', 'item_price', 'title', 'description', 'brand', 'category', 'delivery_category'];

  return contents.map(item => {
    const cleanedItem: any = {};
    for (const field of allowedFields) {
      if (item[field] !== undefined) {
        if (field === 'item_price') {
          cleanedItem[field] = Number(item[field]) || 0;
        } else {
          cleanedItem[field] = item[field];
        }
      }
    }
    return cleanedItem;
  });
}

function formatValue(value: any): number {
  // Convert to number and ensure it's not NaN
  const numValue = Number(value);
  return isNaN(numValue) ? 0 : Number(numValue.toFixed(3));
}

async function createSendingData(
  values: EventData,
  event_name: string,
  eventId: string
): Promise<SendingData> {
  const userIp = await getUserIpAddress();
  const nonHashedFields = ['client_user_agent', 'client_ip_address', 'fbc', 'fbp'];

  let custom_data = removeTypename(values.custom_data || {});

  // Ensure value is a valid number
  if (custom_data.value !== undefined) {
    custom_data.value = formatValue(custom_data.value);
  }

  if (custom_data.contents) {
    custom_data.contents = Array.isArray(custom_data.contents)
      ? cleanContentsData(custom_data.contents)
      : cleanContentsData([custom_data.contents]);
  }

  // Process user_data: hash all fields except those in nonHashedFields
  const processedUserData = Object.entries(values.user_data || {}).reduce((acc: any, [key, value]) => {
    if (nonHashedFields.includes(key)) {
      acc[key] = value;
    } else if (Array.isArray(value)) {
      acc[key] = value.map((item: string) => hashData(item));
    } else if (value !== undefined && value !== null) {
      acc[key] = hashData(value as string);
    }
    return acc;
  }, {});

  return {
    event_name,
    event_id: eventId,
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    event_source_url: typeof window !== 'undefined' ? window.location.href : '',
    user_data: {
      ...processedUserData,
      client_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      client_ip_address: userIp || undefined,
      fbp: fbq.getFbp(),
      fbc: fbq.getFbc(),
    },
    custom_data,
    original_event_data: {
      "event_name": event_name,
      "event_time": Math.floor(Date.now() / 1000)
    }
  };
}

export default async function triggerEvents(eventName: string, eventData: EventData): Promise<SendingData | null> {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      console.warn('triggerEvents called in a non-browser environment');
      return null;
    }

    const response = await fetch("/api/facebookApi", {
      headers: {
        "Content-Type": "application/json",
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

    const eventId: string = uuidv4();
    const sendData = await createSendingData(eventData, eventName, eventId);

    // Client-side event
    fbq.event(eventName, sendData.custom_data, eventId);

    // Send to Google Tag Manager
    try {
      // Convert custom_data to a string representation for GTM
      const gtmData = JSON.stringify(sendData.custom_data);
      sendGTMEvent(eventName, gtmData);
    } catch (gtmError) {
      console.warn('Error sending GTM event:', gtmError);
    }

    // Create FormData object
    const formData = new FormData();
    formData.append('data', JSON.stringify([sendData]));
    formData.append('access_token', ACCESS_TOKEN);
    formData.append('test_event_code', "TEST53186");

    // Server-side event
    const pixelResponse = await fetch(
      `https://graph.facebook.com/v21.0/${PIXEL_ID}/events`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!pixelResponse.ok) {
      const errorData = await pixelResponse.json();
      throw new Error(`HTTP error! status: ${pixelResponse.status}, message: ${JSON.stringify(errorData)}`);
    }

    console.log('Facebook Pixel event sent successfully');
    return sendData;
  } catch (error) {
    console.error("Error sending Facebook Pixel event:", error);
    return null;
  }
}

