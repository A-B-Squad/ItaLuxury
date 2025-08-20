import React from "react";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { JsonLd } from "react-schemaorg";
import { ApolloWrapper } from "../../lib/apollo-wrapper";

import Header from "../components/Header/Header";
import keywords from "@/public/scripts/keywords";
import { cookies } from "next/headers";
import { decodeToken } from "@/utlils/tokens/token";
import { getUser } from "@/utlils/getUser";
import { getCompanyInfo } from "@/utlils/getCompanyInfo";


const BasketDrawer = dynamic(() => import("../components/BasketDrawer"), { ssr: false });
const Footer = dynamic(() => import("../components/Footer/Footer"), { ssr: false });
const DrawerMobile = dynamic(() => import("../components/Header/MobileDrawer/DrawerMobile"), { ssr: false });
const ProductQuickView = dynamic(() => import("@/app/components/ProductQuickView/ProductQuickView"), { ssr: false });
const PurchaseOptions = dynamic(() => import("@/app/components/PurchaseOptions"), { ssr: false });




if (process.env.NODE_ENV !== "production") {
  loadDevMessages();
  loadErrorMessages();
}

const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL_DOMAIN ?? "https://ita-luxury.com").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Vente en ligne en Tunisie : Découvrez des offres exclusives sur notre plateforme | ita-luxury",
  description: "Parcourez notre sélection d'offres exclusives et trouvez les meilleurs produits en ligne en Tunisie. Profitez de promotions exceptionnelles sur une large gamme de produits. Commandez dès maintenant !",
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
        url: `${baseUrl}/images/logos/LOGO.jpg`,
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
    images: [`${baseUrl}/images/logos/LOGO.jpg`],
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

const combinedSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: "ita-luxury",
    alternateName: ["ITA Luxury", "ita luxury"],
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      "@id": `${baseUrl}/#logo`,
      url: `${baseUrl}/images/logos/LOGO.jpg`,
      width: 500,
      height: 500,
      caption: "Logo ita-luxury",
    },
    image: `${baseUrl}/images/logos/LOGO.jpg`,
    description: "Boutique en ligne de confiance en Tunisie proposant des produits de qualité avec livraison rapide dans tout le pays.",

    address: {
      "@type": "PostalAddress",
      streetAddress: "Rue De Colonel El Hedi El Garnaoui",
      addressLocality: "Sousse Khzema",
      addressRegion: "Sousse",
      postalCode: "4051",
      addressCountry: "TN",
    },

    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+216 23 212 892",
        contactType: "Service Client",
        areaServed: "TN",
        availableLanguage: ["French", "Arabic"],
        hoursAvailable: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], // ✅ corrigé
            opens: "09:00",
            closes: "21:00",
            validFrom: "2025-01-01",
          },
        ],
      },
      {
        "@type": "ContactPoint",
        contactType: "Sales",
        telephone: "+216 23 212 892",
        email: "contact@ita-luxury.com",
        areaServed: "TN",
      },
    ],

    sameAs: [
      "https://www.facebook.com/itaaluxury",
      "https://www.instagram.com/ita_luxury/",
    ],

    foundingDate: "2002",
    numberOfEmployees: "2-10",
    knowsAbout: [
      "E-commerce",
      "Vente en ligne",
      "Produits de qualité",
      "Livraison Tunisie",
      "Shopping en ligne",
    ],

    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Catalogue ita-luxury",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Vente en ligne",
            description: "Vente de produits de qualité en ligne",
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
      name: "ita-luxury Group",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: "ita-luxury",
    alternateName: "ITA Luxury Online Store",
    description: "Boutique en ligne de confiance en Tunisie - Produits de qualité, livraison rapide",
    publisher: {
      "@id": `${baseUrl}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/Collections/tunisie?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    mainEntity: [
      {
        "@type": "ItemList",
        name: "Navigation principale",
        itemListElement: [
          {
            "@type": "SiteNavigationElement",
            "@id": `${baseUrl}/#nav-home`,
            name: "Accueil",
            url: baseUrl,
          },
          {
            "@type": "SiteNavigationElement",
            "@id": `${baseUrl}/#nav-products`,
            name: "Produits",
            url: `${baseUrl}/Collections/tunisie`,
          },
          {
            "@type": "SiteNavigationElement",
            "@id": `${baseUrl}/#nav-contact`,
            name: "Contact",
            url: `${baseUrl}/Contact-us`,
          },
        ],
      },
    ],
  },
];

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies()
  const token = cookieStore.get('Token')?.value
  const decodedUser = token ? decodeToken(token) : null;
  const userData = await getUser(decodedUser?.userId);
  const companyData = await getCompanyInfo();

  return (
    <div className="relative">
      <JsonLd<any> item={combinedSchema} />
      <Header userData={userData} companyData={companyData} />
      <ApolloWrapper>{children}</ApolloWrapper>
      <DrawerMobile userData={userData} />
      <BasketDrawer userData={userData} />
      <PurchaseOptions companyData={companyData} />
      <ProductQuickView userData={userData} />
      <Footer companyData={companyData} />

    </div>
  );
}
