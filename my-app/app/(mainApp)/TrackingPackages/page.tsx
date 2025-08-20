import React from "react";
import TrackingPackages from "./TrackingPackages";

import { Metadata } from "next";
import keywords from "@/public/scripts/keywords";
import { getCompanyInfo } from "@/utlils/getCompanyInfo";

if (
  !process.env.NEXT_PUBLIC_API_URL ||
  !process.env.NEXT_PUBLIC_BASE_URL_DOMAIN
) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL_DOMAIN),
  title: "Suivi de colis - ita-luxury",
  description:
    "Suivez vos colis en temps réel avec ita-luxury pour une expérience d'achat optimale.",
  keywords: keywords.join(","),

  openGraph: {
    url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/TrackingPackages`,
    type: "website",
    title: "Suivi de colis - ita-luxury",
    description:
      "Suivez vos colis en temps réel avec ita-luxury pour une expérience d'achat optimale.",
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
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/TrackingPackages`,

  },
};

const TrackingPackagesPage = async () => {
  const companyData = await getCompanyInfo();

  return <TrackingPackages companyData={companyData} />;
};

export default TrackingPackagesPage;
