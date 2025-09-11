import React from "react";
import { Metadata } from "next";
import keywords from "@/public/scripts/keywords";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { decodeToken } from "@/utlils/tokens/token";
import { getUser } from "@/utlils/getUser";
import { getCompanyInfo } from "@/utlils/getCompanyInfo";

const Checkout = dynamic(() => import("./Checkout"), { ssr: false });

if (
  !process.env.NEXT_PUBLIC_API_URL ||
  !process.env.NEXT_PUBLIC_BASE_URL_DOMAIN
) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL_DOMAIN),
  title: "Paiement Sécurisé - ita-luxury | Finaliser votre commande",
  description:
    "Procédez au paiement sécurisé de votre commande sur ita-luxury. Options de paiement variées et processus de commande simple pour votre achat en ligne en Tunisie.",
  keywords: keywords.join(","),
  openGraph: {
    url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/checkout`,
    type: "website",
    title: "Paiement - ita-luxury",
    description: "Procédez au paiement de votre commande sur ita-luxury.",
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
    canonical: "https://www.ita-luxury.com/Checkout",
  },
  robots: "noindex, nofollow",
};

const CheckoutPage = async () => {
  const cookieStore = cookies()
  const token = cookieStore.get('Token')?.value
  const decodedUser = token ? decodeToken(token) : null;
  const userData = await getUser(decodedUser?.userId);
  const companyData = await getCompanyInfo();

  return <Checkout userData={userData} companyData={companyData} />;
};

export default CheckoutPage;
