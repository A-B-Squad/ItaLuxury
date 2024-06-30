import React from "react";
import { Metadata } from "next";
import Home from "./Home/Home";
import keywords from "@/public/keywords";

export const metadata: Metadata = {
  title: "MaisonNg - Votre boutique en ligne de confiance en Tunisie",
  description:
    "Découvrez MaisonNg, la meilleure plateforme de vente en ligne en Tunisie. Profitez d'une large gamme de produits de qualité, des offres exclusives et une livraison rapide.",
  keywords: keywords.join(", "),
  openGraph: {
    title: "MaisonNg - Votre boutique en ligne en Tunisie",
    description:
      "Découvrez notre sélection de produits de qualité et nos offres exclusives. Livraison rapide partout en Tunisie.",
    type: "website",
    url: "https://www.maisonng.com",
    images: [
      {
        url: "../../public/images/logo.jpeg",
        width: 1200,
        height: 630,
        alt: "MaisonNg - Boutique en ligne",
      },
    ],
    siteName: "MaisonNg",
  },
  twitter: {
    card: "summary_large_image",
    title: "MaisonNg - Votre boutique en ligne en Tunisie",
    description:
      "Découvrez notre sélection de produits de qualité et nos offres exclusives. Livraison rapide partout en Tunisie.",
    images: ["/images/home-twitter.jpg"],
  },
  alternates: {
    canonical: "https://www.maisonng.com",
  },
};

const HomePage: React.FC = () => {
  return <Home />;
};

export default HomePage;
