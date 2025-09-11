import keywords from "@/public/scripts/keywords";
import { Metadata } from "next";
import { JsonLd } from "react-schemaorg";
import Home from "./Home/Home";
import { cookies } from "next/headers";
import { decodeToken } from "@/utlils/tokens/token";
import { getUser } from "@/utlils/getUser";

export const metadata: Metadata = {
  title: "ita-luxury - Votre boutique en ligne de confiance en Tunisie",
  description:
    "Découvrez ita-luxury, la meilleure plateforme de vente en ligne en Tunisie. Profitez d'une large gamme de produits de qualité, des offres exclusives et une livraison rapide.",
  keywords: [
    ...keywords,
    "achat en ligne",
    "boutique en ligne Tunisie",
    "produits de luxe",
  ].join(","),
  openGraph: {
    title: "ita-luxury - Votre boutique en ligne en Tunisie",
    description:
      "Découvrez notre sélection de produits de qualité et nos offres exclusives. Livraison rapide partout en Tunisie.",
    type: "website",
    url: "https://www.ita-luxury.com",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/images/logos/LOGO-WHITE-BG.webp`,
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
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/images/logos/LOGO-WHITE-BG.webp`,
        width: 1200,
        height: 630,
        alt: "ita-luxury - Boutique en ligne",
      },
    ],
  },
  alternates: {
    canonical: "https://www.ita-luxury.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function HomePage() {
  const cookieStore = cookies()
  const token = cookieStore.get('Token')?.value
  const decodedUser = token ? decodeToken(token) : null;
  const userData = await getUser(decodedUser?.userId);
  return (
    <>
      <JsonLd<any>
        item={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "ita-luxury",
          url: "https://www.ita-luxury.com",
          logo: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/images/logos/LOGO-WHITE-BG.webp`,
          sameAs: [
            "https://www.facebook.com/itaaluxury",
            "https://www.instagram.com/ita_luxury/",
          ],
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+216 23 212 892",
            contactType: "Service Client",
            areaServed: "TN",
            availableLanguage: [
              {
                "@type": "Language",
                name: "Français",
              },
              {
                "@type": "Language",
                name: "Arabe",
              },
            ],
          },
          mainEntityOfPage: [
            {
              "@type": "WebPage",
              "@id": "https://www.ita-luxury.com/",
              name: "Page d'accueil",
              url: "https://www.ita-luxury.com/",
            },
            {
              "@type": "WebPage",
              "@id": "https://www.ita-luxury.com/Contact-us",
              name: "Page de contact",
              url: "https://www.ita-luxury.com/Contact-us",
            },
            {
              "@type": "WebPage",
              "@id": "https://www.ita-luxury.com/Privacy-Policy",
              name: "Politique de confidentialité",
              url: "https://www.ita-luxury.com/Privacy-Policy",
            },
            {
              "@type": "WebPage",
              "@id":
                "https://www.ita-luxury.com/Collections/tunisie?page=1",
              name: "Tous les produits",
              url: "https://www.ita-luxury.com/Collections/tunisie?page=1",
            },
            {
              "@type": "WebPage",
              "@id": "https://www.ita-luxury.com/Terms-of-use",
              name: "Conditions d'utilisation",
              url: "https://www.ita-luxury.com/Terms-of-use",
            },
          ],
        }}
      />
      <Home userData={userData} />
    </>
  );
}
