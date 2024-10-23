import React from "react";
import { Metadata } from "next";
import ProductComparison from "./productComparison";
import keywords from "@/public/keywords";

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
        url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/LOGO.jpg`,
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
        url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/LOGO.jpg`,
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

const ProductComparisonPage: React.FC = () => {
  return <ProductComparison />;
};

export default ProductComparisonPage;
