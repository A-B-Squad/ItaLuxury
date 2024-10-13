import React from "react";
import ProductsSection from "./productsSection";
import keywords from "@/public/keywords";
import { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: {
    choice?: string;
    category?: string;
    color?: string;
    price?: string;
    brand?: string;
  };
}): Promise<Metadata> {
  if (
    !process.env.NEXT_PUBLIC_API_URL ||
    !process.env.NEXT_PUBLIC_BASE_URL_DOMAIN
  ) {
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

  let pageTitle = "Tous Les Produits - ita-luxury";
  let pageDescription =
    "Découvrez tous les produits disponibles chez ita-luxury. Profitez des meilleures offres sur une large gamme de produits.";

  // Dynamic title generation based on search parameters
  const titleParts = [];

  if (searchParams.choice === "new-product") {
    titleParts.push("Nouveaux Produits");
    pageDescription =
      "Découvrez nos dernières nouveautés chez ita-luxury. Des produits innovants et tendance vous attendent.";
  } else if (searchParams.choice === "in-discount") {
    titleParts.push("Produits en Promotion");
    pageDescription =
      "Profitez de nos meilleures promotions chez ita-luxury. Des offres exceptionnelles sur une sélection de produits.";
  }

  if (searchParams.category) {
    titleParts.push(`Catégorie: ${searchParams.category}`);
  }

  if (searchParams.color) {
    titleParts.push(`Couleur: ${searchParams.color}`);
  }

  if (searchParams.brand) {
    titleParts.push(`Marque: ${searchParams.brand}`);
  }

  if (searchParams.price) {
    titleParts.push(`Prix Max: ${searchParams.price} TD`);
  }

  if (titleParts.length > 0) {
    pageTitle = `${titleParts.join(" | ")} - ita-luxury`;
  }

  // Construct the query string for the canonical URL
  const queryParams = new URLSearchParams();
  if (searchParams.choice) queryParams.set("choice", searchParams.choice);
  if (searchParams.category) queryParams.set("category", searchParams.category);
  if (searchParams.color) queryParams.set("color", searchParams.color);
  if (searchParams.price) queryParams.set("price", searchParams.price);
  if (searchParams.brand) queryParams.set("brand", searchParams.brand);

  const queryString = queryParams.toString();
  const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/Collections${
    queryString
      ? `/tunisie?page=1&section=Boutique?${queryString}`
      : "/tunisie?page=1&section=Boutique"
  }`;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL_DOMAIN),
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      type: "website",
      title: pageTitle,
      description: pageDescription,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/LOGO.jpg`,
          width: 1200,
          height: 630,
          alt: "ita-luxury",
        },
      ],
      siteName: "ita-luxury",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/LOGO.jpg`,
          width: 1200,
          height: 630,
          alt: "ita-luxury",
        },
      ],
    },
    keywords: keywords.join(","),
    icons: {
      icon: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/favicon.ico`,
      apple: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/favicon.ico`,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

const AllProductsPage = () => {
  return <ProductsSection />;
};

export default AllProductsPage;
