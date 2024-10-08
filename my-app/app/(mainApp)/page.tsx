import { Metadata } from "next";
import Home from "./Home/Home";
import keywords from "@/public/keywords";

export const metadata: Metadata = {
  title: "ita-luxury - Votre boutique en ligne de confiance en Tunisie",
  description:
    "Découvrez ita-luxury, la meilleure plateforme de vente en ligne en Tunisie. Profitez d'une large gamme de produits de qualité, des offres exclusives et une livraison rapide.",
  keywords: keywords,
  openGraph: {
    title: "ita-luxury - Votre boutique en ligne en Tunisie",
    description:
      "Découvrez notre sélection de produits de qualité et nos offres exclusives. Livraison rapide partout en Tunisie.",
    type: "website",
    url: "https://www.ita-luxury.com",
    images: [
      {
        url: "/favicon.ico",
        width: 1200,
        height: 630,
        alt: "ita-luxury - Boutique en ligne",
      },
    ],
    siteName: "ita-luxury",
  },
  twitter: {
    card: "summary_large_image",
    title: "ita-luxury - Votre boutique en ligne en Tunisie",
    description:
      "Découvrez notre sélection de produits de qualité et nos offres exclusives. Livraison rapide partout en Tunisie.",
    images: ["/images/home-twitter.jpg"],
  },
  alternates: {
    canonical: "https://www.ita-luxury.com",
  },
};

export default function HomePage() {
  return <Home />;
}