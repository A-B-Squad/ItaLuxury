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
  keywords: keywords,

  openGraph: {
    url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/signin`,
    type: "website",
    title: "Connexion - ita-luxury",
    description:
      "Connectez-vous à votre compte ita-luxury pour accéder à votre profil et effectuer des achats en ligne.",
    images: [
      {
        url: "../../../public/LOGO.png",
        width: 800,
        height: 600,
        alt: "ita-luxury",
      },
    ],
  },
};
const page = () => {
  return <Signin />;
};

export default page;
