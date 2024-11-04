import ProductInfo from "@/app/components/ProductInfo/ProductInfo";
import prepRoute from "@/app/Helpers/_prepRoute";
import keywords from "@/public/keywords";
import { Metadata } from "next";
import { JsonLd } from "react-schemaorg";
import ProductDetails from "./ProductDetails";

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
  attributes: Array<{
    name: string;
    value: string;
  }>;
  reviews: Review[];
  Colors?: {
    color: string;
    Hex: string;
  };
  Brand?: {
    name: string;
  };
}

// Helper function to format rating
const formatRating = (reviews: Review[]) => {
  const validReviews = reviews.filter(
    (review) => review.rating !== null && review.rating >= 0
  );

  if (validReviews.length === 0) {
    // Return an object with zeros instead of null
    return {
      average: 0,
      best: 5,
      count: 0,
    };
  }

  const sum = validReviews.reduce((total, review) => total + review.rating, 0);
  const average = (sum / validReviews.length).toFixed(1);

  return {
    average: parseFloat(average),
    best: 5,
    count: validReviews.length,
  };
};

function generateProductUrl(productData: ProductData): string {
  if (!process.env.NEXT_PUBLIC_BASE_URL_DOMAIN) {
    throw new Error("BASE_URL_DOMAIN is not defined");
  }

  const categoryNames = productData?.categories
    .map((cat: { name: any }) => cat.name)
    .join(",");
  const formattedProductName = prepRoute(productData.name);

  // Constructing SEO-friendly URL
  return `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/products/tunisie/${formattedProductName}/?productId=${productData.id}&categories=${encodeURIComponent(categoryNames)}`;
}

async function fetchProductData(productId: string): Promise<ProductData> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const { data } = await fetch(process.env.NEXT_PUBLIC_API_URL, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
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
            productDiscounts {
              id
              price
              newPrice
              dateOfEnd
              dateOfStart
            }
            categories {
              id
              name
              description
            }
            Colors {
              id
              color
              Hex
            }
            attributes {
              id
              name
              value
            }
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
  }).then((res) => res.json());

  return data?.productById;
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
  const rating = formatRating(productData.reviews);
  const productUrl = generateProductUrl(productData);
  const cleanDescription = productData?.description.replace(/<[^>]*>/g, "");
  const title = productData?.name
    ? `${productData.name} | ${rating ? `${rating.average}/5 ⭐ (${rating.count} avis) | ` : ""}${productData.reference}`
    : "Product Details | ita-luxury";

  const description = cleanDescription
    ? `${cleanDescription.slice(0, 120)}${rating ? ` | Note: ${rating.average}/5 (${rating.count} avis)` : ""} - ita-luxury`
    : "Discover the latest product on ita-luxury.";

  const productKeywords = [
    ...keywords,
    productData?.name,
    productData?.reference,
    productData?.Colors?.color,
    ...productData?.attributes.map((attr) => `${attr.name} ${attr.value}`),
    rating ? `${rating.average} étoiles` : "",
    "avis client",
    "évaluation produit",
  ].filter(Boolean);

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL_DOMAIN),
    title,
    description,
    openGraph: {
      type: "website",
      title: `${productData?.name} ${rating ? `(${rating.average}/5 ⭐)(${rating.count} avis)` : ""}`,
      description: description,
      images: productData?.images.map((image) => ({
        url: image,
        width: 1200,
        height: 630,
        alt: `${productData?.name} - ${productData?.reference} ${rating ? `- Note: ${rating.average}/5` : ""}`,
      })),
      url: productUrl,

      siteName: "ita-luxury",
    },
    twitter: {
      card: "summary_large_image",
      title: `${productData?.name} ${rating ? `(${rating.average}/5 ⭐)(${rating.count} avis)` : ""}`,
      description: description,
      images: productData?.images,
      creator: "@ita_luxury",
    },
    keywords: productKeywords.join(", "),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/product?productId=${searchParams.productId}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

const ProductDetailsPage = async ({
  searchParams,
}: {
  searchParams: { productId: string };
}) => {
  const productData = await fetchProductData(searchParams.productId);
  const rating = formatRating(productData.reviews);
  const productUrl = generateProductUrl(productData);

  return (




    <div className="bg-gray-50 p-6">
      <JsonLd<any>
        item={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: productData.name,
          description: productData.description.replace(/<[^>]*>/g, ""),
          image: productData.images,
          sku: productData.reference,
          brand: {
            "@type": "Brand",
            name: productData?.Brand?.name,
          },
          color: productData.Colors?.color,
          offers: {
            "@type": "Offer",
            priceCurrency: "TND",
            price: productData.price.toFixed(2),
            availability:
              productData.inventory > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            url: productUrl,
          },
          aggregateRating: rating && {
            "@type": "AggregateRating",
            ratingValue: rating.average,
            bestRating: rating.best,
            reviewCount: rating.count,
            worstRating: 0,
          },
          review: productData.reviews.map((review) => ({
            "@type": "Review",
            reviewRating: {
              "@type": "Rating",
              ratingValue: review.rating,
              bestRating: 5,
              worstRating: 0,
            },
          })),
          additionalProperty: productData.attributes.map((attr) => ({
            "@type": "PropertyValue",
            name: attr.name,
            value: attr.value,
          })),
        }}
      />
      <ProductDetails productDetails={productData} productId={searchParams.productId} />
      <ProductInfo />
    </div>

  );
};

export default ProductDetailsPage;
