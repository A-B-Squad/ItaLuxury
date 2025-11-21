import React from "react";
import { Metadata } from "next";
import Account from "./Account";
import { cookies } from "next/headers";
import { decodeToken } from "@/utils/tokens/token";
import { getUser } from "@/utils/getUser";
import { redirect } from "next/navigation";

if (!process.env.NEXT_PUBLIC_BASE_URL_DOMAIN) {
  throw new Error("NEXT_PUBLIC_BASE_URL_DOMAIN is not defined");
}


export const metadata: Metadata = {
  title: "Mon Compte",
  description: "Gérez votre compte ita-luxury. Consultez vos commandes, adresses et informations personnelles.",

  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },

};

const AccountPage = async () => {
  const token = cookies().get('Token')?.value;

  // Redirect to login if no token
  if (!token) {
    redirect('/signin?redirect=/Account');
  }

  const decodedUser = decodeToken(token);

  // Redirect if token is invalid
  if (!decodedUser?.userId) {
    redirect('/signin?redirect=/Account');
  }

  const userData = await getUser(decodedUser.userId);

  // Redirect if user not found
  if (!userData) {
    redirect('/signin?redirect=/Account');
  }

  return <Account userData={userData} />;
};

export default AccountPage;