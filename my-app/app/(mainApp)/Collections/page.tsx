import { Metadata, ResolvingMetadata } from "next";
import React from "react";
import ProductsSection from "./productsSection";
import Breadcumb from '@/app/components/Breadcumb';
import generateTitle from "@/app/(mainApp)/Collections/Helpers/Metadata/_generateTitle";
import { SearchParamsProductSearch } from "@/app/types";
import generateDescription from "@/app/(mainApp)/Collections/Helpers/Metadata/_generateDescription";
import generateKeywords from "@/app/(mainApp)/Collections/Helpers/Metadata/_generateKeywords";
import generateBreadcrumbPath from "@/app/Helpers/_generateBreadcrumbPath";
import { cookies } from "next/headers";
import { decodeToken } from "@/utils/tokens/token";
import { getUser } from "@/utils/getUser";
import { fetchGraphQLData } from "@/utils/graphql";
import { SEARCH_PRODUCTS_QUERY_NO_GQL } from "@/graphql/queries";
import generateCanonicalUrl from './Helpers/Metadata/_generateCanonicalUrl';
import {
  ItemList,
  WithContext,
  WebSite,
  Organization,
  CollectionPage,
} from "schema-dts";
import { generateBreadcrumbSchema } from "./Helpers/Metadata/generateBreadcrumbSchema";

interface Props {
  params: object;
  readonly searchParams: SearchParamsProductSearch;
}

const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL_DOMAIN ?? "https://ita-luxury.com").replace(/\/$/, "");

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatPriceForSchema = (price: number): string => {
  return Number(price).toFixed(2);
};

const getProductImageUrl = (product: any): string | undefined => {
  if (!product?.images?.[0]) return undefined;
  return product.images[0].startsWith('http')
    ? product.images[0]
    : `${baseUrl}${product.images[0]}`;
};

const cleanHtml = (html: string): string => {
  return html?.replace(/<[^>]*>/g, "").trim() || "";
};

const buildServerInput = (searchParams: SearchParamsProductSearch, page: number = 1, pageSize: number = 12) => {
  const sp = searchParams as any;
  return {
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
    page,
    pageSize,
  };
};

// ============================================================================
// SCHEMA GENERATION
// ============================================================================

const generateWebsiteSchema = (): WithContext<WebSite> => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${baseUrl}#website`,
  "url": baseUrl,
  "name": "ita-luxury",
  "description": "Boutique en ligne de produits électroniques et accessoires de luxe en Tunisie",
  "inLanguage": "fr-TN",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${baseUrl}/Collections?query={search_term_string}`
    }
  },
  "publisher": {
    "@id": `${baseUrl}#organization`
  }
});

const generateOrganizationSchema = (): WithContext<Organization> => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${baseUrl}#organization`,
  "name": "ita luxury",
  "url": baseUrl,
  "logo": {
    "@type": "ImageObject",
    "url": `${baseUrl}/images/logos/LOGO-WHITE-BG.webp`,
    "width": "250",
    "height": "60"
  },
  "description": "Boutique en ligne de produits électroniques et accessoires de luxe en Tunisie",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rue du Colonel El Hedi El Garnaoui, Khzema",
    "addressLocality": "Tunis",
    "addressRegion": "Tunis",
    "postalCode": "4051",
    "addressCountry": "TN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+216-23-212-892",
    "contactType": "customer service",
    "areaServed": "TN",
    "availableLanguage": ["fr", "ar"],
    "email": "italuxury2002@gmail.com"
  },
  "sameAs": [
    "https://www.facebook.com/itaaluxury",
    "https://www.instagram.com/ita_luxury/"
  ]
});

const generateCollectionPageSchema = (
  searchParams: SearchParamsProductSearch,
  currentUrl: string
): WithContext<CollectionPage> => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${currentUrl}#webpage`,
  "url": currentUrl,
  "name": generateTitle(searchParams),
  "description": generateDescription(searchParams),
  "inLanguage": "fr-TN",
  "isPartOf": {
    "@id": `${baseUrl}#website`
  },
  "breadcrumb": {
    "@id": `${currentUrl}#breadcrumb`
  },
  "mainEntity": {
    "@id": `${currentUrl}#itemlist`
  }
});

