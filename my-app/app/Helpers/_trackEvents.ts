export const trackEvent = (eventName: string, eventData: any) => {
    console.log(`Tracking event: ${eventName}`, eventData);
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", eventName, eventData);
    } else {
      console.log("fbq not available");
    }
  };