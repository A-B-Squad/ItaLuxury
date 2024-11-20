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
  title: "Connexion - ita-luxury",
  description:
    "Connectez-vous à votre compte ita-luxury pour accéder à votre profil et effectuer des achats en ligne.",
  keywords: keywords.join(","),

  openGraph: {
    url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/signin`,
    type: "website",
    title: "Connexion - ita-luxury",
    description:
      "Connectez-vous à votre compte ita-luxury pour accéder à votre profil et effectuer des achats en ligne.",
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
    canonical: "https://www.ita-luxury.com/signin",
  },
};
const page = () => {
  return <Signin />;
};

export default page;
