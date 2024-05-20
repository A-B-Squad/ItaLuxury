import ProductInfo from "@/app/components/ProductInfo/ProductInfo";
import SideBar from "./_components/sideBar";
import TopBar from "./_components/topBar";
import React, { ReactNode } from "react";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
type Props = {
  children: ReactNode;
};

if (process.env.NODE_ENV !== "production") {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

const openSans = Open_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vente en ligne en Tunisie : Découvrez des offres exclusives sur notre plateforme",
  description: "Parcourez notre sélection d'offres exclusives et trouvez les meilleurs produits en ligne en Tunisie. Profitez de promotions exceptionnelles sur une large gamme de produits. Commandez dès maintenant !",
};

export default function Layout({ children }: Props) {
  return (
   
        <div className="relative flex w-full flex-col">
          <TopBar />
          <div className="w-full flex">
            <SideBar />
            <main style={{ width: "inherit" }} className=" relative">
              <ProductInfo />
              {children}
            </main>
          </div>
        </div>
  );
}
