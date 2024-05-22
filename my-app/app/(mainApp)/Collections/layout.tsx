import ProductInfo from "@/app/components/ProductInfo/ProductInfo";
import SideBar from "./_components/sideBar";
import TopBar from "./_components/topBar";
import React, { ReactNode } from "react";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import keywords from "@/app/public/keywords";
import { ALL_BRANDS, COLORS_QUERY } from "../../../graphql/queries";
type Props = {
  children: ReactNode;
};

if (process.env.NODE_ENV !== "production") {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

const openSans = Open_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "Vente en ligne en Tunisie : Découvrez des offres exclusives sur notre plateforme",
  description:
    "Parcourez notre sélection d'offres exclusives et trouvez les meilleurs produits en ligne en Tunisie. Profitez de promotions exceptionnelles sur une large gamme de produits. Commandez dès maintenant !",

  keywords: keywords,
};

export default async function Layout({ children }: Props) {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }
  const { data: Categories } = await fetch(process.env.NEXT_PUBLIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
      query Categories {
        categories {
          id
          name
          subcategories {
            id
            name
            parentId
            subcategories {
              id
              name
              parentId
            }
          }
        }
      }
  `,
    }),
  }).then((res) => res.json());
  const { data: Brands } = await fetch(process.env.NEXT_PUBLIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
     ${ALL_BRANDS}
  `,
    }),
  }).then((res) => res.json());
  const { data: Colors } = await fetch(process.env.NEXT_PUBLIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
     ${COLORS_QUERY}
  `,
    }),
  }).then((res) => res.json());
  return (
    <div className="relative flex w-full flex-col">
      <TopBar />
      <div className="w-full flex">
        <SideBar categories={Categories?.categories} brands={Brands?.fetchBrands} colors={Colors?.colors} />
        <main style={{ width: "inherit" }} className=" relative">
          <ProductInfo />
          {children}
        </main>
      </div>
    </div>
  );
}
