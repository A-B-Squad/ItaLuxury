import keywords from "@/public/keywords";
import { Metadata } from "next";
import { JsonLd } from "react-schemaorg";
import ProductDetailsSection from "./ProductDetailsSection";
import { formatRating } from "@/app/Helpers/_formatRating";

interface Review {
  rating: number;
  userId: string;
}

interface ProductData {
  [x: string]: any;
  id: string;
  name: string;
  price: number;
  reference: string;
  description: string;
  inventory: number;
  images: string[];
  technicalDetails: string
  reviews: Review[];
  Colors?: {
    color: string;
    Hex: string;
  };
  Brand?: {
    name: string;
  };
  categories: Array<{
    id: string;
    name: string;
    description: string;
    subcategories?: Array<{
      id: string;
      name: string;
      parentId: string;
      subcategories?: Array<{
        id: string;
        name: string;
        parentId: string;
      }>;
    }>;
  }>;
}

async function fetchProductData(
  productId: string
): Promise<ProductData | null> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }
  if (!productId) {
    return null;
  }
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 3600
      },
      body: JSON.stringify({
        query: `
         query ProductById($productByIdId: ID!) {
            productById(id: $productByIdId) {
              id
              name
              price
              isVisible
              reference
              description
              inventory
              solde
              images
              createdAt
              categories {
                id
                name
                description
                subcategories {
                  id
                  name
                  parentId
                  subcategories {
                    id
                    name
                    parentId
                  }
                }
              }
              productDiscounts {
                id
                price
                newPrice
                dateOfEnd
                dateOfStart
              }
              Colors {
                id
                color
                Hex
              }
             technicalDetails
              reviews {
                rating
                userId
              }
              Brand {
                name
              }
            }
         }
        `,
        variables: {
          productByIdId: productId,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data, errors } = await response.json();

    if (errors) {
      console.error("GraphQL errors:", errors);
      return null;
    }

    return data?.productById || null;
  } catch (error) {
    console.error("Error fetching product data:", error);
    return null;
  }
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { productId: string };
}): Promise<Metadata> {
  if (!process.env.NEXT_PUBLIC_BASE_URL_DOMAIN) {
    throw new Error("BASE_URL_DOMAIN is not defined");
  }

  const productData = await fetchProductData(searchParams.productId);

  if (!productData) {
    return {
      title: "Produit non trouvé | ita-luxury",
      description: "Le produit demandé n'a pas pu être trouvé.",
    };
  }

  const rating = formatRating(productData.reviews || []);
  const cleanDescription =
    productData.categories[2]?.description?.replace(/<[^>]*>/g, "") || "";
  const productName = productData.name || "Produit";
  const productReference = productData.reference || "";
  const brandName = productData.Brand?.name || "";
  const technicalDetails = productData.technicalDetails || "";

  // Enhanced title with brand name if available
  const title = `${productName} ${brandName ? `- ${brandName} ` : ""}${rating ? `| ${rating.average}/5 ⭐ (${rating.count} avis) ` : ""}| ita-luxury`;

  // Enhanced description with more product details
  const description = cleanDescription
    ? `${cleanDescription.slice(0, 120)}${rating ? ` | Note: ${rating.average}/5 (${rating.count} avis)` : ""} - ita-luxury`
    : `Découvrez ${productName}${brandName ? ` de ${brandName}` : ""} sur ita-luxury. Livraison rapide dans toute la Tunisie.`;

  // Enhanced keywords with more product-specific terms
  const productKeywords = [
    ...keywords,
    productName,
    productReference,
    brandName,
    productData.Colors?.color,
    ...(productData.categories || []).map((cat: any) => cat.name),
    technicalDetails,
    rating ? `${rating.average} étoiles` : "",
    "avis client",
    "évaluation produit",
    "acheter en ligne",
    "Tunisie",
    "livraison rapide"
  ].filter(Boolean);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_DOMAIN.replace(/\/$/, "");
  const productUrl = `${baseUrl}/products/tunisie?productId=${productData.id}`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    openGraph: {
      type: "website",
      title: `${productName} ${brandName ? `- ${brandName} ` : ""}${rating ? `(${rating.average}/5 ⭐) avis)` : ""}`,
      description,
      images: (productData.images || []).map((image: any) => ({
        url: image,
        width: 1200,
        height: 630,
        alt: `${productName} - ${productReference} ${rating ? `- Note: ${rating.average}/5` : ""}`,
      })),
      url: productUrl,
      siteName: "ita-luxury",
    },
    twitter: {
      card: "summary_large_image",
      title: `${productName} ${brandName ? `- ${brandName} ` : ""}${rating ? `(${rating.average}/5 ⭐)(${rating.count} avis)` : ""}`,
      description,
      images: productData.images || [],
      creator: "@ita_luxury",
    },
    keywords: productKeywords.join(", "),
    alternates: {
      canonical: `${baseUrl}/products/tunisie?productId=${searchParams.productId}`,
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  };
}

