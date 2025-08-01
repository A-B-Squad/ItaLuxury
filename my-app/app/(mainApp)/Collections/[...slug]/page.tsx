import { Metadata, ResolvingMetadata } from "next";
import React from "react";
import keywords from "@/public/keywords";
import ProductsSection from "./productsSection";
import Breadcumb from '@/app/components/Breadcumb';
import { fetchGraphQLData } from "@/utlils/graphql";
import { CATEGORIES_QUERY, COMPANY_INFO_QUERY_WITHOUT_GQL } from "@/graphql/queries";

// Types
type SearchParams = {
  choice?: string;
  category?: string;
  color?: string;
  price?: string;
  brand?: string;
  page?: string;
  sort?: string;
};

type Props = {
  params: {};
  searchParams: SearchParams;
};

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

interface CategoryPath {
  name: string;
  id: string;
}

interface BreadcrumbItem {
  href: string;
  label: string;
}

// API Services

async function fetchCompanyInfo(): Promise<CompanyInfo> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }


  try {
    // Use the fetchGraphQLData utility for consistency
    const data = await fetchGraphQLData(COMPANY_INFO_QUERY_WITHOUT_GQL);
    return data?.companyInfo;
  } catch (error) {
    console.error('Error fetching company info:', error);
    // Return a default object instead of throwing to improve resilience
    return {
      logo: '/LOGO.jpg',
      name: 'ita-luxury',
      description: 'Boutique en ligne en Tunisie'
    };
  }
}



// Metadata Helpers
function generateTitle(searchParams: SearchParams): string {
  const titleParts: string[] = [];

  if (searchParams.choice === "new-product") {
    titleParts.push("Nouveaux Produits");
  } else if (searchParams.choice === "in-discount") {
    titleParts.push("Produits en Promotion");
  } else {
    titleParts.push("Tous Les Produits");
  }

  if (searchParams.category) titleParts.push(searchParams.category);
  if (searchParams.color) titleParts.push(`Couleur: ${searchParams.color}`);
  if (searchParams.brand) titleParts.push(`Marque: ${searchParams.brand}`);
  if (searchParams.price) titleParts.push(`Prix Max: ${searchParams.price} TD`);
  if (searchParams.page && searchParams.page !== "1") titleParts.push(`Page ${searchParams.page}`);

  return `${titleParts.join(" | ")} - ita-luxury`;
}

function generateDescription(searchParams: SearchParams, companyInfo: CompanyInfo): string {
  const parts: string[] = [];

  if (searchParams.choice === "new-product") {
    parts.push("Découvrez nos dernières nouveautés");
  } else if (searchParams.choice === "in-discount") {
    parts.push("Profitez de nos meilleures promotions et réductions");
  } else {
    parts.push("Explorez notre collection complète");
  }

  if (searchParams.category) parts.push(`dans la catégorie ${searchParams.category}`);
  if (searchParams.color) parts.push(`en ${searchParams.color}`);
  if (searchParams.brand) parts.push(`de la marque ${searchParams.brand}`);
  if (searchParams.price) parts.push(`à des prix jusqu'à ${searchParams.price} TD`);
  if (companyInfo?.description) parts.push(companyInfo.description);

  return `${parts.join(" ")}. Livraison disponible en Tunisie.`;
}

function generateKeywords(searchParams: SearchParams): string[] {
  const baseKeywords = new Set(keywords);

  const keywordMappings = {
    'new-product': ["nouveautés", "nouvelle collection", "derniers produits"],
    'in-discount': ["promotion", "soldes", "réduction", "remise", "bon prix"],
  };

  // Add choice-specific keywords
  if (searchParams.choice && searchParams.choice in keywordMappings) {
    keywordMappings[searchParams.choice as keyof typeof keywordMappings].forEach(kw => baseKeywords.add(kw));
  }

  // Add category keywords
  if (searchParams.category) {
    [searchParams.category, `${searchParams.category} Tunisie`].forEach(kw => baseKeywords.add(kw));
  }

  // Add color keywords
  if (searchParams.color) {
    [searchParams.color, `produits ${searchParams.color}`, `${searchParams.color} Tunisie`].forEach(kw => baseKeywords.add(kw));
  }

  // Add brand keywords
  if (searchParams.brand) {
    [searchParams.brand, `${searchParams.brand} Tunisie`, `produits ${searchParams.brand}`].forEach(kw => baseKeywords.add(kw));
  }

  // Add general keywords
  ["Tunisie", "acheter en ligne", "boutique en ligne", "shopping en ligne", "e-commerce Tunisie"]
    .forEach(kw => baseKeywords.add(kw));

  return Array.from(baseKeywords);
}