const generateProductSchema = (product: any, position: number): any => {
  const productUrl = `${baseUrl}/products/${product.slug}`;
  const imageUrl = getProductImageUrl(product);
  const hasDiscount = product.productDiscounts?.[0]?.newPrice;
  const finalPrice = hasDiscount ? product.productDiscounts[0].newPrice : product.price;

  return {
    "@type": "ListItem",
    "position": position,
    "item": {
      "@type": "Product",
      "@id": productUrl,
      "url": productUrl,
      "name": product.name,
      ...(imageUrl && { "image": imageUrl }),
      "description": cleanHtml(product.description)?.slice(0, 200) || product.name,
      "sku": product.reference,
      "mpn": product.reference,
      ...(product.Brand?.name && {
        "brand": {
          "@type": "Brand",
          "name": product.Brand.name
        }
      }),
      ...(product.categories?.[0]?.name && {
        "category": product.categories[0].name
      }),
      "offers": {
        "@type": "Offer",
        "url": productUrl,
        "priceCurrency": "TND",
        "price": formatPriceForSchema(finalPrice),
        ...(hasDiscount && { 
          "priceValidUntil": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
        }),
        "availability": (product.inventory || 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        "itemCondition": "https://schema.org/NewCondition",
        "seller": {
          "@id": `${baseUrl}#organization`
        },
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": {
            "@type": "MonetaryAmount",
            "value": "8.00",
            "currency": "TND"
          },
          "shippingDestination": {
            "@type": "DefinedRegion",
            "addressCountry": "TN"
          },
          "deliveryTime": {
            "@type": "ShippingDeliveryTime",
            "handlingTime": {
              "@type": "QuantitativeValue",
              "minValue": 0,
              "maxValue": 1,
              "unitCode": "DAY"
            },
            "transitTime": {
              "@type": "QuantitativeValue",
              "minValue": 1,
              "maxValue": 3,
              "unitCode": "DAY"
            }
          }
        },
        "hasMerchantReturnPolicy": {
          "@type": "MerchantReturnPolicy",
          "applicableCountry": "TN",
          "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
          "merchantReturnDays": 7,
          "returnMethod": "https://schema.org/ReturnByMail",
          "returnFees": "https://schema.org/FreeReturn"
        }
      },
      ...(product.averageRating && {
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": product.averageRating,
          "reviewCount": product.reviewCount || 1,
          "bestRating": "5",
          "worstRating": "1"
        }
      })
    }
  };
};

const generateItemListSchema = (
  products: any[],
  totalCount: number,
  currentUrl: string,
  serverInput: any
): WithContext<ItemList> | null => {
  if (!products?.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${currentUrl}#itemlist`,
    "numberOfItems": totalCount,
    "itemListElement": products.map((product, index) =>
      generateProductSchema(
        product,
        (serverInput.page - 1) * serverInput.pageSize + index + 1
      )
    )
  };
};