const ProductDetailsPage = async ({
  searchParams,
}: {
  searchParams: { productId: string };
}) => {
  const productData = await fetchProductData(searchParams.productId);

  if (!productData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Product Not Found
          </h1>
          <p className="mt-2 text-gray-600">
            The requested product could not be found.
          </p>
        </div>
      </div>
    );
  }

  const rating = formatRating(productData.reviews || []);
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL_DOMAIN?.replace(/\/$/, "") || "";


  // Format prices consistently with 3 decimal places (Tunisian format)
  const formatPriceForDisplay = (price: number | string): string => {
    const numericPrice = typeof price === 'number' ? price : parseFloat(price);
    return numericPrice.toFixed(3);
  };

  // Safely format date to ISO string
  const safeFormatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      // Check if date is valid before converting to ISO string
      if (isNaN(date.getTime())) {
        return new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];
      }
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error("Error formatting date:", error);
      // Return a default date one year from now
      return new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];
    }
  };

  const originalPrice = formatPriceForDisplay(productData.price);
  const discountedPrice = productData.productDiscounts?.length > 0
    ? formatPriceForDisplay(productData.productDiscounts[0].newPrice)
    : null;

  // Get discount end date safely
  const discountEndDate = productData.productDiscounts?.length > 0
    ? safeFormatDate(productData.productDiscounts[0].dateOfEnd)
    : safeFormatDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toString());

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      ...(productData.categories?.[0]?.name
        ? [
          {
            "@type": "ListItem",
            position: 2,
            name: productData.categories[0].name,
            item: `${baseUrl}/Collections/tunisie?category=${encodeURIComponent(productData.categories[0].name)}`,
          },
        ]
        : []),
      {
        "@type": "ListItem",
        position: productData.categories?.[0]?.name ? 3 : 2,
        name: productData.name || "Product",
        item: `${baseUrl}/products/tunisie?productId=${productData.id}`,
      },
    ],
  };

  // Add more detailed product schema with enhanced properties
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productData.name || "Product",
    description: productData.description?.replace(/<[^>]*>/g, "") || "",
    image: Array.isArray(productData.images)
      ? productData.images.map(img => img.startsWith('http') ? img : `${baseUrl}${img}`)
      : [],
    sku: productData.id,
    mpn: productData.id,
    identifier_exists: productData.id ? "yes" : "no",
    gtin: productData.id,
    brand: {
      "@type": "Brand",
      name: productData.Brand?.name || productData.categories?.[productData.categories.length - 1]?.name,
    },
    color: productData.Colors?.color,
    category: productData.categories?.[0]?.name || "",
    offers: {
      "@type": "Offer",
      priceCurrency: "TND",
      price: discountedPrice || originalPrice,
      itemCondition: "https://schema.org/NewCondition",
      priceValidUntil: discountEndDate,
      availability:
        (productData.inventory || 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${baseUrl}/products/tunisie?productId=${productData.id}`,
      seller: {
        "@type": "Organization",
        name: "ita-luxury",
        url: baseUrl
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          currency: "TND",
          value: "8.000"
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "TN"
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY"
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 3,
            unitCode: "DAY"
          }
        }
      },
      ...(discountedPrice && {
        priceSpecification: {
          "@type": "PriceSpecification",
          price: originalPrice,
          priceCurrency: "TND",
          valueAddedTaxIncluded: true
        }
      })
    },
    ...(rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating.average,
        bestRating: rating.best,
        reviewCount: rating.count,
        worstRating: 0,

      },
    }),
    review: (productData.reviews || []).map((review: { rating: any }) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "client",
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 0,
      },
    })),
    additionalProperty: productData.technicalDetails,
  };

  return (
    <div className="bg-gray-50 p-2 md:py-6">
      <JsonLd<any> item={breadcrumbList} />
      <JsonLd<any> item={productSchema} />
      <ProductDetailsSection
        productDetails={productData}
        productId={searchParams.productId}
      />
    </div>
  );
};

export default ProductDetailsPage;
