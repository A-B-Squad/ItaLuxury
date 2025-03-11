import React from "react";
import Signup from "./signup";
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
  title: "Créer un compte | ita-luxury",
  description:
    "Inscrivez-vous sur ita-luxury pour découvrir notre collection exclusive de produits de luxe et bénéficier d'offres personnalisées.",
  keywords: keywords.join(","),
  openGraph: {
    url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/signup`,
    type: "website",
    title: "Créer un compte | ita-luxury",
    description:
      "Inscrivez-vous sur ita-luxury pour découvrir notre collection exclusive de produits de luxe et bénéficier d'offres personnalisées.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/LOGO.jpg`,
        width: 1200,
        height: 630,
        alt: "ita-luxury - Inscription",
      },
    ],
    siteName: "ita-luxury",
  },
  twitter: {
    card: "summary_large_image",
    title: "Créer un compte | ita-luxury",
    description: 
      "Inscrivez-vous sur ita-luxury pour découvrir notre collection exclusive de produits de luxe et bénéficier d'offres personnalisées.",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/LOGO.jpg`],
  },
  alternates: {
    canonical: "https://www.ita-luxury.com/signup",
    languages: {
      'fr-FR': 'https://www.ita-luxury.com/signup',
    },
  },
};

export default function SignupPage() {
  return (
    <>
      <Signup />
    </>
  );
}
