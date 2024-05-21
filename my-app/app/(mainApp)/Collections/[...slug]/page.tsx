import React from "react";
import ProductsSection from "../_components/productsSection";
import keywords from "@/app/public/keywords";
export async function generateMetadata({ searchParams }: any) {
  if (!process.env.NEXT_PUBLIC_API_URL || !process.env.BASE_URL_DOMAIN) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }
  const { data } = await fetch(process.env.NEXT_PUBLIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
      query CompanyInfo {
        companyInfo {
          logo 
        }
      }
  `,
    }),
  }).then((res) => res.json());
  const CompanyInfo = data;

  return {
    metadataBase: new URL(process.env.BASE_URL_DOMAIN),

    title: `Tous Les Produits ${searchParams.choice ? (searchParams.choice === "new-product" ? "Nouveau Produit" : "En Promotions") : ""} - MaisonNg`,
    description:
      "Découvrez tous les produits disponibles chez MaisonNg, que ce soit des nouveautés ou des promotions. Profitez des meilleures offres sur une large gamme de produits.",
    openGraph: {
      type: "article",
      images: [
        {
          url: CompanyInfo.logo,
          width: 800,
          height: 600,
          alt: "Maison Ng",
        },
      ],
    },
    keywords: keywords,

    icons: {
      icon: "../../public/images/logo.jpeg",
      appleTouchIcon: "/images/logo.jpeg",
      favicon: "../../public/images/favicon.ico",
    },
  };
}
const AllProducts = () => {
  return <ProductsSection />;
};

export default AllProducts;
