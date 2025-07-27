import AnalyticsIntegration from "@/app/components/AnalyticsIntegration";
import TabBarMobile from "@/app/components/TabBarMobile";
import FloatingActionButtons from "./components/FloatingActionButtons";
import { Toaster } from "@/components/ui/toaster";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
import keywords from "@/public/keywords";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import type { Metadata } from "next";
import React from "react";
import "./globals.css";

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

  title: {
    template: '%s | Ita Luxury',
    default: 'Ita Luxury - Vente en ligne en Tunisie'
  },
  description: "Parcourez notre sélection d'offres exclusives et trouvez les meilleurs produits en ligne en Tunisie. Profitez de promotions exceptionnelles sur une large gamme de produits.",
  icons: {
    icon: '/favicon.ico'
  },
  keywords: keywords.join(","),

  openGraph: {
    type: "website",
    siteName: "Ita Luxury",
    title: "Ita Luxury - Vente en ligne en Tunisie",
    description: "Parcourez notre sélection d'offres exclusives et trouvez les meilleurs produits en ligne en Tunisie.",
    images: [
      {
        url: `/LOGO.png`,
        width: 1200,
        height: 630,
        alt: "Ita Luxury",
      },
    ],
  },
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <AnalyticsIntegration />
      </head>
      <body>
        <ApolloWrapper>{children}</ApolloWrapper>
        <Toaster />
        <FloatingActionButtons />
        <TabBarMobile />
      </body>
    </html>
  );
}
