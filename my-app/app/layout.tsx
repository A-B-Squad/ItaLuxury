import AnalyticsIntegration from "@/app/components/AnalyticsIntegration";
import FBCInitializer from "@/app/components/FBCInitializer"; 
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
  alternateName: ["ITA Luxury", "ita luxury"],
  url: baseUrl,
  email: "italuxury2002@gmail.com",
  logo: `${baseUrl}/images/logos/LOGO-WHITE-BG.webp`,
  description: "Boutique en ligne de confiance en Tunisie proposant des produits de qualité avec livraison rapide dans tout le pays.",
  foundingDate: "2002",
  foundingLocation: {
    "@type": "Place",
    name: "Sousse Khzema, Tunisie",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sousse Khzema",
      addressLocality: "Sousse",
      addressCountry: "TN"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 35.8256,
      longitude: 10.6360
    },
    hasMap: "https://maps.app.goo.gl/ZD4MxQsjB8T4ZVZx6"
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Sousse Khzema",
    addressLocality: "Sousse",
    addressCountry: "TN"
  },
  numberOfEmployees: {
    "@type": "QuantitativeValue",
    value: 10
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+216-23-212-892",
      contactType: "customer support",
      areaServed: "TN",
      availableLanguage: ["fr", "ar"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "09:00",
        closes: "21:00"
      }
    },
    {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: "+216-23-212-892",
      email: "italuxury2002@gmail.com",
      areaServed: "TN"
    }
  ],
  sameAs: [
    "https://www.facebook.com/itaaluxury",
    "https://www.instagram.com/ita_luxury/"
  ],
  knowsAbout: [
    "E-commerce",
    "Vente en ligne",
    "Produits de qualité",
    "Livraison Tunisie",
    "Shopping en ligne"
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Catalogue Ita Luxury",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Vente en ligne",
          description: "Vente de produits physiques de qualité en ligne",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Livraison à domicile",
          description: "Livraison rapide partout en Tunisie",
        },
      },
    ],
  },
  parentOrganization: {
    "@type": "Organization",
    name: "Ita Luxury Group",
  },
};

const websiteSchema: WebSite = {
  "@type": "WebSite",
  "@id": `${baseUrl}/#website`,
  url: baseUrl,
  name: "Ita Luxury",
  alternateName: "ITA Luxury Online Store",
  inLanguage: "fr",
  description: "Boutique en ligne de confiance en Tunisie - Produits physiques de qualité, livraison rapide",
  publisher: {
    "@id": `${baseUrl}/#organization`
  },
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
    <html lang="fr">
      <head>
        <AnalyticsIntegration />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
          key="organization-website-structured-data"
        />
        
        <FBCInitializer />
        
        <ApolloWrapper>{children}</ApolloWrapper>
        <Toaster />
        <FloatingActionButtons />
        <TabBarMobile />
      </body>
    </html>
  );
}