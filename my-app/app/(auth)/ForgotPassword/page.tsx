import React from "react";
import ForgotPassword from './forgetPassword';
import { Metadata } from "next";

if (
  !process.env.NEXT_PUBLIC_API_URL ||
  !process.env.NEXT_PUBLIC_BASE_URL_DOMAIN
) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL_DOMAIN ?? "https://ita-luxury.com").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Mot de passe oublié",
  description:
    "Récupérez votre mot de passe sur ita-luxury pour reprendre vos achats en ligne.",
  openGraph: {
    url: `${baseUrl}/ForgetPassword`,
    type: "website",
    title: "Mot de passe oublié - ita-luxury",
    description:
      "Récupérez votre mot de passe sur ita-luxury pour reprendre vos achats en ligne.",
    images: [
      {
        url: `${baseUrl}/images/logos/LOGO-WHITE-BG.webp`,
        width: 1200,
        height: 630,
        alt: "ita-luxury",
      },
    ],
  },
  alternates: {
    canonical: `${baseUrl}/ForgetPassword`,
  },
};

const ForgotPasswordPage = () => {
  return <ForgotPassword />;
};

export default ForgotPasswordPage;