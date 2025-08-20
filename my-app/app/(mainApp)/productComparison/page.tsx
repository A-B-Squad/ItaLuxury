import React from "react";
import { Metadata } from "next";
import ProductComparison from "./productComparison";
import keywords from "@/public/scripts/keywords";
import Breadcumb from "@/app/components/Breadcumb";
import { cookies } from "next/headers";
import { decodeToken } from "@/utlils/tokens/token";
import { getUser } from "@/utlils/getUser";

export const metadata: Metadata = {
  title: "Comparaison de Produits | ita-luxury",
  description:
    "Comparez facilement les caractéristiques, les prix et les avis des produits sur ita-luxury. Trouvez le meilleur produit pour vos besoins.",
  keywords: [
    ...keywords,
    "comparaison de produits",
    "comparateur",
    "meilleur choix",
  ].join(", "),
  openGraph: {
    title: "Comparaison de Produits | ita-luxury",
    description:
      "Comparez facilement les produits sur ita-luxury. Trouvez le meilleur choix pour vous.",
    type: "website",
    url: "https://www.ita-luxury.com/productComparison",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/images/logos/LOGO.jpg`,
        width: 1200,
        height: 630,
        alt: "Comparaison de Produits ita-luxury",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Comparaison de Produits | ita-luxury",
    description:
      "Comparez facilement les produits sur ita-luxury. Trouvez le meilleur choix pour vous.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/images/logos/LOGO.jpg`,
        width: 1200,
        height: 630,
        alt: "Comparaison de Produits ita-luxury",
      },
    ],
  },
  alternates: {
    canonical: "https://www.ita-luxury.com/productComparison",
  },
};

const ProductComparisonPage = async () => {
  const cookieStore = cookies()
  const token = cookieStore.get('Token')?.value
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
