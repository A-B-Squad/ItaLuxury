import React, { useMemo } from "react";
import Checkout from "./Checkout";
import { Metadata } from "next";
import keywords from "@/app/public/keywords";

// Define a type for searchParams if possible
type SearchParams = {
  products?: string;
  total?: string;
};
if (!process.env.NEXT_PUBLIC_API_URL || !process.env.BASE_URL_DOMAIN) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BASE_URL_DOMAIN),
  title: "Paiement - MaisonNg", 
  description: "Procédez au paiement de votre commande sur MaisonNg.", 
  keywords: keywords, 
  
  openGraph: {
    url: `${process.env.BASE_URL_DOMAIN}/checkout`,
    type: "website",
    title: "Paiement - MaisonNg", 
    description: "Procédez au paiement de votre commande sur MaisonNg.", 
    images: [
      {
        url: "../../public/images/logo.jpeg", 
        width: 800,
        height: 600,
        alt: "Maison Ng",
      },
    ],
  },
};
const Page = ({ searchParams }: { searchParams: SearchParams }) => {
  const products = useMemo(() => {
    try {
      return JSON.parse(searchParams?.products || "{}");
    } catch (error) {
      console.error("Failed to parse products:", error);
      return {};
    }
  }, [searchParams?.products]);

  const total = useMemo(() => {
    try {
      return JSON.parse(searchParams?.total || "0");
    } catch (error) {
      console.error("Failed to parse total:", error);
      return 0;
    }
  }, [searchParams?.total]);

  return <Checkout products={products} total={total} />;
};

export default Page;
