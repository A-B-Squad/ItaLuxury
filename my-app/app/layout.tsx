import { Inter, Montserrat } from 'next/font/google';
import TabBarMobile from "@/app/components/TabBarMobile";
import FloatingActionButtons from "./components/FloatingActionButtons";
import { Toaster } from "@/components/ui/toaster";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
import keywords from "@/public/scripts/keywords";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import { Organization, WebSite } from "schema-dts";
import AnalyticsIntegration from '@/app/components/AnalyticsIntegration';

// Inter for body text (readable, clean)
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Montserrat for headings (bold, elegant)
const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['600', '700', '800'],
});

if (process.env.NODE_ENV !== "production") {
  loadDevMessages();
  loadErrorMessages();
}

if (!process.env.NEXT_PUBLIC_BASE_URL_DOMAIN) {
  throw new Error("BASE_URL_DOMAIN is not defined");
}

const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL_DOMAIN ?? "https://ita-luxury.com").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    template: '%s | Ita Luxury',
    default: 'Ita Luxury - Vente en ligne en Tunisie'
  },
  description: "Parcourez notre sélection d'offres exclusives et trouvez les meilleurs produits en ligne en Tunisie. Profitez de promotions exceptionnelles sur une large gamme de produits.",
  keywords: keywords.join(","),
  authors: [{ name: "ita-luxury" }],
  creator: "ita-luxury",
  publisher: "ita-luxury",
  openGraph: {
    type: "website",
    title: "Vente en ligne en Tunisie : Découvrez des offres exclusives | ita-luxury",
    description: "Parcourez notre sélection d'offres exclusives et trouvez les meilleurs produits en ligne en Tunisie. Profitez de promotions exceptionnelles sur une large gamme de produits.",
    images: [
      {
        url: `${baseUrl}/images/logos/LOGO-WHITE-BG.webp`,
        width: 1200,
        height: 630,
        alt: "ita-luxury - Boutique en ligne de confiance en Tunisie",
      },
    ],
    url: baseUrl,
    siteName: "ita-luxury",
    locale: "fr_TN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vente en ligne en Tunisie | ita-luxury",
    description: "Découvrez nos offres exclusives et produits de qualité avec livraison rapide partout en Tunisie.",
    images: [`${baseUrl}/images/logos/LOGO-WHITE-BG.webp`],
    creator: "@ita_luxury",
    site: "@ita_luxury",
  },
  verification: {
    google: "mNgh_Cr_ANLEQ34Grw9MdpyVZO42QknZyFHMVErtSNE",
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  alternates: {
    canonical: baseUrl,
  },
};

const organizationSchema: Organization = {
  "@type": "Organization",
  "@id": `${baseUrl}/#organization`,
  name: "Ita Luxury",
  url: baseUrl,
  email: "italuxury2002@gmail.com",
  logo: `${baseUrl}/images/logos/LOGO-WHITE-BG.webp`,
  description: "Boutique en ligne de confiance en Tunisie proposant des produits de qualité avec livraison rapide dans tout le pays.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sousse",
    addressCountry: "TN"
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+216-23-212-892",
    contactType: "customer service",
    areaServed: "TN",
  },
  sameAs: [
    "https://www.facebook.com/itaaluxury",
    "https://www.instagram.com/ita_luxury/"
  ]
};

const websiteSchema: WebSite = {
  "@type": "WebSite",
  "@id": `${baseUrl}/#website`,
  url: baseUrl,
  name: "Ita Luxury",
  description: "Boutique en ligne de confiance en Tunisie - Produits physiques de qualité, livraison rapide",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [organizationSchema, websiteSchema]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${montserrat.variable}`}>
      <head>
        <AnalyticsIntegration />
      </head>
      <body >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
          key="organization-website-structured-data"
        />
        <ApolloWrapper>{children}</ApolloWrapper>
        <Toaster />
        <FloatingActionButtons />
        <TabBarMobile />
      </body>
    </html>
  );
}