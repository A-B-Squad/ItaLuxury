import { Metadata } from "next";
import Home from "./Home/Home";
import { cookies } from "next/headers";
import { decodeToken } from "@/utlils/tokens/token";
import { getUser } from "@/utlils/getUser";

const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL_DOMAIN ?? "https://ita-luxury.com").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Accueil",
  description: "Découvrez ita-luxury, la meilleure plateforme de vente en ligne en Tunisie. Profitez d'une large gamme de produits de qualité, des offres exclusives et une livraison rapide.",

  openGraph: {
    title: "ita-luxury - Votre boutique en ligne en Tunisie",
    description: "Découvrez notre sélection de produits de qualité et nos offres exclusives. Livraison rapide partout en Tunisie.",
    type: "website",
    url: baseUrl,
    images: [
      {
        url: `${baseUrl}/images/logos/LOGO-WHITE-BG.webp`,
        width: 1200,
        height: 630,
        alt: "ita-luxury - Boutique en ligne",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ita-luxury - Votre boutique en ligne en Tunisie",
    description: "Découvrez notre sélection de produits de qualité et nos offres exclusives. Livraison rapide partout en Tunisie.",
    images: [`${baseUrl}/images/logos/LOGO-WHITE-BG.webp`],
  },

  alternates: {
    canonical: baseUrl,
  },

  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
};

export default async function HomePage() {
  const token = cookies().get('Token')?.value;
  const decodedUser = token ? decodeToken(token) : null;
  const userData = await getUser(decodedUser?.userId);



  return (
    <Home userData={userData} />
  );
}