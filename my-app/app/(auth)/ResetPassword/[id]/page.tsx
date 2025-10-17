import React from "react";
import ResetPassword from './ResetPassword';
import { Metadata } from "next";

const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL_DOMAIN ?? "https://ita-luxury.com").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Réinitialisation du mot de passe",
  description: "Réinitialisez votre mot de passe sur ita-luxury pour continuer vos achats en toute sécurité.",
  openGraph: {
    url: `${baseUrl}/ResetPassword`,
    type: "website",
    title: "Réinitialisation du mot de passe - ita-luxury",
    description: "Réinitialisez votre mot de passe sur ita-luxury pour continuer vos achats en toute sécurité.",
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
    canonical: `${baseUrl}/ResetPassword`,
  },
};

const ResetPasswordPage = () => {
  return <ResetPassword />;
};

export default ResetPasswordPage;