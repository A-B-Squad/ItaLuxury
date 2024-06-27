import React, { ReactNode } from "react";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";

import TopBar from "./components/topBar";
import ProductInfo from "@/app/components/ProductInfo/ProductInfo";
import { fetchGraphQLData } from "@/utlils/graphql";
import { ALL_BRANDS, COLORS_QUERY, CATEGORIES_QUERY } from "@/graphql/queries";
import keywords from "@/public/keywords";

const SideBar = dynamic(() => import("./components/sideBar"), { ssr: false });

if (process.env.NODE_ENV === "development") {
  loadDevMessages();
  loadErrorMessages();
}

interface LayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title:
    "Vente en ligne en Tunisie : Découvrez des offres exclusives sur notre plateforme",
  description:
    "Parcourez notre sélection d'offres exclusives et trouvez les meilleurs produits en ligne en Tunisie. Profitez de promotions exceptionnelles sur une large gamme de produits. Commandez dès maintenant !",
  keywords: keywords.join(", "),
  openGraph: {
    title: "Vente en ligne en Tunisie - Offres exclusives",
    description:
      "Découvrez les meilleures offres et produits en ligne en Tunisie. Commandez maintenant !",
    type: "website",
    locale: "fr_TN",
    siteName: "Your Site Name",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vente en ligne en Tunisie - Offres exclusives",
    description:
      "Découvrez les meilleures offres et produits en ligne en Tunisie. Commandez maintenant !",
  },
};

async function fetchData() {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

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
      <header>
        <TopBar />
      </header>
      <div className="w-full flex">
        {/* <aside className="sticky"> */}
          <SideBar categories={categories} brands={brands} colors={colors} />
        {/* </aside> */}
        <main style={{ width: "inherit" }} className="relative">
          <ProductInfo />
          {children}
        </main>
      </div>
    </div>
  );
}
