import SideAds from "@/app/components/adverstissment/sideAds";
import Breadcumb from "@/app/components/Breadcumb";
import keywords from "@/public/keywords";
import { Metadata } from "next";
import React from "react";
import DeliveryPage from "./DeliveryPage";

export const metadata: Metadata = {
  title:
    "Livraison et retours - ITA Luxury | Livraison rapide et fiable en Tunisie",
  description:
    "Découvrez nos options de livraison rapide et fiable pour tous vos achats sur ita-luxury.com.",
  keywords: keywords.join(","),
  openGraph: {
    title:
      "Livraison et retours - ITA Luxury | Livraison rapide et fiable en Tunisie",
    description:
      "Découvrez nos options de livraison rapide et fiable pour tous vos achats sur ita-luxury.com.",
    type: "website",
    url: "https://www.ita-luxury.com/Delivery",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/LOGO.jpg`,
        width: 1200,
        height: 630,
        alt: "Delivery ita-luxury",
      },
    ],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/Delivery`,
  },
};

const DeliveryPageWrapper = () => {
  const breadcrumbPaths = [
    { href: "/", label: "Accueil" },
    { href: "/Delivery", label: "Expéditions et retours" }
  ];

  return (
    <div className="p-6">
      <Breadcumb Path={breadcrumbPaths} />
      <DeliveryPage />
    </div>
  );
};

export default DeliveryPageWrapper;
