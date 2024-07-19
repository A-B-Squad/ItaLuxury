import React from "react";
import { Metadata } from "next";
import ProductDetails from "./ProductDetails";
import ProductInfo from "@/app/components/ProductInfo/ProductInfo";
import keywords from "@/public/keywords";
import { JsonLd } from "react-schemaorg";

async function fetchProductData(productId: string) {
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
  if (!process.env.BASE_URL_DOMAIN) {
    throw new Error("BASE_URL_DOMAIN is not defined");
  }

  const productData = await fetchProductData(searchParams.productId);

  return {
    metadataBase: new URL(process.env.BASE_URL_DOMAIN),
    title: `${productData?.name} - MaisonNg`,
    description: productData?.description,
    openGraph: {
      title: `${productData?.name} - MaisonNg`,
      description: productData?.description,
      images: [
        {
          url: productData?.images[0] || "../../../../public/images/logo.jpeg",
          width: 800,
          height: 600,
          alt: productData?.name,
        },
      ],
      url: `${process.env.BASE_URL_DOMAIN}/product?productId=${searchParams.productId}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${productData?.name} - MaisonNg`,
      description: productData?.description,
      images: [productData?.images[0] || "../../../../public/images/logo.jpeg"],
    },
    keywords: [...keywords, productData?.name, productData?.reference].join(
      ", ",
    ),
    alternates: {
      canonical: `${process.env.BASE_URL_DOMAIN}/product?productId=${searchParams.productId}`,
    },
  };
}

const ProductDetailsPage = async ({
  searchParams,
}: {
  searchParams: { productId: string };
}) => {
  const productData = await fetchProductData(searchParams.productId);

  return (
    <div className="bg-gray-50 p-6">
      <JsonLd<any>
        item={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: productData.name,
          description: productData.description,
          image: productData.images[0],
          sku: productData.reference,
          offers: {
            "@type": "Offer",
            priceCurrency: "TND",
            price: productData.price,
            availability:
              productData.inventory > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
          },
        }}
      />
      <ProductDetails
        productDetails={productData}
        productId={searchParams.productId}
      />
      <ProductInfo />
    </div>
  );
};

export default ProductDetailsPage;
