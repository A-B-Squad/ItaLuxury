import React from "react";
import Signup from "./signup";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
if (
  !process.env.NEXT_PUBLIC_API_URL ||
  !process.env.NEXT_PUBLIC_BASE_URL_DOMAIN
) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export const metadata: Metadata = {
  title: "Créer un compte",
  description: "Inscrivez-vous sur ita-luxury pour découvrir notre collection exclusive et bénéficier d'offres personnalisées.",

  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

export default function SignupPage() {
  const token = cookies().get('Token')?.value;
  if (token) {
    redirect('/');
  }
  return <Signup />;

}
