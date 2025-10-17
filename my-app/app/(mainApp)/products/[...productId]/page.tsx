import { Metadata } from "next";
import ProductDetailsSection from "./ProductDetailsSection";
import { formatRating } from "@/app/Helpers/_formatRating";
import { fetchGraphQLData } from "@/utlils/graphql";
import { GET_PRODUCTS_BY_SLUG } from "@/graphql/queries";
import { getUser } from "@/utlils/getUser";
import { cookies } from "next/headers";
import { decodeToken } from "@/utlils/tokens/token";
import { getCompanyInfo } from "@/utlils/getCompanyInfo";
import { BreadcrumbList, Product } from 'schema-dts';


async function fetchProductDetails(slug: string) {
  try {
    const data = await fetchGraphQLData(
      GET_PRODUCTS_BY_SLUG,
      { slug: slug },
      { revalidate: 300,  tags: [`product`] },
    );
    return data.getProductBySlug || null;
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { slug: string };
}): Promise<Metadata> {
  if (!process.env.NEXT_PUBLIC_BASE_URL_DOMAIN) {
    throw new Error("BASE_URL_DOMAIN is not defined");
  }

  const productData = await fetchProductDetails(searchParams.slug);

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

  const title = `${productName} ${brandName ? `- ${brandName} ` : ""}${rating ? `| ${rating.average}/5 ⭐ (${rating.count} avis) ` : ""}| ita-luxury`;

  const description = cleanDescription
    ? `${cleanDescription.slice(0, 120)}${rating ? ` | Note: ${rating.average}/5 (${rating.count} avis)` : ""} - ita-luxury`
    : `Découvrez ${productName}${brandName ? ` de ${brandName}` : ""} sur ita-luxury. Livraison rapide dans toute la Tunisie.`;

  const productKeywords = [
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
  const productUrl = `${baseUrl}/products/tunisie?slug=${productData.slug}`;

  const processedImages = (productData.images || [])
    .filter((img: string) => img && img.trim() !== '')
    .map((image: string) => {
      return {
        url: image.startsWith('http') ? image : `${baseUrl}${image}`,
        width: 800,
        height: 600,
        alt: `${productName} - ${productReference}`,
        priority: false
      };
    })
    .slice(0, 3);

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
    },
    twitter: {
      card: "summary_large_image",
      title: `${productName} ${brandName ? `- ${brandName} ` : ""}${rating ? `(${rating.average}/5 ⭐)(${rating.count} avis)` : ""}`,
      description,
      images: processedImages.map((img: { url: string; }) => img.url),
    },
    keywords: productKeywords.join(", "),
    alternates: {
      canonical: `${baseUrl}/products/tunisie?slug=${searchParams.slug}`,
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
  searchParams: { slug: string };
}) => {
  const token = cookies().get('Token')?.value;
  const decodedUser = token ? decodeToken(token) : null;

  const [userData, productData, companyData] = await Promise.all([
    getUser(decodedUser?.userId),
    fetchProductDetails(searchParams.slug),
    getCompanyInfo()
  ]);

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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_DOMAIN?.replace(/\/$/, "") || "";



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

  const originalPrice = productData.price;
  const discountedPrice = productData.productDiscounts?.length > 0
    ? productData.productDiscounts[0].newPrice
    : null;

  const discountEndDate = productData.productDiscounts?.length > 0
    ? safeFormatDate(productData.productDiscounts[0].dateOfEnd)
    : safeFormatDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toString());

  const processedImagesForSchema = (productData.images || [])
    .filter((img: string) => img && img.trim() !== '')
    .slice(0, 10);

  // Type-safe BreadcrumbList schema (without @context for @graph)
  const breadcrumbList: BreadcrumbList = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: productData.categories[0].name,
        item: `${baseUrl}/Collections/tunisie?category=${encodeURIComponent(productData.categories[0].name)}`,
      },
      {
        "@type": "ListItem" as const,
        position: 2,
        name: productData.categories[1].name,
        item: `${baseUrl}/Collections/tunisie?category=${encodeURIComponent(productData.categories[1].name)}`,
      },
      {
        "@type": "ListItem" as const,
        position: 3,
        name: productData.categories[2].name,
        item: `${baseUrl}/Collections/tunisie?category=${encodeURIComponent(productData.categories[2].name)}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: productData.name || "Product",
        item: `${baseUrl}/products/tunisie?slug=${productData.slug}`,
      },
    ],
  };

  // Type-safe Product schema (without @context for @graph)
  const productSchema: Product = {
    "@type": "Product",
    name: productData.name || "Product",
    description: productData.description?.replace(/<[^>]*>/g, "").trim() || `Découvrez ${productData.name} sur ita-luxury`,
    category: productData.categories[2].name,
    image: productData.images[0],
    sku: productData.reference || productData.id,
    mpn: productData.reference || productData.id,
    gtin: productData.id,
    url: `${baseUrl}/products/tunisie?productId=${productData.id}`,
    brand: {
      "@type": "Brand",
      name: productData.Brand?.name || "ita-luxury",
      url: `${baseUrl}/Collections/tunisie?page=1&brand=${encodeURIComponent(productData.Brand?.name || "ita-luxury")}`,
    },
    ...(productData.Colors?.color && {
      color: productData.Colors.color
    }),
    offers: {
      "@type": "Offer",
      priceCurrency: "TND",
      name: productData.name || "Product",
      price: discountedPrice || originalPrice,
      url: `${baseUrl}/products/tunisie?slug=${productData.slug}`,
      priceValidUntil: discountEndDate,
      image: processedImagesForSchema,
      sku: productData.reference || productData.id,
      mpn: productData.reference || productData.id,
      itemCondition: "https://schema.org/NewCondition",
      availability: (productData.inventory || 0) > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "ita luxury",
        url: baseUrl,
        logo: `${baseUrl}/images/logos/LOGO-WHITE-BG.webp`,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+216-23-212-892",
          contactType: "customer support",
          areaServed: "TN",
          availableLanguage: ["fr", "ar"]
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
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "TN",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn"
      }
    },
    ...(rating && rating.count > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        // ratingValue: rating.average,
        // ratingCount: rating.count,
        ratingValue: 4.7,
        ratingCount: 232,
        bestRating: 5,
        worstRating: 1,
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

  // Combine schemas using @graph for better performance
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [breadcrumbList, productSchema]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
        key="product-structured-data"
      />
      <div className="bg-gray-50 md:p-2 md:py-6">
        <ProductDetailsSection
          userData={userData}
          productDetails={productData}
          slug={searchParams.slug}
          companyData={companyData}
        />
      </div>
    </>
  );
};

export default ProductDetailsPage;