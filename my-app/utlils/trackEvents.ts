import * as fbq from "./pixel";
import { getUserIpAddress } from "./getUserIpAddress";

const createSendingData = async (
  values: any,
  event_name: string,
  eventId: string
) => {
  const userIp = await getUserIpAddress();

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
    custom_data: values.custom_data,
  };
};

export default async function triggerEvents(
  eventName: string,
  eventData: any
) {
  const additionalData = {};

  const eventId: string = crypto.randomUUID();
  const sendData = await createSendingData(eventData, eventName, eventId);

  fbq.event(eventName, additionalData, { eventID: eventId });

  fetch(
    `https://graph.facebook.com/v20.0/${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}/events?access_token=${process.env.NEXT_PUBLIC_FBACCESSKEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [sendData],
        test_event_code: process.env.NEXT_PUBLIC_TEST_ID,
      }),
    }
  )
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));
}
