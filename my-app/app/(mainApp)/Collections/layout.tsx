import React, { ReactNode } from "react";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import ProductInfo from "@/app/components/ProductInfo/ProductInfo";
import { fetchGraphQLData } from "@/utlils/graphql";
import { ALL_BRANDS, COLORS_QUERY, CATEGORIES_QUERY } from "@/graphql/queries";
import keywords from "@/public/keywords";
import Breadcumb from "@/app/components/Breadcumb";

const SideBar = dynamic(() => import("./components/sideBar"), { ssr: false });
if (process.env.NODE_ENV === "development") {
  loadDevMessages();
  loadErrorMessages();
}

interface LayoutProps {
  children: ReactNode;
}
if (
  !process.env.NEXT_PUBLIC_API_URL ||
  !process.env.NEXT_PUBLIC_BASE_URL_DOMAIN
) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL_DOMAIN),
  title: "Vente en ligne en Tunisie | Offres exclusives | ita-luxury",
  description:
    "Découvrez les meilleures offres et produits en ligne en Tunisie sur ita-luxury. Large gamme de produits de qualité avec promotions exceptionnelles. Livraison rapide et paiement sécurisé.",
  keywords: keywords,
  openGraph: {
    title: "Vente en ligne en Tunisie | Offres exclusives | ita-luxury",
    description:
      "Découvrez les meilleures offres et produits en ligne en Tunisie sur ita-luxury. Commandez maintenant !",
    type: "website",
    locale: "fr_TN",
    siteName: "ita-luxury",
    images: [
      {
        url: "../../../public/LOGO.png",
        width: 1200,
        height: 630,
        alt: "ita-luxury - Vente en ligne en Tunisie",
      },
    ],
  },

  alternates: {
    canonical: "/products",
  },
};

async function fetchData() {
  const [categoriesData, brandsData, colorsData] = await Promise.all([
    fetchGraphQLData(CATEGORIES_QUERY),
    fetchGraphQLData(ALL_BRANDS),
    fetchGraphQLData(COLORS_QUERY),
  ]);

  return {
    categories: categoriesData?.categories,
    brands: brandsData?.fetchBrands,
    colors: colorsData?.colors,
  };
}

export default async function Layout({ children }: LayoutProps) {
  const { categories, brands, colors } = await fetchData();

  return (
    <div className="relative flex w-full flex-col z-50">
      <div className="Breadcumb">
        <Breadcumb />
      </div>

      <div className=" container  gap-3 px-4 flex md:flex-row items-center md:items-start flex-col-reverse  relative w-full h-full ">
        <SideBar categories={categories} brands={brands} colors={colors} />
        <main style={{ width: "inherit" }} className="relative ">
          <ProductInfo />
          {children}
        </main>
      </div>
    </div>
  );
}
