"use client"
import Script from "next/script";
import React, { useEffect, useState } from "react";

const AnalyticsIntegration = () => {
  const [fbData, setFbData] = useState({ domainVerification: null, api_id: null });

  useEffect(() => {
    const fetchFacebookData = async () => {
      try {
        const response = await fetch("/api/facebookApi", {
          headers: {
            "Content-Type": "application/json",
          },
        });
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
      {/* Google Tag Manager */}
      <Script
        id="gtm"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-T7FRWMJ3');
          `,
        }}
      />

      {/* Meta Pixel */}
      {/* {fbData.api_id && (
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
                fbq('init', '${fbData.api_id}');
                fbq('track', 'PageView');
              `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${fbData.api_id}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )} */}

      {/* Google Analytics */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-2C9K3VF02Y"
      ></Script>
      <Script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-2C9K3VF02Y');
        `}
      </Script>
    </>
  );
};

export default AnalyticsIntegration;