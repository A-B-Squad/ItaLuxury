import Breadcumb from "@/app/components/Breadcumb";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import React from "react";

const PrivacyPolicy = dynamic(() => import("./Terms-of-use"), { ssr: false });

export const metadata: Metadata = {
  title: "Conditions d'Utilisation",
  description:
    "Consultez nos conditions d'utilisation pour utiliser notre site ecommerce en toute sécurité.",
  openGraph: {
    title: "Conditions d'Utilisation",
    description:
      "Consultez nos conditions d'utilisation pour utiliser notre site ecommerce en toute sécurité.",

    type: "website",
    url: "https://www.ita-luxury.com/productComparison",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/LOGO.jpg`,
        width: 1200,
        height: 630,
        alt: "Comparaison de Produits ita-luxury",
      },
    ],
  },
};
const pageTermsOfUse = () => {
  const breadcrumbPaths = [
    { href: "/", label: "Accueil" },
    { href: "/Terms-of-use", label: "Conditions d'Utilisation", }
  ];
  return (
    <div className="p-6">
          <Breadcumb Path={breadcrumbPaths} />

      <PrivacyPolicy />;
    </div>
  );
};

export default pageTermsOfUse;
