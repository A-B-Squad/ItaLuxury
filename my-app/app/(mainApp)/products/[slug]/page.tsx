import { Metadata } from "next";
import ProductDetailsSection from "./ProductDetailsSection";
import { formatRating } from "@/app/Helpers/_formatRating";
import { fetchGraphQLData } from "@/utils/graphql";
import { GET_PRODUCTS_BY_SLUG } from "@/graphql/queries";
import { getUser } from "@/utils/getUser";
import { cookies } from "next/headers";
import { decodeToken } from "@/utils/tokens/token";
import { getCompanyInfo } from "@/utils/getCompanyInfo";
import { BreadcrumbList, Organization, Product, WithContext } from 'schema-dts';

// Helper functions
const formatPriceForSchema = (price: number): string => {
  return Number(price).toFixed(2);
};

const cleanHtml = (html: string): string => {
  return html?.replace(/<[^>]*>/g, "").trim() || "";
};

const safeFormatDate = (dateString: string | number): string => {
  try {
    const timestamp = typeof dateString === 'string' ? Number.parseInt(dateString) : dateString;
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];
    }
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error("Error formatting date:", error);
    return new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];
  }
};

const getCategoryHierarchy = (categories: any[] = []) => {
  return categories
    .filter(cat => cat && cat.name)
    .map((cat, index) => ({
      ...cat,
      position: index + 1
    }));
};

