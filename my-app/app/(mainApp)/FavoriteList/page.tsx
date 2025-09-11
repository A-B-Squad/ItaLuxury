import React from "react";
import FavoriteList from "./FavoriteList";
import { Metadata } from "next";
import keywords from "@/public/scripts/keywords";
import Breadcumb from "@/app/components/Breadcumb";
import { getUser } from "@/utlils/getUser";
import { cookies } from "next/headers";
import { decodeToken } from "@/utlils/tokens/token";

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
        url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/images/logos/LOGO-WHITE-BG.webp`,
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

const FavoriteListPage = async () => {
  const cookieStore = cookies()
  const token = cookieStore.get('Token')?.value
  const decodedUser = token ? decodeToken(token) : null;
  const userData = await getUser(decodedUser?.userId);
  const breadcrumbPaths = [
    { href: "/", label: "Accueil" },
    { href: "/FavoriteList", label: "Liste des favoris" }
  ];

  return (
    <div className="p-6">
      <Breadcumb Path={breadcrumbPaths} />
      <FavoriteList userData={userData} />
    </div>
  );
};

export default FavoriteListPage;
