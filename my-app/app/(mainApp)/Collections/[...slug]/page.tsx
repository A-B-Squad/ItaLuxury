import { Metadata, ResolvingMetadata } from "next";
import React from "react";
import ProductsSection from "./productsSection";
import Breadcumb from '@/app/components/Breadcumb';

import generateTitle from "@/app/(mainApp)/Collections/Helpers/Metadata/_generateTitle";
import { SearchParamsProductSearch } from "@/app/types";
import generateCanonicalUrl from "@/app/(mainApp)/Collections/Helpers/Metadata/_generateCanonicalUrl";
import generateDescription from "@/app/(mainApp)/Collections/Helpers/Metadata/_generateDescription";
import generateKeywords from "@/app/(mainApp)/Collections/Helpers/Metadata/_generateKeywords";
import generateBreadcrumbPath from "@/app/Helpers/_generateBreadcrumbPath";
import { cookies } from "next/headers";
import { decodeToken } from "@/utlils/tokens/token";
import { getUser } from "@/utlils/getUser";

type Props = {
  params: object;
  searchParams: SearchParamsProductSearch;
};



// Metadata Generation
export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  if (!process.env.NEXT_PUBLIC_BASE_URL_DOMAIN) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }
  try {
    const previousImages = (await parent).openGraph?.images || [];
    const canonicalUrl = generateCanonicalUrl(searchParams);
    const pageTitle = generateTitle(searchParams);
    const pageDescription = generateDescription(searchParams);
    const pageKeywords = generateKeywords(searchParams).join(", ");

    const logoUrl = `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/images/logos/LOGO.png`;

    return {
      metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL_DOMAIN),
      title: pageTitle,
      description: pageDescription,
      keywords: pageKeywords,

      openGraph: {
        type: "website",
        title: pageTitle,
        description: pageDescription,
        images: [
          {
            url: logoUrl,
            width: 1200,
            height: 630,
            alt: `ita-luxury - ${pageTitle}`,
          },
          ...previousImages,
        ],
        siteName: "ita-luxury",
        url: canonicalUrl,
        locale: "fr_FR",
      },

      twitter: {
        card: "summary_large_image",
        title: pageTitle,
        description: pageDescription,
        images: [logoUrl],
        creator: "@ita_luxury",
        site: "@ita_luxury",
      },

      icons: {
        icon: [{ url: "/icons/favicon.ico" }],
        apple: [{ url: "/icons/favicon.ico" }],
        other: [{ url: "/icons/favicon.ico" }],
      },

      alternates: {
        canonical: canonicalUrl,
        languages: {
          'fr-TN': canonicalUrl,
        },
      },

      robots: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
        nocache: searchParams.choice === "in-discount",
      },

      category: searchParams.category || "All Products",
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    // Return basic metadata as fallback
    return {
      title: "Collections - ita-luxury",
      description: "Découvrez notre collection de produits en Tunisie",
    };
  }
}

export default async function AllProductsPage({ searchParams }: Props) {
  try {
    const breadcrumbPath = await generateBreadcrumbPath(searchParams);
    const cookieStore = cookies()
    const token = cookieStore.get('Token')?.value
    const decodedUser = token ? decodeToken(token) : null;
    const userData = await getUser(decodedUser?.userId);
    return (
      <>
        <Breadcumb Path={breadcrumbPath} />
        <ProductsSection userData={userData} />
      </>
    );
  } catch (error) {
    console.error("Error rendering AllProductsPage:", error);
    return (
      <div className="error-container p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Une erreur s'est produite</h1>
        <p>Nous n'avons pas pu charger les produits. Veuillez réessayer plus tard.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primaryColor text-white rounded-md"
        >
          Rafraîchir la page
        </button>
      </div>
    );
  }
}