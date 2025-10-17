import Breadcumb from "@/app/components/Breadcumb";
import { Metadata } from "next";
import React from "react";
import DeliveryPage from "./DeliveryPage";
const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL_DOMAIN ?? "https://ita-luxury.com").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Livraison et retours",
  description: "Découvrez nos options de livraison rapide et fiable partout en Tunisie. Politique de retours sous 7 jours.",

  openGraph: {
    title: "Livraison et retours - ITA Luxury",
    description: "Livraison rapide en Tunisie. Retours gratuits sous 7 jours.",
    type: "website",
    url: `${baseUrl}/Delivery`,
    images: [
      {
        url: `${baseUrl}/images/logos/LOGO-WHITE-BG.webp`,
        width: 1200,
        height: 630,
        alt: "Livraison ita-luxury",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Livraison et retours - ITA Luxury",
    description: "Livraison rapide en Tunisie. Retours gratuits sous 7 jours.",
    images: [`${baseUrl}/images/logos/LOGO-WHITE-BG.webp`],
  },

  alternates: {
    canonical: `${baseUrl}/Delivery`,
  },

  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
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
