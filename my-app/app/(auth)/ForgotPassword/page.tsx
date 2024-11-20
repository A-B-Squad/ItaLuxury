import React from "react";
import ForgotPassword from "./forgetPassword";

import { Metadata } from "next";
import keywords from "@/public/keywords";

if (
  !process.env.NEXT_PUBLIC_API_URL ||
  !process.env.NEXT_PUBLIC_BASE_URL_DOMAIN
) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL_DOMAIN),
  title: "Mot de passe oublié - ita-luxury",
  description:
    "Récupérez votre mot de passe sur ita-luxury pour reprendre vos achats en ligne.",
  keywords: keywords.join(","),

  openGraph: {
    url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/ForgetPassword`,
    type: "website",
    title: "Mot de passe oublié - ita-luxury",
    description:
      "Récupérez votre mot de passe sur ita-luxury pour reprendre vos achats en ligne.",
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
    canonical: "https://www.ita-luxury.com/ForgotPassword",
  },
};

const Page = () => {
  return <ForgotPassword />;
};

export default Page;