async function fetchProductDetails(slug: string) {
  try {
    const data = await fetchGraphQLData(
      GET_PRODUCTS_BY_SLUG,
      { slug: slug },
      {
        revalidate: 300,
        tags: [`product-${slug}`],
      },
    );

    if (!data?.getProductBySlug) {
      console.warn(`Product with slug "${slug}" not found`);
      return null;
    }

    return data.getProductBySlug;
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
}

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!process.env.NEXT_PUBLIC_BASE_URL_DOMAIN) {
    throw new Error("BASE_URL_DOMAIN is not defined");
  }

  const productData = await fetchProductDetails(params.slug);

  if (!productData) {
    return {
      title: "Produit non trouvé | ita-luxury",
      description: "Le produit demandé n'a pas pu être trouvé.",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const rating = formatRating(productData.reviews || []);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_DOMAIN.replace(/\/$/, "");

  //   URL canonique cohérente avec la structure de route
  const productUrl = `${baseUrl}/products/${params.slug}`;

  // Dynamic title and description
  const productName = productData.name || "Produit";
  const brandName = productData.Brand?.name || "";
  const categoryName = productData.categories?.[2]?.name || productData.categories?.[0]?.name || "";

  const title = `${productName} ${brandName ? `- ${brandName} ` : ""}${rating ? `| ${rating.average}/5 ⭐ (${rating.count} avis) ` : ""}| ita-luxury`;

  const description = cleanHtml(productData.description)?.slice(0, 155)
    || `Découvrez ${productName}${brandName ? ` de ${brandName}` : ""}${categoryName ? ` dans la catégorie ${categoryName}` : ""} sur ita-luxury. Livraison rapide dans toute la Tunisie.`;

  // Dynamic keywords
  const productKeywords = [
    productName,
    productData.reference,
    brandName,
    productData.Colors?.color,
    ...(productData.categories || []).map((cat: any) => cat.name),
    "acheter en ligne",
    "Tunisie",
    "livraison rapide",
    rating ? `${rating.average} étoiles` : "",
    "avis client"
  ].filter(Boolean);

  // Process images dynamically
  const processedImages = (productData.images || [])
    .filter((img: string) => img && img.trim() !== '')
    .map((image: string) => ({
      url: image.startsWith('http') ? image : `${baseUrl}${image}`,
      width: 800,
      height: 600,
      alt: `${productName} - ${productData.reference || ''}`,
    }))
    .slice(0, 5);

  // Get price information
  const originalPrice = productData.price;
  const discountedPrice = productData.productDiscounts?.[0]?.newPrice;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    openGraph: {
      type: "article",
      title: `${productName} ${brandName ? `- ${brandName} ` : ""}${rating ? `(${rating.average}/5 ⭐)` : ""}`,
      description,
      images: processedImages,
      url: productUrl,
      ...(productData && {
        product: {
          price: {
            amount: (discountedPrice || originalPrice)?.toString(),
            currency: 'TND',
          },
          ...(discountedPrice && {
            salePrice: {
              amount: discountedPrice.toString(),
              currency: 'TND',
            },
            originalPrice: {
              amount: originalPrice.toString(),
              currency: 'TND',
            },
          }),
          availability: (productData.inventory || 0) > 0 ? 'in stock' : 'out of stock',
          brand: brandName,
        }
      })
    },
    twitter: {
      card: "summary_large_image",
      title: `${productName} ${rating ? `(${rating.average}/5 ⭐)` : ""}`,
      description,
      images: processedImages.map((img: { url: string; }) => img.url),
    },
    keywords: productKeywords.join(", "),
    alternates: {
      canonical: productUrl,
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
    other: {
      'product:price:amount': (discountedPrice || originalPrice)?.toString(),
      'product:price:currency': 'TND',
      ...(discountedPrice && {
        'product:sale_price:amount': discountedPrice.toString(),
        'product:original_price:amount': originalPrice.toString(),
      }),
      'product:availability': (productData.inventory || 0) > 0 ? 'in stock' : 'out of stock',
      'product:brand': brandName,
    },
  };
}

const ProductDetailsPage = async ({ params }: Props) => {
  const token = cookies().get('Token')?.value;
  const decodedUser = token ? decodeToken(token) : null;

  const [userData, productData, companyData] = await Promise.all([
    getUser(decodedUser?.userId),
    fetchProductDetails(params.slug),
    getCompanyInfo()
  ]);

  if (!productData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Produit non trouvé
          </h1>
          <p className="mt-2 text-gray-600">
            Le produit demandé n'a pas pu être trouvé.
          </p>
        </div>
      </div>
    );
  }

  const rating = formatRating(productData.reviews || []);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_DOMAIN?.replace(/\/$/, "") || "";

  // Price calculations for any product
  const originalPrice = productData.price;
  const discountedPrice = productData.productDiscounts?.[0]?.newPrice;
  const discountEndDate = productData.productDiscounts?.[0]?.dateOfEnd
    ? safeFormatDate(productData.productDiscounts[0].dateOfEnd)
    : safeFormatDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toString());

  // Process images for any product
  const processedImagesForSchema = (productData.images || [])
    .filter((img: string) => img && img.trim() !== '')
    .map((img: string) => img.startsWith('http') ? img : `${baseUrl}${img}`)
    .slice(0, 10);

  // Dynamic breadcrumbs for any category structure
  const categories = getCategoryHierarchy(productData.categories);
  const breadcrumbList: BreadcrumbList = {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": baseUrl
      },
      // Dynamically generate breadcrumbs based on available categories
      ...categories.map((category, index) => ({
        "@type": "ListItem" as const,
        "position": index + 2,
        "name": category.name,
        "item": `${baseUrl}/Collections/tunisie?category=${encodeURIComponent(category.name)}`
      })),
      {
        "@type": "ListItem",
        "position": categories.length + 2,
        "name": productData.name,
        "item": `${baseUrl}/products/${productData.slug}`
      }
    ]
  };

  const productSchema: WithContext<Product> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${baseUrl}/products/${productData.slug}`,
    "name": productData.name,
    "description": cleanHtml(productData.description)?.slice(0, 500) || `Découvrez ${productData.name} sur ita-luxury.`,
    "category": categories[categories.length - 1]?.name || categories[0]?.name || "Produit",
    "image": processedImagesForSchema,
    "sku": productData.reference || productData.id,
    "mpn": productData.reference || productData.id,
    "gtin": productData.id,
    "url": `${baseUrl}/products/${productData.slug}`,

    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/products/${productData.slug}`
    },

    // Brand information
    ...(productData.Brand?.name && {
      "brand": {
        "@type": "Brand",
        "name": productData.Brand.name,
        "url": `${baseUrl}/Collections/tunisie?brand=${encodeURIComponent(productData.Brand.name)}`
      }
    }),

    // Color information
    ...(productData.Colors?.color && {
      "color": productData.Colors.color,
    }),

    // CRITICAL: Offers with Tunisia-specific information
    "offers": {
      "@type": "Offer",
      "@id": `${baseUrl}/products/${productData.slug}#offer`,
      "url": `${baseUrl}/products/${productData.slug}`,

      // Price in TND
      "priceCurrency": "TND",
      "price": formatPriceForSchema(discountedPrice || originalPrice),
      "priceValidUntil": discountEndDate,

      // Availability
      "availability": (productData.inventory || 0) > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",

      "itemCondition": "https://schema.org/NewCondition",

      // Stock quantity
      ...(typeof productData.inventory === 'number' && productData.inventory > 0 && {
        "inventoryLevel": {
          "@type": "QuantitativeValue",
          "value": productData.inventory
        }
      }),

      // Sale price if applicable
      ...(discountedPrice && discountedPrice < originalPrice && {
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": formatPriceForSchema(discountedPrice),
          "priceCurrency": "TND",
          "priceType": "https://schema.org/SalePrice"
        }
      }),

      // CRITICAL: Seller information for Tunisia
      "seller": {
        "@type": "Organization",
        "@id": `${baseUrl}#organization`,
        "name": companyData?.name || "ita luxury",
        "url": baseUrl,
        "logo": `${baseUrl}/images/logos/LOGO-WHITE-BG.webp`,

        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Rue du Colonel El Hedi El Garnaoui, Khzema",
          "addressLocality": "Tunis",
          "addressRegion": "Tunis",
          "postalCode": "4051",
          "addressCountry": "TN"
        },

        // Contact information
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+216-23-212-892",
          "contactType": "customer service",
          "areaServed": "TN",
          "availableLanguage": ["fr", "ar"],
          "email": "italuxury2002@gmail.com"
        }
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

      // CRITICAL: Geographic restrictions
      "eligibleRegion": {
        "@type": "GeoShape",
        "addressCountry": "TN"
      },

      // CRITICAL: Explicitly exclude France
      "ineligibleRegion": [
        {
          "@type": "GeoShape",
          "addressCountry": "FR"
        }
      ]
    },

    // Reviews and ratings
    ...(rating && rating.count > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": rating.average.toString(),
        "ratingCount": rating.count.toString(),
        "bestRating": "5",
        "worstRating": "1"
      }
    }),

    ...(productData.reviews && productData.reviews.filter((r: any) => r.rating && r.comment).length > 0 && {
      "review": productData.reviews
        .filter((review: any) => review.rating && review.comment?.trim())
        .slice(0, 5)
        .map((review: any) => ({
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": review.userName || "Acheteur vérifié"
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": review.rating.toString(),
            "bestRating": "5",
            "worstRating": "1"
          },
          "reviewBody": review.comment.trim(),
          "datePublished": review.createdAt
            ? safeFormatDate(review.createdAt)
            : safeFormatDate(Date.now())
        }))
    }),
  };

  const organizationSchema: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}#organization`,
    "name": "ita luxury",
    "url": baseUrl,
    "logo": `${baseUrl}/images/logos/LOGO-WHITE-BG.webp`,
    "description": "Boutique en ligne de produits électroniques et accessoires en Tunisie",

    // CRITICAL: Tunisia address
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
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbList),
        }}
        key="breadcrumb-structured-data"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
        key="product-structured-data"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
        key="organization-structured-data"
      />
      <div className="bg-gray-50 md:p-2 md:py-6">
        <ProductDetailsSection
          userData={userData}
          productDetails={productData}
          slug={params.slug}
          companyData={companyData}
        />
      </div>
    </>
  );
};

export default ProductDetailsPage;