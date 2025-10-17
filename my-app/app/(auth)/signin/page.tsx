import React from "react";
import Signin from "./signin";
import { Metadata } from "next";

if (
  !process.env.NEXT_PUBLIC_API_URL ||
  !process.env.NEXT_PUBLIC_BASE_URL_DOMAIN
) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre compte ita-luxury pour accéder à votre espace personnel.",

  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

export default function SigninPage() {
  return <Signin />
}
