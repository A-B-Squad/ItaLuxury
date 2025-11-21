import Breadcumb from "@/app/components/Breadcumb";
import { getCompanyInfo } from "@/utils/getCompanyInfo";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import React from "react";

const TermsOfUse = dynamic(() => import("./Terms-of-use"), { ssr: false });

const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL_DOMAIN ?? "https://ita-luxury.com").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Conditions d'Utilisation",
  description: "Consultez nos conditions générales d'utilisation. Informations importantes sur l'utilisation du site ita-luxury et vos droits en tant qu'utilisateur.",

  openGraph: {
    title: "Conditions d'Utilisation - ita-luxury",
    description: "Conditions générales d'utilisation du site ita-luxury",
    type: "website",
    url: `${baseUrl}/Terms-of-use`,
    images: [
      {
        url: `${baseUrl}/images/logos/LOGO-WHITE-BG.webp`,
        width: 1200,
        height: 630,
        alt: "Conditions d'Utilisation ita-luxury",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Conditions d'Utilisation - ita-luxury",
    description: "Conditions générales d'utilisation du site ita-luxury",
    images: [`${baseUrl}/images/logos/LOGO-WHITE-BG.webp`],
  },

  alternates: {
    canonical: `${baseUrl}/Terms-of-use`,
  },

  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
};

const PageTermsOfUse = async () => {
  const companyData = await getCompanyInfo();

  const breadcrumbPaths = [
    { href: "/", label: "Accueil" },
    { href: "/Terms-of-use", label: "Conditions d'Utilisation" }
  ];

  return (
    <div className="p-6">
      <Breadcumb Path={breadcrumbPaths} />
      <TermsOfUse companyData={companyData} />
    </div>
  );
};

export default PageTermsOfUse;
