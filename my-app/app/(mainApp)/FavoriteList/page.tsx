import React from "react";
import FavoriteList from "./FavoriteList";
import { Metadata } from "next";
import keywords from "@/public/keywords";
if (!process.env.NEXT_PUBLIC_API_URL || !process.env.BASE_URL_DOMAIN) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BASE_URL_DOMAIN),
  title: "Liste des favoris - MaisonNg",
  description: "Consultez votre liste de favoris sur MaisonNg.",
  keywords: keywords,

  openGraph: {
    url: `${process.env.BASE_URL_DOMAIN}/favorites`,
    type: "website",
    title: "Liste des favoris - MaisonNg",
    description: "Consultez votre liste de favoris sur MaisonNg.",
    images: [
      {
        url: "../../public/images/logo.jpeg",
        width: 800,
        height: 600,
        alt: "Maison Ng",
      },
    ],
  },
};
const FavoriteListPage = () => {
  return <FavoriteList />;
};

export default FavoriteListPage;
