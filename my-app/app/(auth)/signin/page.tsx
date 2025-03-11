import React from "react";
import Signin from "./signin";
import keywords from "@/public/keywords";
import { Metadata } from "next";

if (
  !process.env.NEXT_PUBLIC_API_URL ||
  !process.env.NEXT_PUBLIC_BASE_URL_DOMAIN
) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL_DOMAIN),
  title: "Connexion à votre compte | ita-luxury",
  description:
    "Connectez-vous à votre compte ita-luxury pour accéder à votre espace personnel, suivre vos commandes et profiter d'offres exclusives.",
  keywords: keywords.join(","),
  openGraph: {
    url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/signin`,
    type: "website",
    title: "Connexion à votre compte | ita-luxury",
    description:
      "Connectez-vous à votre compte ita-luxury pour accéder à votre espace personnel, suivre vos commandes et profiter d'offres exclusives.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/LOGO.jpg`,
        width: 1200,
        height: 630,
        alt: "ita-luxury - Connexion",
      },
    ],
    siteName: "ita-luxury",
  },
  twitter: {
    card: "summary_large_image",
    title: "Connexion à votre compte | ita-luxury",
    description: 
      "Connectez-vous à votre compte ita-luxury pour accéder à votre espace personnel, suivre vos commandes et profiter d'offres exclusives.",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/LOGO.jpg`],
  },
  alternates: {
    canonical: "https://www.ita-luxury.com/signin",
    languages: {
      'fr-FR': 'https://www.ita-luxury.com/signin',
    },
  },
};

export default function SigninPage() {
  return (
    <>
      <Signin />
    </>
  );
}