// ============================================================================
// METADATA GENERATION
// ============================================================================

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  if (!process.env.NEXT_PUBLIC_BASE_URL_DOMAIN) {
    throw new Error("NEXT_PUBLIC_BASE_URL_DOMAIN is not defined");
  }

  try {
    const previousImages = (await parent).openGraph?.images || [];
    const canonicalPath = generateCanonicalUrl(searchParams);
    const canonicalUrl = `${baseUrl}${canonicalPath}`;

    const pageTitle = generateTitle(searchParams);
    const pageDescription = generateDescription(searchParams);
    const pageKeywords = generateKeywords(searchParams);

    // Fetch products for Open Graph images
    let productImages: any[] = [];
    try {
      const serverInput = buildServerInput(searchParams, 1, 4);
      const data = await fetchGraphQLData(
        SEARCH_PRODUCTS_QUERY_NO_GQL,
        { input: serverInput },
        { revalidate: 3600 }
      );

      const products = data?.searchProducts?.results?.products || [];
      productImages = products
        .filter((product: any) => product.images?.[0])
        .map((product: any) => ({
          url: getProductImageUrl(product)!,
          width: 1200,
          height: 630,
          alt: `${product.name} - ita-luxury`,
        }))
        .slice(0, 4);
    } catch (error) {
      console.error("Error fetching product images:", error);
    }

    const logoUrl = `${baseUrl}/images/logos/LOGO-WHITE-BG.webp`;
    const openGraphImages = productImages.length > 0
      ? productImages
      : [{ url: logoUrl, width: 1200, height: 630, alt: `ita-luxury - ${pageTitle}` }];

    // Determine indexing
    const currentPage = Number(searchParams.page) || 1;
    const shouldIndex = currentPage === 1;

    // Generate prev/next URLs for pagination
    const prevUrl = currentPage > 2 
      ? generateCanonicalUrl({ ...searchParams, page: String(currentPage - 1) })
      : currentPage === 2
      ? generateCanonicalUrl({ ...searchParams, page: undefined })
      : undefined;

    return {
      title: pageTitle,
      description: pageDescription,
      keywords: pageKeywords.join(", "),

      openGraph: {
        type: "website",
        title: pageTitle,
        description: pageDescription,
        images: [...openGraphImages, ...previousImages],
        siteName: "ita-luxury",
        url: canonicalUrl,
        locale: "fr_TN",
      },

      twitter: {
        card: "summary_large_image",
        title: pageTitle,
        description: pageDescription,
        images: openGraphImages.map(img => img.url),
        creator: "@ita_luxury",
        site: "@ita_luxury",
      },

      alternates: {
        canonical: canonicalUrl,
        languages: {
          'fr-TN': canonicalUrl,
          'x-default': canonicalUrl,
        },
      },

      robots: {
        index: shouldIndex,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
        googleBot: {
          index: shouldIndex,
          follow: true,
          'max-snippet': -1,
          'max-image-preview': 'large',
          'max-video-preview': -1,
        }
      },

      category: searchParams.category,

      other: {
        'og:price:currency': 'TND',
        'og:availability': 'instock',
        ...(prevUrl && { 'prev': `${baseUrl}${prevUrl}` }),
      }
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Collections - ita-luxury",
      description: "Découvrez notre collection de produits  luxe en Tunisie",
      alternates: {
        canonical: `${baseUrl}/Collections`,
      },
    };
  }
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default async function AllProductsPage({ searchParams }: Props) {
  try {
    const breadcrumbPath = await generateBreadcrumbPath(searchParams);
    const token = cookies().get('Token')?.value;
    const decodedUser = token ? decodeToken(token) : null;
    const userData = await getUser(decodedUser?.userId);

    // Fetch initial data
    const currentPage = Number(searchParams.page) || 1;
    const serverInput = buildServerInput(searchParams, currentPage, 12);

    let initialData: any = null;
    try {
      const data = await fetchGraphQLData(
        SEARCH_PRODUCTS_QUERY_NO_GQL,
        { input: serverInput },
        { revalidate: 3600, tags: ['collection-search'] }
      );

      const res = data?.searchProducts;
      if (res) {
        initialData = {
          products: res.results?.products ?? [],
          totalCount: res.totalCount ?? 0,
          currentPage: res.pagination?.currentPage ?? currentPage,
          hasMore: res.pagination?.hasNextPage ?? false,
          categoryDescription: res.results?.products?.[0]?.categories?.[0]?.description || "",
        };
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }

    // Generate canonical URL
    const canonicalPath = generateCanonicalUrl(searchParams);
    const currentPageFullUrl = `${baseUrl}${canonicalPath}`;

    // Generate all schemas
    const websiteSchema = generateWebsiteSchema();
    const organizationSchema = generateOrganizationSchema();
    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbPath, currentPageFullUrl);
    const collectionPageSchema = generateCollectionPageSchema(searchParams, currentPageFullUrl);
    const itemListSchema = generateItemListSchema(
      initialData?.products || [],
      initialData?.totalCount || 0,
      currentPageFullUrl,
      serverInput
    );

    // Combine schemas using @graph
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        websiteSchema,
        organizationSchema,
        breadcrumbSchema,
        collectionPageSchema,
        ...(itemListSchema ? [itemListSchema] : [])
      ].filter(Boolean)
    };

    return (
      <>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
          key="collection-structured-data"
        />

        {/* Main Content */}
        <main>
          <Breadcumb Path={breadcrumbPath} />
          <ProductsSection userData={userData} initialData={initialData} />
        </main>
      </>
    );
  } catch (error) {
    console.error("Error rendering AllProductsPage:", error);
    return (
      <main className="error-container p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Une erreur s'est produite</h1>
        <p className="text-gray-600">
          Nous n'avons pas pu charger les produits. Veuillez réessayer plus tard.
        </p>
      </main>
    );
  }
}