function generateCanonicalUrl(searchParams: SearchParams): string {
  if (!process.env.NEXT_PUBLIC_BASE_URL_DOMAIN) return "";

  const queryParams = new URLSearchParams();
  const relevantParams: (keyof SearchParams)[] = ['choice', 'category', 'color', 'price', 'brand'];

  relevantParams.forEach(param => {
    if (searchParams[param]) queryParams.set(param, searchParams[param]!);
  });

  if (searchParams.page && searchParams.page !== "1") {
    queryParams.set("page", searchParams.page);
  }

  const queryString = queryParams.toString();
  return `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/Collections${queryString ? `/tunisie?${queryString}` : "/tunisie"}`;
}

// Navigation Helpers
function findCategoryPath(categories: any[], targetCategoryName: string): CategoryPath[] {
  const path: CategoryPath[] = [];

  function searchCategories(cats: any[], target: string, currentPath: CategoryPath[]): boolean {
    for (const cat of cats) {
      const newPath = [...currentPath, { name: cat.name, id: cat.id }];

      if (cat.name === target) {
        path.splice(0, path.length, ...newPath);
        return true;
      }

      if ('subcategories' in cat && cat.subcategories?.length) {
        if (searchCategories(cat.subcategories, target, newPath)) {
          return true;
        }
      }
    }
    return false;
  }

  searchCategories(categories, targetCategoryName, []);
  return path;
}

async function generateBreadcrumbPath(searchParams: SearchParams): Promise<BreadcrumbItem[]> {
  const path: BreadcrumbItem[] = [
    { href: "/", label: "Accueil" },
  ];

  if (searchParams.category) {
    try {
      const { categories } = await fetchGraphQLData(CATEGORIES_QUERY);

      if (!categories || categories.length === 0) {
        throw new Error("Categories not found");
      }

      const categoryPath = findCategoryPath(categories, searchParams.category);

      // Only add categories if we found a valid path
      if (categoryPath.length > 0) {
        categoryPath.forEach((category) => {
          path.push({
            href: `/Collections/tunisie?category=${encodeURIComponent(category.name)}${searchParams.choice ? `&choice=${encodeURIComponent(searchParams.choice)}` : ""}`,
            label: category.name,
          });
        });
      } else {
        // Add just the requested category if path not found
        path.push({
          href: `/Collections/tunisie?category=${encodeURIComponent(searchParams.category)}${searchParams.choice ? `&choice=${encodeURIComponent(searchParams.choice)}` : ""}`,
          label: searchParams.category,
        });
      }
    } catch (error) {
      console.error("Error generating breadcrumb path:", error);
      // Add fallback breadcrumb
      path.push({
        href: `/Collections/tunisie?category=${encodeURIComponent(searchParams.category)}${searchParams.choice ? `&choice=${encodeURIComponent(searchParams.choice)}` : ""}`,
        label: searchParams.category,
      });
    }
  }

  return path;
}


// Metadata Generation
export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  if (!process.env.NEXT_PUBLIC_BASE_URL_DOMAIN) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }
  try {
    const companyInfo = await fetchCompanyInfo();
    const previousImages = (await parent).openGraph?.images || [];
    const canonicalUrl = generateCanonicalUrl(searchParams);
    const pageTitle = generateTitle(searchParams);
    const pageDescription = generateDescription(searchParams, companyInfo);
    const pageKeywords = generateKeywords(searchParams).join(", ");

    // Use the full-size LOGO.png for better social media sharing
    const logoUrl = `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/LOGO.png`;

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
        icon: [{ url: "/favicon.ico" }],
        apple: [{ url: "/favicon.ico" }],
        other: [{ url: "/favicon.ico" }],
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

// Page Component
export default async function AllProductsPage({ searchParams }: Props) {
  try {
    const breadcrumbPath = await generateBreadcrumbPath(searchParams);

    return (
      <>
        <div className="Breadcumb">
          <Breadcumb Path={breadcrumbPath} />
        </div>
        <ProductsSection />
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