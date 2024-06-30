import React from "react";
import ProductsSection from "./productsSection";
import keywords from "@/public/keywords";
import { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { choice?: string };
}): Promise<Metadata> {
  if (!process.env.NEXT_PUBLIC_API_URL || !process.env.BASE_URL_DOMAIN) {
    throw new Error("NEXT_PUBLIC_API_URL or BASE_URL_DOMAIN is not defined");
  }

  const { data } = await fetch(process.env.NEXT_PUBLIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
      query CompanyInfo {
        companyInfo {
          logo 
        }
      }
    `,
    }),
  }).then((res) => res.json());

  const companyInfo = data?.companyInfo;

  let pageTitle = "Tous Les Produits - MaisonNg";
  let pageDescription =
    "Découvrez tous les produits disponibles chez MaisonNg. Profitez des meilleures offres sur une large gamme de produits.";

  if (searchParams.choice === "new-product") {
    pageTitle = "Nouveaux Produits - MaisonNg";
    pageDescription =
      "Découvrez nos dernières nouveautés chez MaisonNg. Des produits innovants et tendance vous attendent.";
  } else if (searchParams.choice === "promotions") {
    pageTitle = "Produits en Promotion - MaisonNg";
    pageDescription =
      "Profitez de nos meilleures promotions chez MaisonNg. Des offres exceptionnelles sur une sélection de produits.";
  }

  return {
    metadataBase: new URL(process.env.BASE_URL_DOMAIN),
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      type: "website",
      title: pageTitle,
      description: pageDescription,
      images: [
        {
          url: companyInfo?.logo || "/default-og-image.jpg",
          width: 1200,
          height: 630,
          alt: "MaisonNg",
        },
      ],
      siteName: "MaisonNg",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [companyInfo?.logo || "/default-twitter-image.jpg"],
    },
    keywords: keywords.join(", "),
    icons: {
      icon: "/images/favicon.ico",
      apple: "/images/apple-touch-icon.png",
    },
    alternates: {
      canonical: `${process.env.BASE_URL_DOMAIN}/products${searchParams.choice ? `?choice=${searchParams.choice}` : ""}`,
    },
  };
}

const AllProductsPage = () => {
  return <ProductsSection />;
};

export default AllProductsPage;
