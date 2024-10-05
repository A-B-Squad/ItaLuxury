import * as fbq from "./pixel";
import { getUserIpAddress } from "./getUserIpAddress";

// Function to recursively remove __typename fields
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

const createSendingData = async (
  values: any,
  event_name: string,
  eventId: string
) => {
  const userIp = await getUserIpAddress();

  // Ensure custom_data.contents is an array of objects
  let custom_data = values.custom_data || {};
  if (custom_data.contents) {
    if (Array.isArray(custom_data.contents)) {
      custom_data.contents = custom_data.contents.map((item: any) => {
        if (typeof item !== 'object' || item === null) {
          return { item: item };
        }
        return item;
      });
    } else if (typeof custom_data.contents === 'object' && custom_data.contents !== null) {
      // If contents is a single object, wrap it in an array
      custom_data.contents = [custom_data.contents];
    } else {
      // If contents is neither an array nor an object, create an array with one item
      custom_data.contents = [{ item: custom_data.contents }];
    }
  }

  // Remove __typename fields from custom_data
  custom_data = removeTypename(custom_data);

  return {
    event_name: event_name,
    event_id: eventId,
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    event_source_url: window.location.href,
    user_data: {
      ...values.user_data,
      client_user_agent: navigator.userAgent,
      client_ip_address: userIp || "0.0.0.0",
    },
    custom_data: custom_data,
  };
};

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

    const additionalData = {};

    const eventId: string = crypto.randomUUID();
    const sendData = await createSendingData(eventData, eventName, eventId);
    console.log(sendData);

    fbq.event(eventName, additionalData, { eventID: eventId });

    const pixelResponse = await fetch(
      `https://graph.facebook.com/v20.0/${PIXEL_ID}/events?access_token=${ACCESS_KEY}`,
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

    const responseData = await pixelResponse.json();
    console.log(responseData);

    if (!pixelResponse.ok) {
      throw new Error(`HTTP error! status: ${pixelResponse.status}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}