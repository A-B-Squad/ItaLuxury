import React from "react";
import { Metadata } from "next";
import ProductComparison from "./productComparison";
import Breadcumb from "@/app/components/Breadcumb";
import { cookies } from "next/headers";
import { decodeToken } from "@/utils/tokens/token";
import { getUser } from "@/utils/getUser";

const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL_DOMAIN ?? "https://ita-luxury.com").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Comparaison de Produits",
  description: "Comparez facilement les caractéristiques, les prix et les avis des produits sur ita-luxury. Trouvez le meilleur produit pour vos besoins.",

  openGraph: {
    title: "Comparaison de Produits | ita-luxury",
    description: "Comparez facilement les produits sur ita-luxury. Trouvez le meilleur choix pour vous.",
    type: "website",
    url: `${baseUrl}/productComparison`,
    images: [
      {
        url: `${baseUrl}/images/logos/LOGO-WHITE-BG.webp`,
        width: 1200,
        height: 630,
        alt: "Comparaison de Produits ita-luxury",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Comparaison de Produits | ita-luxury",
    description: "Comparez facilement les produits sur ita-luxury.",
    images: [`${baseUrl}/images/logos/LOGO-WHITE-BG.webp`],
  },

  alternates: {
    canonical: `${baseUrl}/productComparison`,
  },

  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
};
const ProductComparisonPage = async () => {
  const token = cookies().get('Token')?.value
  const decodedUser = token ? decodeToken(token) : null;
  const userData = await getUser(decodedUser?.userId);
  const breadcrumbPaths = [
    { href: "/", label: "Accueil" },
    { href: "/productComparison", label: "Comparaison de Produits" }
  ];

  return (
    <div className="p-6">
      <Breadcumb Path={breadcrumbPaths} />
      <ProductComparison userData={userData} />
    </div>
  );
};

export default ProductComparisonPage;
