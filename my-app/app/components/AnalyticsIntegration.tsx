"use client";
import { GoogleTagManager } from '@next/third-parties/google';
import Script from 'next/script';
import React from "react";
import { useFacebookData } from '../hooks/useFacebookData';

const AnalyticsIntegration = () => {
  const fbData = useFacebookData();

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
        src="https://js.pusher.com/beams/2.1.0/push-notifications-cdn.js"
        strategy="beforeInteractive"
      />

      {/* Microsoft Clarity for user behavior analytics */}
      <Script
        id="microsoft-clarity"
        strategy="afterInteractive"
      >
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "sk4ho9z9a4");
        `}
      </Script>

      {/* Pusher Beams Initialization  */}
      <Script id="pusher-beams-init" strategy="afterInteractive">
        {`
          function initPusherBeams() {
            // Check if PusherPushNotifications is available
            if (typeof PusherPushNotifications === 'undefined') {
              console.warn("Pusher Beams not loaded yet, retrying...");
              setTimeout(initPusherBeams, 500);
              return;
            }

            try {
              const beamsClient = new PusherPushNotifications.Client({
                instanceId: 'e7307155-0ed4-4c85-8198-822101af6f25',
              });
              
              beamsClient.start()
                .then(() => {
                  console.log('Pusher Beams started successfully');
                  return beamsClient.addDeviceInterest('client');
                })
                .then(() => beamsClient.getDeviceInterests())
                .then((interests) => console.log("Current interests:", interests))
                .catch((error) => console.error("Pusher Beams error:", error));
            } catch (e) {
              console.error("Failed to initialize Pusher Beams:", e);
            }
          }

          // Wait for DOM to be ready before initializing
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initPusherBeams);
          } else {
            initPusherBeams();
          }
        `}
      </Script>
    </>
  );
};

export default AnalyticsIntegration;