import React from "react";
import FavoriteList from "./FavoriteList";
import { Metadata } from "next";
import keywords from "@/public/keywords";
if (
  !process.env.NEXT_PUBLIC_API_URL ||
  !process.env.NEXT_PUBLIC_BASE_URL_DOMAIN
) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL_DOMAIN),
  title: "Liste des favoris - ita-luxury",
  description: "Consultez votre liste de favoris sur ita-luxury.",
  keywords: keywords.join(","),

  openGraph: {
    url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/FavoriteList`,
    type: "website",
    title: "Liste des favoris - ita-luxury",
    description: "Consultez votre liste de favoris sur ita-luxury.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/LOGO.jpg`,
        width: 1200,
        height: 630,
        alt: "ita-luxury",
      },
    ],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/FavoriteList`,

  },
};
const FavoriteListPage = () => {
  return <FavoriteList />;
};

export default FavoriteListPage;
