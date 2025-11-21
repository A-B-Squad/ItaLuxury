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
import { decodeToken } from "@/utils/tokens/token";
import { getUser } from "@/utils/getUser";
import { fetchGraphQLData } from "@/utils/graphql";
import { SEARCH_PRODUCTS_QUERY_NO_GQL } from "@/graphql/queries";
import { BreadcrumbList, ItemList, WithContext, WebSite, Organization, CollectionPage, ListItem, Product } from "schema-dts";

type Props = {
  params: object;
  searchParams: SearchParamsProductSearch;
};

const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL_DOMAIN ?? "https://ita-luxury.com").replace(/\/$/, "");

// Helper functions
const formatPriceForSchema = (price: number): string => {
  return Number(price).toFixed(2);
};

const cleanHtml = (html: string): string => {
  return html?.replace(/<[^>]*>/g, "").trim() || "";
};

//  Fonction pour nettoyer et valider les URLs
const cleanUrlParameters = (searchParams: SearchParamsProductSearch): URLSearchParams => {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      //  Encoder correctement les valeurs
      params.append(key, encodeURIComponent(String(value)));
    }
  });

  return params;
};

// Génération d'URL canonique robuste
const generateCleanCanonicalUrl = (searchParams: SearchParamsProductSearch): string => {
  try {
    const cleanParams = cleanUrlParameters(searchParams);
    const queryString = cleanParams.toString();

    //  URL de base cohérente pour les collections
    return queryString ? `/collections?${queryString}` : '/collections';
  } catch (error) {
    console.error("Error generating canonical URL:", error);
    return '/collections';
  }
};

// Enhanced metadata generation
export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  if (!process.env.NEXT_PUBLIC_BASE_URL_DOMAIN) {
    throw new Error("NEXT_PUBLIC_BASE_URL_DOMAIN is not defined");
  }

  try {
    const previousImages = (await parent).openGraph?.images || [];

    // Utilisation de la nouvelle fonction d'URL canonique
    const canonicalPath = generateCleanCanonicalUrl(searchParams);
    const canonicalUrl = `${baseUrl}${canonicalPath}`;

    const pageTitle = generateTitle(searchParams);
    const pageDescription = generateDescription(searchParams);
    const pageKeywords = generateKeywords(searchParams).join(", ");

    const logoUrl = `${baseUrl}/images/logos/LOGO-WHITE-BG.webp`;

    // Fetch first few products for rich images
    let productImages: any[] = [];
    try {
      const serverInput = {
        query: searchParams.query || undefined,
        categoryName: searchParams.category || undefined,
        colorName: searchParams.color || undefined,
        maxPrice: searchParams.price ? +String(searchParams.price) : undefined,
        choice: searchParams.choice || undefined,
        brandName: searchParams.brand || undefined,
        sortBy: typeof searchParams.sort === 'string' ? searchParams.sort.split(".")[0] : undefined,
        sortOrder: typeof searchParams.sort === 'string' ? searchParams.sort.split(".")[1] : undefined,
        minPrice: 1,
        visibleProduct: true,
        page: 1,
        pageSize: 4,
      };

      const data = await fetchGraphQLData(
        SEARCH_PRODUCTS_QUERY_NO_GQL,
        { input: serverInput },
        { revalidate: 300 }
      );

      const products = data?.searchProducts?.results?.products || [];
      productImages = products
        .filter((product: any) => product.images?.[0])
        .map((product: any) => ({
          url: product.images[0].startsWith('http') ? product.images[0] : `${baseUrl}${product.images[0]}`,
          width: 800,
          height: 600,
          alt: product.name,
        }))
        .slice(0, 4);
    } catch (error) {
      console.error("Error fetching product images for metadata:", error);
    }

    const openGraphImages = productImages.length > 0 ? productImages : [{
      url: logoUrl,
      width: 1200,
      height: 630,
      alt: `ita-luxury - ${pageTitle}`,
    }];

    return {
      title: pageTitle,
      description: pageDescription,
      keywords: pageKeywords,

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
      alternates: {
        canonical: `${baseUrl}/collections/tunisie`,
      },
    };
  }
}

