import crypto from "crypto";
import * as fbq from "./pixel";
import { getUserIpAddress } from "../getUserIpAddress";
import { v4 as uuidv4 } from "uuid";

interface UserData {
  em?: string;
  ph?: string;
  fn?: string;
  ln?: string;
  ct?: string;
  st?: string;
  zp?: string;
  country?: string;
  external_id?: string;
  [key: string]: string | undefined;
}

interface CustomData {
  content_name?: string;
  content_ids?: string[];
  content_type?: string;
  value?: number;
  currency?: string;
  contents?: Array<{
    id: string;
    quantity: number;
    item_price?: number;
  }>;
  num_items?: number;
  [key: string]: any;
}

interface EventData {
  user_data?: UserData;
  custom_data?: CustomData;
}

interface SendingData {
  event_name: string;
  event_id: string;
  event_time: number;
  action_source: string;
  event_source_url: string;
  user_data: any;
  custom_data: CustomData;
}

// Hash data for privacy
function hashData(data: string | undefined): string {
  if (!data) return '';
  return crypto
    .createHash('sha256')
    .update(data.toLowerCase().trim())
    .digest('hex');
}

// Normalize email
function normalizeEmail(email: string): string {
  if (!email) return '';
  return email.toLowerCase().trim();
}

// Normalize phone
function normalizePhone(phone: string): string {
  if (!phone) return '';
  return phone.replaceAll(/\D/g, '');
}

// Format value
function formatValue(value: any): number {
  const numValue = Number(value);
  return Number.isNaN(numValue) ? 0 : Number(numValue.toFixed(2));
}

// Create sending data
async function createSendingData(
  values: EventData,
  event_name: string,
  eventId: string,
  userIp?: string
): Promise<SendingData> {
  const nonHashedFields = ['client_user_agent', 'client_ip_address', 'fbc', 'fbp'];

  let custom_data = values.custom_data || {};

  // Format value
  if (custom_data.value !== undefined) {
    custom_data.value = formatValue(custom_data.value);
  }

  // Uppercase currency
  if (custom_data.currency) {
    custom_data.currency = String(custom_data.currency).toUpperCase();
  }

  // Process user data with hashing
  const processedUserData = Object.entries(values.user_data || {}).reduce(
    (acc: any, [key, value]) => {
      if (nonHashedFields.includes(key)) {
        acc[key] = value;
      } else if (value !== undefined && value !== null && value !== '') {
        if (key === 'em') {
          acc[key] = hashData(normalizeEmail(value as string));
        } else if (key === 'ph') {
          acc[key] = hashData(normalizePhone(value as string));
        } else {
          acc[key] = hashData(value as string);
        }
      }
      return acc;
    },
    {}
  );

  // Get Facebook cookies
  const fbc = fbq.getFbc();
  const fbp = fbq.getFbp();

  const user_data: any = {
    ...processedUserData,
    client_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    client_ip_address: userIp || undefined,
  };

  if (fbp) user_data.fbp = fbp;
  if (fbc) user_data.fbc = fbc;

  return {
    event_name,
    event_id: eventId,
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    event_source_url: typeof window !== 'undefined' ? globalThis.location.href : '',
    user_data,
    custom_data,
  };
}

// Main trigger function
export default async function triggerEvents(
  eventName: string,
  eventData: EventData,
  eventId?: string
): Promise<SendingData | null> {
  try {
    if (typeof window === 'undefined') {
      console.log('🔄 Server-side execution - skipping Facebook tracking');
      return null;
    }

    // Get credentials from API with enhanced error handling
    let credentialsData;
    try {
      const response = await fetch('/api/facebookApi', {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        console.error('❌ Facebook API credentials fetch failed:', response.status);
        return null;
      }

      credentialsData = await response.json();

      // Validate response structure
      if (!credentialsData || typeof credentialsData !== 'object') {
        console.error('❌ Invalid Facebook API response structure');
        return null;
      }
    } catch (apiError) {
      console.error('❌ Failed to fetch Facebook API credentials:', apiError);
      return null;
    }

    const PIXEL_ID = credentialsData.api_id;
    const ACCESS_TOKEN = credentialsData.access_token;

    if (!PIXEL_ID || !ACCESS_TOKEN) {
      console.error('❌ Missing Pixel ID or Access Token in API response:', credentialsData);
      return null;
    }

    // Get user IP address - handle errors gracefully
    let userIp: string | undefined;
    try {
      userIp = await getUserIpAddress();
    } catch (ipError) {
      console.warn('⚠️ Could not retrieve user IP:', ipError);
      // Continue without IP - don't fail the whole tracking
    }

    const finalEventId: string = eventId || uuidv4();
    const sendData = await createSendingData(eventData, eventName, finalEventId, userIp);

    console.log(`🎯 Tracking ${eventName} event:`, {
      event_id: finalEventId,
      has_user_data: !!eventData.user_data,
      has_custom_data: !!eventData.custom_data,
      pixel_id: PIXEL_ID
    });

    // CLIENT SIDE: Send to Facebook Pixel
    try {
      const pixelEventData = { ...sendData.custom_data };
      fbq.event(eventName, pixelEventData, finalEventId);
      console.log(`✅ Client-side ${eventName} sent (ID: ${finalEventId})`);
    } catch (pixelError) {
      console.error('❌ Facebook Pixel error:', pixelError);
      // Continue with Conversion API even if Pixel fails
    }

    // SERVER SIDE: Send to Conversion API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify([sendData]));
      formData.append('access_token', ACCESS_TOKEN);
      // formData.append('test_event_code', "TEST49530"); // Uncomment for testing

      const pixelResponse = await fetch(
        `https://graph.facebook.com/v21.0/${PIXEL_ID}/events`,
        {
          method: 'POST',
          body: formData,
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!pixelResponse.ok) {
        const errorData = await pixelResponse.json();
        console.error('❌ Conversion API error:', {
          status: pixelResponse.status,
          error: errorData
        });
        // Don't throw - we still want to return the sendData for debugging
      } else {
        const responseData = await pixelResponse.json();
        console.log(`✅ Server-side ${eventName} sent successfully (ID: ${finalEventId})`);
      }

      return sendData;

    } catch (error: unknown) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('❌ Facebook Conversion API request timeout');
      } else {
        console.error('❌ Conversion API network error:', error);
      }
      return sendData; // Still return sendData even if API call fails
    }

  } catch (error) {
    console.error('❌ Event tracking failed:', error);
    return null;
  }
}