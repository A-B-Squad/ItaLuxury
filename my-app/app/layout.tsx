import { ApolloWrapper } from "@/lib/apollo-wrapper";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import "./globals.css";
import type { Metadata } from "next";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import AnalyticsIntegration from "./components/AnalyticsIntegration";
import WhatsAndBasketPopUp from "./components/WhatsAndBasketPopUp";
import TabBar from "./components/TabBar";

if (process.env.NODE_ENV !== "production") {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

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
        <WhatsAndBasketPopUp />
        <TabBar />
      </body>
    </html>
  );
}