export default async function AllProductsPage({ searchParams }: Props) {
  try {
    const breadcrumbPath = await generateBreadcrumbPath(searchParams);
    const token = cookies().get('Token')?.value;
    const decodedUser = token ? decodeToken(token) : null;
    const userData = await getUser(decodedUser?.userId);

    // Server fetch first page to hydrate initial content
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

    // URL canonique cohérente pour tous les schemas
    const currentPageCanonicalUrl = generateCleanCanonicalUrl(searchParams);
    const currentPageFullUrl = `${baseUrl}${currentPageCanonicalUrl}`;

    // Enhanced Schema Generation
    const websiteSchema: WithContext<WebSite> = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${baseUrl}#website`,
      "url": baseUrl,
      "name": "ita-luxury",
      "description": "Boutique en ligne de produits électroniques et accessoires en Tunisie",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${baseUrl}/collections/tunisie?query={search_term_string}`,
      },
      "publisher": {
        "@type": "Organization",
        "@id": `${baseUrl}#organization`
      }
    };

    const organizationSchema: WithContext<Organization> = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${baseUrl}#organization`,
      "name": "ita luxury",
      "url": baseUrl,
      "logo": `${baseUrl}/images/logos/LOGO-WHITE-BG.webp`,
      "description": "Boutique en ligne de produits électroniques et accessoires en Tunisie",

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
    };


    // Enhanced Breadcrumb Schema
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

    // Enhanced CollectionPage Schema
    const collectionPageSchema: WithContext<CollectionPage> = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${currentPageFullUrl}#webpage`,
      "url": currentPageFullUrl,
      "name": generateTitle(searchParams),
      "description": generateDescription(searchParams),
      "isPartOf": {
        "@id": `${baseUrl}#website`
      },
      "breadcrumb": {
        "@id": `${currentPageFullUrl}#breadcrumb`
      },
      "mainEntity": {
        "@id": `${currentPageFullUrl}#itemlist`
      }
    };

    // Enhanced ItemList Schema with full product details
    const itemListSchema: WithContext<ItemList> | null = initialData?.products?.length ? {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${currentPageFullUrl}#itemlist`,
      "numberOfItems": initialData.totalCount,
      "itemListOrder": "https://schema.org/ItemListOrderAscending",
      "itemListElement": initialData.products.map((product: any, index: number) => ({
        "@type": "ListItem",
        "position": (serverInput.page - 1) * serverInput.pageSize + index + 1,
        "item": {
          "@type": "Product",
          "@id": `${baseUrl}/products/${product.slug}`,
          "url": `${baseUrl}/products/${product.slug}`,
          "name": product.name,
          "image": product.images?.[0] ?
            (product.images[0].startsWith('http') ? product.images[0] : `${baseUrl}${product.images[0]}`)
            : undefined,
          "description": cleanHtml(product.description)?.slice(0, 200),
          "sku": product.reference,
          "mpn": product.reference,
          "offers": {
            "@type": "Offer",
            "priceCurrency": "TND",
            "price": formatPriceForSchema(product.price),
            "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            "availability": (product.inventory || 0) > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            "itemCondition": "https://schema.org/NewCondition",
            "url": `${baseUrl}/products/${product.slug}`,

            ...(product.productDiscounts?.[0]?.newPrice && {
              "salePrice": formatPriceForSchema(product.productDiscounts[0].newPrice),
              "originalPrice": formatPriceForSchema(product.price)
            }),

            "shippingDetails": {
              "@type": "OfferShippingDetails",
              "shippingRate": {
                "@type": "MonetaryAmount",
                "value": "8.00",
                "currency": "TND"
              },
              "shippingDestination": {
                "@type": "DefinedRegion",
                "addressCountry": "TN",
                "name": "Tunisie"
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
            // Return policy
            "hasMerchantReturnPolicy": {
              "@type": "MerchantReturnPolicy",
              "applicableCountry": "TN",
              "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
              "merchantReturnDays": 7,
              "returnMethod": "https://schema.org/ReturnByMail",
              "returnFees": "https://schema.org/FreeReturn"
            },

            // Payment methods
            "acceptedPaymentMethod": [
              {
                "@type": "PaymentMethod",
                "name": "Cash on Delivery"
              },
              {
                "@type": "PaymentMethod",
                "name": "Credit Card"
              }
            ],

            "eligibleRegion": {
              "@type": "GeoShape",
              "addressCountry": "TN"
            }
          },
          ...(product.Brand?.name && {
            "brand": {
              "@type": "Brand",
              "name": product.Brand.name
            }
          }),
          ...(product.categories?.[0]?.name && {
            "category": product.categories[0].name
          })
        }
      }))
    } : null;

    // Combine all schemas
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