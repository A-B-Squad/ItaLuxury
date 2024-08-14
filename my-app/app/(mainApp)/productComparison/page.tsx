import React from "react";
import { Metadata } from "next";
import ProductComparison from "./productComparison";
import keywords from "@/public/keywords";

export const metadata: Metadata = {
  title: "Comparaison de Produits | MaisonNg",
  description:
    "Comparez facilement les caractéristiques, les prix et les avis des produits sur MaisonNg. Trouvez le meilleur produit pour vos besoins.",
  keywords: [
    ...keywords,
    "comparaison de produits",
    "comparateur",
    "meilleur choix",
  ].join(", "),
  openGraph: {
    title: "Comparaison de Produits | MaisonNg",
    description:
      "Comparez facilement les produits sur MaisonNg. Trouvez le meilleur choix pour vous.",
    type: "website",
    url: "https://www.maisonng.com/productComparison",
    images: [
      {
        url: "/images/product-comparison-og.jpg",
        width: 1200,
        height: 630,
        alt: "Comparaison de Produits MaisonNg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Comparaison de Produits | MaisonNg",
    description:
      "Comparez facilement les produits sur MaisonNg. Trouvez le meilleur choix pour vous.",
    images: ["/images/product-comparison-twitter.jpg"],
  },
  alternates: {
    canonical: "https://www.maisonng.com/productComparison",
  },
};

const ProductComparisonPage: React.FC = () => {
  return <ProductComparison />;
};

export default ProductComparisonPage;
