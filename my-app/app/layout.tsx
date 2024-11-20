import AnalyticsIntegration from "@/app/components/AnalyticsIntegration";
import TabBar from "@/app/components/TabBar";
import WhatsAndBasketPopUp from "@/app/components/WhatsAndBasketPopUp";
import { Toaster } from "@/components/ui/toaster";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
import keywords from "@/public/keywords";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import type { Metadata } from "next";
import Script from "next/script";
import React from "react";
import "./globals.css";
import NotificationHandler from "./components/NotificationHandler";
import { onMessage } from "firebase/messaging";
import { useToast } from "@/components/ui/use-toast";
import { messaging } from "@/lib/fireBase/firebase";
import FirebaseNotificationHandler from "./components/NotfHandle";


if (process.env.NODE_ENV !== "production") {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}
if (!process.env.NEXT_PUBLIC_BASE_URL_DOMAIN) {
  throw new Error("BASE_URL_DOMAIN is not defined");
}
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL_DOMAIN),

  title:
    "Vente en ligne en Tunisie : Découvrez des offres exclusives sur notre plateforme",
  description:
    "Parcourez notre sélection d'offres exclusives et trouvez les meilleurs produits en ligne en Tunisie. Profitez de promotions exceptionnelles sur une large gamme de produits. Commandez dès maintenant !",

  keywords: keywords.join(","),

  openGraph: {
    type: "website",
    title:
      "Vente en ligne en Tunisie : Découvrez des offres exclusives sur notre plateforme",
    description:
      "Parcourez notre sélection d'offres exclusives et trouvez les meilleurs produits en ligne en Tunisie. Profitez de promotions exceptionnelles sur une large gamme de produits. Commandez dès maintenant !",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/LOGO.jpg`,
        width: 1200,
        height: 630,
        alt: "ita-luxury",
      },
    ],
  },
};

function TawkToScript() {
  return (
    <Script strategy="lazyOnload">
      {`
        var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
        Tawk_API.customStyle = {
		visibility : {
	
      mobile : {
				position : 'br',
				xOffset : '10px',
				yOffset : "98px"
			},
		
		}
	};
        (function(){
        var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
        s1.async=true;
        s1.src='https://embed.tawk.to/6703c5c402d78d1a30ed99bf/1i9jbp1qk';
        s1.charset='UTF-8';
        s1.setAttribute('crossorigin','*');
        s0.parentNode.insertBefore(s1,s0);
        })();
      `}
    </Script>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 
  return (
    <html lang="en">
      <head>
        <AnalyticsIntegration />
      </head>
      <body>
        {/* <NotificationHandler /> */}
        {/* <FirebaseNotificationHandler/> */}
        <ApolloWrapper>{children}</ApolloWrapper>
        <Toaster />
        <WhatsAndBasketPopUp />
        <TabBar />
        <TawkToScript />
      </body>
    </html>
  );
}
