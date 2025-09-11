import Breadcumb from "@/app/components/Breadcumb";
import { getCompanyInfo } from "@/utlils/getCompanyInfo";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import React from "react";

const TermsOfUse = dynamic(() => import("./Terms-of-use"), { ssr: false });

export const metadata: Metadata = {
  title: "Conditions d'Utilisation",
  description:
    "Consultez nos conditions d'utilisation pour utiliser notre site ecommerce en toute sécurité.",
  openGraph: {
    title: "Conditions d'Utilisation",
    description:
      "Consultez nos conditions d'utilisation pour utiliser notre site ecommerce en toute sécurité.",
    type: "website",
    url: "https://www.ita-luxury.com/Terms-of-use",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/images/logos/LOGO-WHITE-BG.webp`,
        width: 1200,
        height: 630,
        alt: "Conditions d'Utilisation ita-luxury",
      },
    ],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/Terms-of-use`,
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
