import React from "react";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import dynamic from "next/dynamic";
import "../../app/globals.css";
import { ApolloWrapper } from "../../lib/apollo-wrapper";
const DrawerMobile = dynamic(
  () => import("../components/Header/MobileDrawer/DrawerMobile"),
  { ssr: false },
);
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import keywords from "@/public/keywords";
import BasketDrawer from "../components/BasketDrawer";

if (process.env.NODE_ENV !== "production") {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

const openSans = Open_Sans({
  subsets: ["cyrillic"],
});
if (!process.env.NEXT_PUBLIC_BASE_URL_DOMAIN) {
  throw new Error("BASE_URL_DOMAIN is not defined");
}
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL_DOMAIN),
  title:
    "Vente en ligne en Tunisie : Découvrez des offres exclusives sur notre plateforme",
  description:
    "Parcourez notre sélection d'offres exclusives et trouvez les meilleurs produits en ligne en Tunisie. Profitez de promotions exceptionnelles sur une large gamme de produits. Commandez dès maintenant !",
  keywords: keywords,

  openGraph: {
    type: "website",
    title:
      "Vente en ligne en Tunisie : Découvrez des offres exclusives sur notre plateforme",
    description:
      "Parcourez notre sélection d'offres exclusives et trouvez les meilleurs produits en ligne en Tunisie. Profitez de promotions exceptionnelles sur une large gamme de produits. Commandez dès maintenant !",
    images: [
      {
        url: "../favicon.ico",
        width: 800,
        height: 600,
        alt: "ita-luxury",
      },
    ],
  },
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={` relative`}>
      <DrawerMobile />
      <BasketDrawer />
      <Header />
      <ApolloWrapper>{children}</ApolloWrapper>
      <Footer />
    </div>
  );
}
