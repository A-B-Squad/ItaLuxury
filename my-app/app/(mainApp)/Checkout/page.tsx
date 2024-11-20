import React from "react";
import { Metadata } from "next";
import keywords from "@/public/keywords";
import dynamic from "next/dynamic";

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
        url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/LOGO.jpg`,
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

const CheckoutPage = () => {
  return <Checkout />;
};

export default CheckoutPage;
