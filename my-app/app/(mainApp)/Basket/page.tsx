import React from "react";
import { Metadata } from "next";
import Basket from "./Basket";
import { cookies } from "next/headers";
import { decodeToken } from "@/utils/tokens/token";
import { getUser } from "@/utils/getUser";
import { getCompanyInfo } from "@/utils/getCompanyInfo";

if (!process.env.NEXT_PUBLIC_BASE_URL_DOMAIN) {
  throw new Error("NEXT_PUBLIC_BASE_URL_DOMAIN is not defined");
}

export const metadata: Metadata = {
  title: "Panier",
  description: "Consultez votre panier d'achat ita-luxury. Finalisez votre commande et profitez de nos offres.",

  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

const BasketPage = async () => {
  const token = cookies().get('Token')?.value;
  const decodedUser = token ? decodeToken(token) : null;
  const userData = await getUser(decodedUser?.userId);
  const companyData = await getCompanyInfo();

  return <Basket userData={userData} companyData={companyData} />;
};

export default BasketPage;