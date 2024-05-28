import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import dynamic from "next/dynamic";
import React from "react";
import "../../app/globals.css";
import { ApolloWrapper } from "../../lib/apollo-wrapper";
const BasketDrawer = dynamic(() => import("../components/BasketDrawer"));
const DrawerMobile = dynamic(
  () => import("../components/Header/CrategoryDrawer/DrawerMobile")
);
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

if (process.env.NODE_ENV !== "production") {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

const openSans = Open_Sans({
  subsets: ["latin"],
});
if (!process.env.BASE_URL_DOMAIN) {
  throw new Error("BASE_URL_DOMAIN is not defined");
}
export const metadata: Metadata = {
  metadataBase: new URL(process.env.BASE_URL_DOMAIN),
  // title:
  //   "Vente en ligne en Tunisie : Découvrez des offres exclusives sur notre plateforme",
  // description:
  //   "Parcourez notre sélection d'offres exclusives et trouvez les meilleurs produits en ligne en Tunisie. Profitez de promotions exceptionnelles sur une large gamme de produits. Commandez dès maintenant !",
  keywords: [
    "vente en ligne",
    "Tunisie",
    "offres exclusives",
    "promotions",
    "achat en ligne",
    "produits Tunisie",
    "maison Ng",
  ],

  openGraph: {
    type: "website",
    title:
      "Vente en ligne en Tunisie : Découvrez des offres exclusives sur notre plateforme",
    description:
      "Parcourez notre sélection d'offres exclusives et trouvez les meilleurs produits en ligne en Tunisie. Profitez de promotions exceptionnelles sur une large gamme de produits. Commandez dès maintenant !",
    images: [
      {
        url: "../public/images/logo.jpeg",
        width: 800,
        height: 600,
        alt: "Maison Ng",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html lang="en">
    //   <head>
    //     <link rel="icon" href="../public/images/favicon.ico" sizes="any" />
    //   </head>
      <div className={`${openSans.className} relative`}>
        <DrawerMobile />
        <BasketDrawer />
        <Header />
        <ApolloWrapper>{children}</ApolloWrapper>
        <Footer />
      </div>
    // </html>
  );
}
