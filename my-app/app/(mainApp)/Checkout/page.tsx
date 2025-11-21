import React from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { decodeToken } from "@/utils/tokens/token";
import { getUser } from "@/utils/getUser";
import { getCompanyInfo } from "@/utils/getCompanyInfo";

const Checkout = dynamic(() => import("./Checkout"), { ssr: false });

if (
  !process.env.NEXT_PUBLIC_API_URL ||
  !process.env.NEXT_PUBLIC_BASE_URL_DOMAIN
) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export const metadata: Metadata = {
  title: "Paiement Sécurisé",
  description: "Procédez au paiement sécurisé de votre commande sur ita-luxury. Options de paiement variées et processus simple.",

  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
  },
};
const CheckoutPage = async () => {
  const token = cookies().get('Token')?.value
  const decodedUser = token ? decodeToken(token) : null;
  const userData = await getUser(decodedUser?.userId);
  const companyData = await getCompanyInfo();

  return <Checkout userData={userData} companyData={companyData} />;
};

export default CheckoutPage;
