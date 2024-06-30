import React from "react";
import { Metadata } from "next";
import keywords from "@/public/keywords";
import dynamic from "next/dynamic";

const Checkout = dynamic(() => import("./Checkout"));

if (!process.env.NEXT_PUBLIC_API_URL || !process.env.BASE_URL_DOMAIN) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BASE_URL_DOMAIN),
  title: "Paiement Sécurisé - MaisonNg | Finaliser votre commande",
  description:
    "Procédez au paiement sécurisé de votre commande sur MaisonNg. Options de paiement variées et processus de commande simple pour votre achat en ligne en Tunisie.",
  keywords: keywords.join(", "),
  openGraph: {
    url: `${process.env.BASE_URL_DOMAIN}/checkout`,
    type: "website",
    title: "Paiement - MaisonNg",
    description: "Procédez au paiement de votre commande sur MaisonNg.",
    images: [
      {
        url: "../../../public/images/logo.jpeg",
        width: 800,
        height: 600,
        alt: "Maison Ng",
      },
    ],
  },
  robots: "noindex, nofollow", 
};

const CheckoutPage = () => {
  return <Checkout />;
};

export default CheckoutPage;
