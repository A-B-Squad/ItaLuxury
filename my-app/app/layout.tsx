import { ApolloWrapper } from "@/lib/apollo-wrapper";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import "./globals.css";
import type { Metadata } from "next";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import AnalyticsIntegration from "./components/AnalyticsIntegration";
import WhatsAndBasketPopUp from "./components/WhatsAndBasketPopUp";
import TabBar from "./components/TabBar";
import Script from "next/script";
import keywords from "@/public/keywords";

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
        <ApolloWrapper>{children}</ApolloWrapper>
        <Toaster />
        <WhatsAndBasketPopUp />
        <TabBar />
        <TawkToScript />
      </body>
    </html>
  );
}
