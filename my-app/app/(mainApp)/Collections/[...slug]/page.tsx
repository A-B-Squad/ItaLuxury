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
import { fetchGraphQLData } from "@/utlils/graphql";
import { SEARCH_PRODUCTS_QUERY_NO_GQL } from "@/graphql/queries";
import { BreadcrumbList, ItemList, WithContext } from "schema-dts";

type Props = {
  params: object;
  searchParams: SearchParamsProductSearch;
};

const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL_DOMAIN ?? "https://ita-luxury.com").replace(/\/$/, "");

// Metadata Generation
export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  if (!process.env.NEXT_PUBLIC_BASE_URL_DOMAIN) {
    throw new Error("NEXT_PUBLIC_BASE_URL_DOMAIN is not defined");
  }

  try {
    const previousImages = (await parent).openGraph?.images || [];
    const canonicalUrl = generateCanonicalUrl(searchParams);
    const pageTitle = generateTitle(searchParams);
    const pageDescription = generateDescription(searchParams);
    const pageKeywords = generateKeywords(searchParams).join(", ");

    const logoUrl = `${baseUrl}/images/logos/LOGO-WHITE-BG.webp`;

    return {
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
        locale: "fr_TN",
      },

      twitter: {
        card: "summary_large_image",
        title: pageTitle,
        description: pageDescription,
        images: [logoUrl],
        creator: "@ita_luxury",
        site: "@ita_luxury",
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
    return {
      title: "Collections - ita-luxury",
      description: "Découvrez notre collection de produits en Tunisie",
    };
  }
}


export default async function AllProductsPage({ searchParams }: Props) {
  try {
    const breadcrumbPath = await generateBreadcrumbPath(searchParams);
    const token = cookies().get('Token')?.value;
    const decodedUser = token ? decodeToken(token) : null;
    const userData = await getUser(decodedUser?.userId);

    // Server fetch first page to hydrate initial content for better LCP
    const sp = (searchParams as any) || {};
    const serverInput = {
      query: sp.query || undefined,
      categoryName: sp.category || undefined,
      colorName: sp.color || undefined,
      maxPrice: sp.price ? +String(sp.price) : undefined,
      choice: sp.choice || undefined,
      brandName: sp.brand || undefined,
      sortBy: typeof sp.sort === 'string' ? sp.sort.split(".")[0] : undefined,
      sortOrder: typeof sp.sort === 'string' ? sp.sort.split(".")[1] : undefined,
      minPrice: 1,
      visibleProduct: true,
      page: Number(sp.page) || 1,
      pageSize: 12,
    } as any;

    let initialData: any = null;
    try {
      const data = await fetchGraphQLData(
        SEARCH_PRODUCTS_QUERY_NO_GQL,
        { input: serverInput },
        { revalidate: 300, tags: ['collection-search'] }
      );
      const res = data?.searchProducts;
      if (res) {
        initialData = {
          products: res.results?.products ?? [],
          totalCount: res.totalCount ?? 0,
          currentPage: res.pagination?.currentPage ?? serverInput.page,
          hasMore: res.pagination?.hasNextPage ?? false,
          categoryDescription: res.results?.products?.[0]?.categories?.[0]?.description || "",
        };
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }

    // Generate Breadcrumb Schema
    const breadcrumbSchema: WithContext<BreadcrumbList> = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbPath.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.label,
        "item": `${baseUrl}${item.href}`
      }))
    };

    // Generate ItemList Schema for products
    const itemListSchema: WithContext<ItemList> | null = initialData?.products?.length ? {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "numberOfItems": initialData.totalCount,
      "itemListElement": initialData.products.slice(0, 12).map((product: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${baseUrl}/product/${product.slug || product.id}`,
        "name": product.name,
        "image": product.images?.[0]?.url || product.image
      }))
    } : null;

    // Combine schemas
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        breadcrumbSchema,
        ...(itemListSchema ? [itemListSchema] : [])
      ].filter(Boolean)
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
          key="collection-page-structured-data"
        />
        <Breadcumb Path={breadcrumbPath} />
        <ProductsSection userData={userData} initialData={initialData} />
      </>
    );
  } catch (error) {
    console.error("Error rendering AllProductsPage:", error);
    return (
      <div className="error-container p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Une erreur s'est produite</h1>
        <p>Nous n'avons pas pu charger les produits. Veuillez réessayer plus tard.</p>
      </div>
    );
  }
}