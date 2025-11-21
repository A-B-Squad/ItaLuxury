import Breadcumb from "@/app/components/Breadcumb";
import { getCompanyInfo } from "@/utils/getCompanyInfo";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import React from "react";

const PrivacyPolicy = dynamic(() => import("./Privacy-Policy"), { ssr: false });

export const metadata: Metadata = {
  title: "Politique de Confidentialité",
  description:
    "Consultez notre politique de confidentialité pour comprendre comment nous traitons vos données personnelles.",
  openGraph: {
    url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/Privacy-Policy`,
    type: "website",
    title: "Politique de Confidentialité",
    description:
      "Consultez notre politique de confidentialité pour comprendre comment nous traitons vos données personnelles.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/images/logos/LOGO-WHITE-BG.webp`,
        width: 1200,
        height: 630,
        alt: "ita-luxury",
      },
    ],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/Privacy-Policy`,
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
};

const PagePrivacyPolicy = async () => {
  const companyData = await getCompanyInfo();

  const breadcrumbPaths = [
    { href: "/", label: "Accueil" },
    { href: "/Privacy-Policy", label: "Politique de Confidentialité" }
  ];

  return (
    <div className="p-6">
      <Breadcumb Path={breadcrumbPaths} />
      <PrivacyPolicy companyData={companyData} />
    </div>
  );
};

export default PagePrivacyPolicy;
