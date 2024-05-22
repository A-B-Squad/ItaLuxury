import React from "react";
import ProductsSection from "../_components/productsSection";

export async function generateMetadata({ searchParams }: any) {
  const { data } = await fetch("http://localhost:3000/api/graphql", {
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
  };
}
const AllProducts = () => {
  return <ProductsSection />;
};

export default AllProducts;
