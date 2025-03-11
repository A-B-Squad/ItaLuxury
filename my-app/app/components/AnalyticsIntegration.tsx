"use client";
import { GoogleTagManager } from '@next/third-parties/google';
import Script from 'next/script';
import React, { useEffect, useState } from "react";

const AnalyticsIntegration = () => {
  const [fbData, setFbData] = useState({
    domainVerification: null,
    api_id: null,
  });

  useEffect(() => {
    const fetchFacebookData = async () => {
      try {
        const response = await fetch("/api/facebookApi", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setFbData(data);
      } catch (error) {
        console.error("Error fetching Facebook data:", error);
      }
    };

    fetchFacebookData();
  }, []);

  return (
    <>
      {fbData.domainVerification && (
        <meta
          name="facebook-domain-verification"
          content={fbData.domainVerification}
        />
      )}

      {/* Static Facebook app ID meta tag for Open Graph */}
      <meta property="fb:app_id" content="1809715203170770" />

      {/* Meta tags for Bing and Google site verification */}
      <meta name="msvalidate.01" content="9D6F4D25955329EA808B74416C671943" />
      <meta name="google-site-verification" content="mNgh_Cr_ANLEQ34Grw9MdpyVZO42QknZyFHMVErtSNE" />

      {/* Google Tag Manager */}
      <GoogleTagManager gtmId="GTM-T7FRWMJ3" />

      {/* Pusher Beams for notifications */}
      <Script
        src="https://js.pusher.com/beams/1.0.0/push-notifications-cdn.js"
        strategy="beforeInteractive"
      />

      <Script id="pusher-beams-init" strategy="afterInteractive">
        {`
          try {
            const beamsClient = new PusherPushNotifications.Client({
              instanceId: 'e7307155-0ed4-4c85-8198-822101af6f25',
            });
            
            beamsClient.start()
              .then(() => beamsClient.addDeviceInterest('hello'))
              .then(() => beamsClient.getDeviceInterests())
              .then((interests) => console.log("Current interests:", interests))
              .catch((error) => console.error("Pusher Beams error:", error));
          } catch (e) {
            console.error("Failed to initialize Pusher Beams:", e);
          }
        `}
      </Script>
    </>
  );
};

export default AnalyticsIntegration;
