import keywords from "@/public/keywords";
import { Metadata, ResolvingMetadata } from "next";
import React from "react";
import ProductsSection from "./productsSection";

// Types for the page props and filters
type SearchParams = {
  choice?: string;
  category?: string;
  color?: string;
  price?: string;
  brand?: string;
  page?: string;
  sort?: string;
  section?: string;
};

type Props = {
  params: {};
  searchParams: SearchParams;
};

// Type for company info
interface CompanyInfo {
  logo: string;
  name: string;
  description: string;
  address?: string;
  phone?: string;
  email?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

// Fetch company information
async function fetchCompanyInfo(): Promise<CompanyInfo> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  try {
    const { data } = await fetch(process.env.NEXT_PUBLIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query CompanyInfo {
            companyInfo {
              logo
              name
              description
              address
              phone
              email
              socialMedia {
                facebook
                instagram
                twitter
              }
            }
          }
        `,
      }),
    }).then((res) => res.json());

    return data?.companyInfo;
  } catch (error) {
    console.error('Error fetching company info:', error);
    throw error;
  }
}

// Helper function to generate filter-based title
function generateTitle(searchParams: SearchParams): string {
  const titleParts: string[] = [];

  // Add main section title
  if (searchParams.choice === "new-product") {
    titleParts.push("Nouveaux Produits");
  } else if (searchParams.choice === "in-discount") {
    titleParts.push("Produits en Promotion");
  } else if (searchParams.section === "Boutique") {
    titleParts.push("Boutique en Ligne");
  } else {
    titleParts.push("Tous Les Produits");
  }

  // Add category
  if (searchParams.category) {
    titleParts.push(`${searchParams.category}`);
  }

  // Add other filters
  if (searchParams.color) {
    titleParts.push(`Couleur: ${searchParams.color}`);
  }
  if (searchParams.brand) {
    titleParts.push(`Marque: ${searchParams.brand}`);
  }
  if (searchParams.price) {
    titleParts.push(`Prix Max: ${searchParams.price} TD`);
  }

  // Add page number if not first page
  if (searchParams.page && searchParams.page !== "1") {
    titleParts.push(`Page ${searchParams.page}`);
  }

  return `${titleParts.join(" | ")} - ita-luxury`;
}

// Helper function to generate description
function generateDescription(searchParams: SearchParams, companyInfo: CompanyInfo): string {
  const parts: string[] = [];

  // Base description based on section
  if (searchParams.choice === "new-product") {
    parts.push("Découvrez nos dernières nouveautés");
  } else if (searchParams.choice === "in-discount") {
    parts.push("Profitez de nos meilleures promotions et réductions");
  } else {
    parts.push("Explorez notre collection complète");
  }

  // Add category description
  if (searchParams.category) {
    parts.push(`dans la catégorie ${searchParams.category}`);
  }

  // Add color filter
  if (searchParams.color) {
    parts.push(`en ${searchParams.color}`);
  }

  // Add brand filter
  if (searchParams.brand) {
    parts.push(`de la marque ${searchParams.brand}`);
  }

  // Add price filter
  if (searchParams.price) {
    parts.push(`à des prix jusqu'à ${searchParams.price} TD`);
  }

  // Add company description
  if (companyInfo?.description) {
    parts.push(companyInfo.description);
  }

  return `${parts.join(" ")}. Livraison disponible en Tunisie.`;
}

// Helper function to generate keywords
function generateKeywords(searchParams: SearchParams): string[] {
  const baseKeywords = [...keywords];

  // Add filter-based keywords
  if (searchParams.choice === "new-product") {
    baseKeywords.push("nouveautés", "nouvelle collection", "derniers produits");
  }
  if (searchParams.choice === "in-discount") {
    baseKeywords.push("promotion", "soldes", "réduction", "remise", "bon prix");
  }
  if (searchParams.category) {
    baseKeywords.push(searchParams.category, `${searchParams.category} Tunisie`);
  }
  if (searchParams.color) {
    baseKeywords.push(
      searchParams.color,
      `produits ${searchParams.color}`,
      `${searchParams.color} Tunisie`
    );
  }
  if (searchParams.brand) {
    baseKeywords.push(
      searchParams.brand,
      `${searchParams.brand} Tunisie`,
      `produits ${searchParams.brand}`
    );
  }

  // Add location-based keywords
  baseKeywords.push(
    "Tunisie",
    "acheter en ligne",
    "boutique en ligne",
    "shopping en ligne",
    "e-commerce Tunisie"
  );

  return [...new Set(baseKeywords)]; // Remove duplicates
}

// Generate canonical URL
function generateCanonicalUrl(searchParams: SearchParams): string {
  if (!process.env.NEXT_PUBLIC_BASE_URL_DOMAIN) {
    return "";
  }

  const queryParams = new URLSearchParams();

  // Add only relevant parameters
  if (searchParams.choice) queryParams.set("choice", searchParams.choice);
  if (searchParams.category) queryParams.set("category", searchParams.category);
  if (searchParams.color) queryParams.set("color", searchParams.color);
  if (searchParams.price) queryParams.set("price", searchParams.price);
  if (searchParams.brand) queryParams.set("brand", searchParams.brand);
  if (searchParams.page && searchParams.page !== "1") queryParams.set("page", searchParams.page);
  if (searchParams.section) queryParams.set("section", searchParams.section);

  const queryString = queryParams.toString();
  return `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/Collections${queryString ? `/tunisie?${queryString}` : "/tunisie"
    }`;
}

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  if (!process.env.NEXT_PUBLIC_BASE_URL_DOMAIN) {
    throw new Error("BASE_URL_DOMAIN is not defined");
  }

  // Fetch company info
  const companyInfo = await fetchCompanyInfo();

  // Get parent metadata images
  const previousImages = (await parent).openGraph?.images || [];

  // Generate dynamic content
  const pageTitle = generateTitle(searchParams);
  const pageDescription = generateDescription(searchParams, companyInfo);
  const pageKeywords = generateKeywords(searchParams);
  const canonicalUrl = generateCanonicalUrl(searchParams);

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL_DOMAIN),

    // Basic metadata
    title: pageTitle,
    description: pageDescription,
    keywords: pageKeywords.join(", "),

    // OpenGraph metadata
    openGraph: {
      type: "website",
      title: pageTitle,
      description: pageDescription,
      images: [
        {
          url: companyInfo?.logo || `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/LOGO.jpg`,
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

    // Twitter metadata
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [companyInfo?.logo || `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/LOGO.jpg`],
      creator: "@ita_luxury",
      site: "@ita_luxury",
    },

    // Icons
    icons: {
      icon: [
        { url: "/favicon.ico" },

      ],
      apple: [
        { url: "/favicon.ico" },
      ],
      other: [
        { url: "/favicon.ico" },

      ],
    },

    // Alternate versions
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'fr-TN': canonicalUrl,
      },
    },

    // Robots directives
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      nocache: searchParams.choice === "in-discount",
    },


    // Additional metadata
    category: searchParams.category || "All Products",
  };
}

const AllProductsPage: React.FC = () => {
  return <ProductsSection />

};

export default AllProductsPage;