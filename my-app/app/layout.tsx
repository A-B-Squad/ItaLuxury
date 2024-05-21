import { ApolloWrapper } from "@/lib/apollo-wrapper";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import React from "react";
import { Toaster } from "@/components/ui/toaster";

if (process.env.NODE_ENV !== "production") {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

const openSans = Open_Sans({
  subsets: ["latin"],
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
        <link rel="icon" href="./public/images/favicon.ico" sizes="any" />
      </head>
      <body className={openSans.className}>
        <ApolloWrapper>{children}</ApolloWrapper>
        <Toaster />
      </body>
    </html>
  );
}
