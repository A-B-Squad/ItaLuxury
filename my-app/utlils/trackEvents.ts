import crypto from 'crypto';
import * as fbq from "./pixel";
import { getUserIpAddress } from "./getUserIpAddress";

function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
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

async function createSendingData(
  values: any,
  event_name: string,
  eventId: string
) {
  const userIp = await getUserIpAddress();

  let custom_data = removeTypename(values.custom_data || {});
  if (custom_data.contents) {
    custom_data.contents = Array.isArray(custom_data.contents)
      ? custom_data.contents.map((item: any) => typeof item === 'object' ? item : { id: item })
      : [typeof custom_data.contents === 'object' ? custom_data.contents : { id: custom_data.contents }];
  }

  return {
    event_name,
    event_id: eventId,
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    event_source_url: window.location.href,
    user_data: {
      ...values.user_data,
      em: values.user_data.em ? values.user_data.em.map(hashData) : undefined,
      ph: values.user_data.ph ? values.user_data.ph.map(hashData) : undefined,
      external_id: values.user_data.external_id ? hashData(values.user_data.external_id) : undefined,
      client_user_agent: navigator.userAgent,
      client_ip_address: userIp || undefined,
      fbp: fbq.getFbp(),
      fbc: fbq.getFbc(),
    },
    custom_data,
  };
}

export default async function triggerEvents(eventName: string, eventData: any) {
  try {
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
    const ACCESS_KEY = data.access_token;

    const eventId: string = crypto.randomUUID();
    const sendData = await createSendingData(eventData, eventName, eventId);

    // Client-side event
    fbq.event(eventName, sendData.custom_data, { eventID: eventId });

    // Server-side event
    const pixelResponse = await fetch(
      `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${ACCESS_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: [sendData],
          // test_event_code: process.env.NEXT_PUBLIC_TEST_ID,
        }),
      }
    );

    if (!pixelResponse.ok) {
      throw new Error(`HTTP error! status: ${pixelResponse.status}`);
    }

    console.log('Facebook Pixel event sent successfully');
  } catch (error) {
    console.error("Error sending Facebook Pixel event:", error);
  }
}