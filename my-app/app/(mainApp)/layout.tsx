import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import React, { Suspense } from "react";
import "../../app/globals.css";
import { ApolloWrapper } from "../../lib/apollo-wrapper";
import BasketDrawer from "../components/BasketDrawer";
import { DrawerMobile } from "../components/Header/CrategoryDrawer/DrawerMobile";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Contact from "../components/Header/Contact";

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
    <>
      <Contact />
      <DrawerMobile />
      <BasketDrawer />
      <Header />
      <ApolloWrapper>{children}</ApolloWrapper>
      <Footer />
    </>
  );
}
