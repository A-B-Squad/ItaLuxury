import React from "react";
import ResetPassword from "./ResetPassword";
import { Metadata } from "next";
import keywords from "@/public/scripts/keywords";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL_DOMAIN || "https://www.ita-luxury.com"),
  title: "Réinitialisation du mot de passe - ita-luxury",
  description: "Réinitialisez votre mot de passe sur ita-luxury pour continuer vos achats en toute sécurité.",
  keywords: keywords.join(","),
  openGraph: {
    url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN || "https://www.ita-luxury.com"}/ResetPassword`,
    type: "website",
    title: "Réinitialisation du mot de passe - ita-luxury",
    description: "Réinitialisez votre mot de passe sur ita-luxury pour continuer vos achats en toute sécurité.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN || "https://www.ita-luxury.com"}/images/logos/LOGO-WHITE-BG.webp`,
        width: 1200,
        height: 630,
        alt: "ita-luxury",
      },
    ],
  },
  alternates: {
    canonical: "https://www.ita-luxury.com/ResetPassword",
  },
};

const Page = () => {
  if (!process.env.NEXT_PUBLIC_API_URL || !process.env.NEXT_PUBLIC_BASE_URL_DOMAIN) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  return <ResetPassword />;
};

export default Page;