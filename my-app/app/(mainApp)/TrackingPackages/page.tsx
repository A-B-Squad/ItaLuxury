import React from "react";
import TrackingPackages from "./TrackingPackages";

import { Metadata } from "next";
import { getCompanyInfo } from "@/utlils/getCompanyInfo";

if (
  !process.env.NEXT_PUBLIC_API_URL ||
  !process.env.NEXT_PUBLIC_BASE_URL_DOMAIN
) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_DOMAIN.replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Suivi de colis",
  description: "Suivez vos colis en temps réel avec ita-luxury pour une expérience d'achat optimale.",

  openGraph: {
    url: `${baseUrl}/TrackingPackages`,
    type: "website",
    title: "Suivi de colis - ita-luxury",
    description: "Suivez vos colis en temps réel avec ita-luxury pour une expérience d'achat optimale.",
    images: [
      {
        url: `${baseUrl}/images/logos/LOGO-WHITE-BG.webp`,
        width: 1200,
        height: 630,
        alt: "ita-luxury - Suivi de colis",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Suivi de colis - ita-luxury",
    description: "Suivez vos colis en temps réel",
    images: [`${baseUrl}/images/logos/LOGO-WHITE-BG.webp`],
  },

  alternates: {
    canonical: `${baseUrl}/TrackingPackages`,
  },
};
const TrackingPackagesPage = async () => {
  const companyData = await getCompanyInfo();

  return <TrackingPackages companyData={companyData} />;
};

export default TrackingPackagesPage;
