import { GoogleTagManager } from '@next/third-parties/google';
import Script from 'next/script';
import React from "react";

// Server-side function to fetch Facebook credentials
async function getFacebookCredentials() {
  const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_API_URL;

  if (!GRAPHQL_ENDPOINT) return null;

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query getApiCredentials($integrationFor: String) {
            getApiCredentials(integrationFor: $integrationFor) {
              domainVerification
              api_id
            }
          }
        `,
        variables: { integrationFor: "FACEBOOK" },
      }),
    });

    const result = await response.json();
    return result.data?.getApiCredentials;
  } catch (error) {
    console.error("Error fetching Facebook credentials:", error);
    return null;
  }
}

const AnalyticsIntegration = async () => {
  const fbData = await getFacebookCredentials();
  const pixelId = fbData?.api_id;

  return (
    <>
      {/* Meta tags should be rendered as children of head */}
      {fbData?.domainVerification && (
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

      {pixelId && (
        <>
          <Script
            id="fb-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${pixelId}');
                fbq('track', 'PageView');
              `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )}

      {/* Pusher Beams for notifications */}
      <Script
        src="https://js.pusher.com/beams/2.1.0/push-notifications-cdn.js"
        strategy="beforeInteractive"
      />

      {/* Microsoft Clarity for user behavior analytics */}
      <Script
        id="microsoft-clarity"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "sk4ho9z9a4");
          `,
        }}
      />

      {/* Pusher Beams Initialization */}
      <Script
        id="pusher-beams-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            function initPusherBeams() {
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

            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', initPusherBeams);
            } else {
              initPusherBeams();
            }
          `,
        }}
      />
    </>
  );
};

export default AnalyticsIntegration;