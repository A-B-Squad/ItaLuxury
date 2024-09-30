import { ApolloWrapper } from "@/lib/apollo-wrapper";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import AnalyticsIntegration from "./components/AnalyticsIntegration";
import Script from "next/script";
import PhonePopUpBasket from "./components/PhonePopUpBasket";

if (process.env.NODE_ENV !== "production") {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

const openSans = Open_Sans({
  subsets: ["cyrillic"],
});

export const metadata: Metadata = {
  title:
    "Vente en ligne en Tunisie : Découvrez des offres exclusives sur notre plateforme",
  description:
    "Parcourez notre sélection d'offres exclusives et trouvez les meilleurs produits en ligne en Tunisie. Profitez de promotions exceptionnelles sur une large gamme de produits. Commandez dès maintenant !",
};

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
        <PhonePopUpBasket />
      </body>
    </html>
  );
}
