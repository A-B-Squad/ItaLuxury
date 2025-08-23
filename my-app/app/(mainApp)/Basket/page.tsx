import React from "react";
import { Metadata } from "next";
import Basket from "./Basket";
import keywords from "@/public/scripts/keywords";
import { cookies } from "next/headers";
import { decodeToken } from "@/utlils/tokens/token";
import { getUser } from "@/utlils/getUser";
import { getCompanyInfo } from "@/utlils/getCompanyInfo";

if (
  !process.env.NEXT_PUBLIC_API_URL ||
  !process.env.NEXT_PUBLIC_BASE_URL_DOMAIN
) {
  throw new Error("NEXT_PUBLIC_API_URL or BASE_URL_DOMAIN is not defined");
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL_DOMAIN),
  title: "Panier | ita-luxury - Votre boutique en ligne en Tunisie",
  description:
    "Finalisez votre achat en ligne avec ita-luxury. Profitez des meilleures offres et promotions sur nos produits de qualité en Tunisie.",
  keywords: keywords.join(","),
  openGraph: {
    url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/panier`,
    type: "website",
    title: "Panier | ita-luxury - Votre boutique en ligne en Tunisie",
    description:
      "Finalisez votre achat en ligne avec ita-luxury. Profitez des meilleures offres et promotions sur nos produits de qualité en Tunisie.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/images/logos/LOGO.jpg`,
        width: 1200,
        height: 630,
        alt: "ita-luxury",
      },
    ],
  },
  alternates: {
    canonical: "https://www.ita-luxury.com/Basket",
  },
  robots: "index, follow",
};

const BasketPage = async() => {
  const cookieStore = cookies()
  const token = cookieStore.get('Token')?.value
  const decodedUser = token ? decodeToken(token) : null;
  const userData = await getUser(decodedUser?.userId);
  const companyData = await getCompanyInfo();
  return <Basket userData={userData} companyData={companyData} />;
};

export default BasketPage;
