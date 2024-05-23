import React, { useMemo } from "react";
import Checkout from "./Checkout";
import { Metadata } from "next";
import keywords from "@/public/keywords";
import { GET_GOVERMENT_INFO } from "@/graphql/queries";

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
const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
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
  if (!process.env.NEXT_PUBLIC_API_URL ) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }
  const { data } = await fetch(process.env.NEXT_PUBLIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
     ${GET_GOVERMENT_INFO}
  `,
    }),
  }).then((res) => res.json());
  const GovermentInfo = data;

  return <Checkout products={products} total={total} GovermentInfo={GovermentInfo.allGovernorate} />;
};

export default Page;
