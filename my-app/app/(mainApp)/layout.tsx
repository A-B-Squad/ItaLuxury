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
if (!process.env.BASE_URL_DOMAIN) {
  throw new Error("BASE_URL_DOMAIN is not defined");
}
export const metadata: Metadata = {
  metadataBase: new URL(process.env.BASE_URL_DOMAIN),
  title:
    "Vente en ligne en Tunisie : Découvrez des offres exclusives sur notre plateforme",
  description:
    "Parcourez notre sélection d'offres exclusives et trouvez les meilleurs produits en ligne en Tunisie. Profitez de promotions exceptionnelles sur une large gamme de produits. Commandez dès maintenant !",
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





  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }
  const { data: CompanyInfoData } = await fetch(
    process.env.NEXT_PUBLIC_API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
      query CompanyInfo {
        companyInfo {
          id
          phone
          logo
        }
      }
  `,
      }),
    },
  ).then((res) => res.json());




  return (
    <>
      <Contact CompanyInfoData={CompanyInfoData} />
      <DrawerMobile />
      <BasketDrawer />
      <Header CompanyInfoData={CompanyInfoData} />
      <ApolloWrapper>{children}</ApolloWrapper>
      <Footer />
    </>
  );
}
