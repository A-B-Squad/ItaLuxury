import keywords from "@/public/scripts/keywords";
import { Metadata } from "next";
import { JsonLd } from "react-schemaorg";
import ProductDetailsSection from "./ProductDetailsSection";
import { formatRating } from "@/app/Helpers/_formatRating";
import { fetchGraphQLData } from "@/utlils/graphql";
import { GET_PRODUCTS_BY_ID } from "@/graphql/queries";
import { getUser } from "@/utlils/getUser";
import { cookies } from "next/headers";
import { decodeToken } from "@/utlils/tokens/token";
import { getCompanyInfo } from "@/utlils/getCompanyInfo";


async function fetchProductDetails(productId: string) {
  try {
    const data = await fetchGraphQLData(GET_PRODUCTS_BY_ID, { productByIdId: productId });
    return data.productById || null;
  } catch (error) {
    console.error('Error fetching product details:', error);
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

  const productData = await fetchProductDetails(searchParams.productId);

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

  //  title with brand name if available
  const title = `${productName} ${brandName ? `- ${brandName} ` : ""}${rating ? `| ${rating.average}/5 ⭐ (${rating.count} avis) ` : ""}| ita-luxury`;

  //  description with more product details
  const description = cleanDescription
    ? `${cleanDescription.slice(0, 120)}${rating ? ` | Note: ${rating.average}/5 (${rating.count} avis)` : ""} - ita-luxury`
    : `Découvrez ${productName}${brandName ? ` de ${brandName}` : ""} sur ita-luxury. Livraison rapide dans toute la Tunisie.`;

  //  keywords with more product-specific terms
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

  // Process images to ensure they're absolute URLs and properly formatted
  const processedImages = (productData.images || [])
    .filter((img: string) => img && img.trim() !== '')
    .map((image: string) => {
      // Ensure absolute URL
      const absoluteUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
      return {
        url: absoluteUrl,
        width: 1200,
        height: 630,
        alt: `${productName} - ${productReference} ${rating ? `- Note: ${rating.average}/5` : ""} - ita-luxury`,
      };
    })
    .slice(0, 6);

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    openGraph: {
      type: "website",
      title: `${productName} ${brandName ? `- ${brandName} ` : ""}${rating ? `(${rating.average}/5 ⭐)` : ""}`,
      description,
      images: processedImages,
      url: productUrl,
      siteName: "ita-luxury",
      locale: "fr_TN",
    },
    twitter: {
      card: "summary_large_image",
      title: `${productName} ${brandName ? `- ${brandName} ` : ""}${rating ? `(${rating.average}/5 ⭐)(${rating.count} avis)` : ""}`,
      description,
      images: processedImages.map((img: { url: string; }) => img.url),
      creator: "@ita_luxury",
      site: "@ita_luxury",
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
  const cookieStore = cookies()
  const token = cookieStore.get('Token')?.value
  const decodedUser = token ? decodeToken(token) : null;
  const userData = await getUser(decodedUser?.userId);
  const productData = await fetchProductDetails(searchParams.productId);
  const companyData = await getCompanyInfo();
 
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
      if (isNaN(date.getTime())) {
        return new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];
      }
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error("Error formatting date:", error);
      return new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];
    }
  };

  const originalPrice = formatPriceForDisplay(productData.price);
  const discountedPrice = productData.productDiscounts?.length > 0
    ? formatPriceForDisplay(productData.productDiscounts[0].newPrice)
    : null;

  const discountEndDate = productData.productDiscounts?.length > 0
    ? safeFormatDate(productData.productDiscounts[0].dateOfEnd)
    : safeFormatDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toString());

  // Process images for schema - ensure they're absolute URLs and high quality
  const processedImagesForSchema = (productData.images || [])
    .filter((img: string) => img && img.trim() !== '')
    .map((image: string) => {
      const absoluteUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
      return absoluteUrl;
    })
    .slice(0, 10);

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
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

  //  product schema with all Google requirements
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productData.name || "Product",
    description: productData.description?.replace(/<[^>]*>/g, "").trim() || `Découvrez ${productData.name} sur ita-luxury`,
    image: processedImagesForSchema,
    sku: productData.reference || productData.id,
    mpn: productData.reference || productData.id,
    gtin: productData.id,
    productID: productData.id,
    url: `${baseUrl}/products/tunisie?productId=${productData.id}`,
    brand: {
      "@type": "Brand",
      name: productData.Brand?.name || "ita-luxury",
      url: baseUrl
    },
    manufacturer: {
      "@type": "Organization",
      name: productData.Brand?.name || "ita-luxury",
      url: baseUrl
    },
    ...(productData.Colors?.color && {
      color: productData.Colors.color
    }),
    category: productData.categories
      ?.map((cat: any) => cat.name)
      .join(" > ") || "Produits",
    offers: {
      "@type": "Offer",
      priceCurrency: "TND",
      price: discountedPrice || originalPrice,
      lowPrice: discountedPrice || originalPrice,
      highPrice: originalPrice,
      itemCondition: "https://schema.org/NewCondition",
      priceValidUntil: discountEndDate,
      availability: (productData.inventory || 0) > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      inventoryLevel: productData.inventory || 0,
      url: `${baseUrl}/products/tunisie?productId=${productData.id}`,
      seller: {
        "@type": "Organization",
        name: "ita-luxury",
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+216-23-212-892",
          contactType: "Customer Service",
          areaServed: "TN",
          availableLanguage: ["French", "Arabic"]
        }
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
          addressCountry: "TN",
          addressRegion: "Toute la Tunisie"
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
        priceSpecification: [{
          "@type": "UnitPriceSpecification",
          price: originalPrice,
          priceCurrency: "TND",
          valueAddedTaxIncluded: true,
          validFrom: new Date().toISOString().split('T')[0]
        }]
      })
    },
    ...(rating && rating.count > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating.average,
        bestRating: 5,
        worstRating: 1,
        reviewCount: rating.count,
        ratingCount: rating.count
      },
    }),
    ...(productData.reviews && productData.reviews.length > 0 && {
      review: productData.reviews.slice(0, 5).map((review: { rating: any }, index: number) => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: `Client ${index + 1}`,
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: review.rating,
          bestRating: 5,
          worstRating: 1,
        },
        reviewBody: `Avis client sur ${productData.name}`,
        datePublished: new Date().toISOString().split('T')[0]
      }))
    }),
    ...(productData.technicalDetails && {
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "Caractéristiques techniques",
          value: productData.technicalDetails
        }
      ]
    })
  };

  return (
    <div className="bg-gray-50 md:p-2 md:py-6">
      <JsonLd<any> item={breadcrumbList} />
      <JsonLd<any> item={productSchema} />
      <ProductDetailsSection
        userData={userData}
        productDetails={productData}
        productId={searchParams.productId}
        companyData={companyData}
      />
    </div>
  );
};

export default ProductDetailsPage;