import React from "react";
import FavoriteList from "./FavoriteList";
import { Metadata } from "next";
import Breadcumb from "@/app/components/Breadcumb";
import { getUser } from "@/utils/getUser";
import { cookies } from "next/headers";
import { decodeToken } from "@/utils/tokens/token";
import { redirect } from "next/navigation";

if (!process.env.NEXT_PUBLIC_BASE_URL_DOMAIN) {
  throw new Error("NEXT_PUBLIC_BASE_URL_DOMAIN is not defined");
}

export const metadata: Metadata = {
  title: "Mes Favoris",
  description: "Consultez votre liste de produits favoris sur ita-luxury.",

  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
  },
};

const FavoriteListPage = async () => {
  const token = cookies().get('Token')?.value;

  // Redirect to login if no token
  if (!token) {
    redirect('/signin?redirect=/FavoriteList');
  }

  const decodedUser = decodeToken(token);

  // Redirect if token is invalid
  if (!decodedUser?.userId) {
    redirect('/signin?redirect=/FavoriteList');
  }

  const userData = await getUser(decodedUser.userId);

  // Redirect if user not found
  if (!userData) {
    redirect('/signin?redirect=/FavoriteList');
  }

  const breadcrumbPaths = [
    { href: "/", label: "Accueil" },
    { href: "/FavoriteList", label: "Mes Favoris" }
  ];

  return (
    <div className="p-6">
      <Breadcumb Path={breadcrumbPaths} />
      <FavoriteList userData={userData} />
    </div>
  );
};

export default FavoriteListPage;