import React from "react";
import ProductDetails from "./ProductDetails";
import ProductInfo from "@/app/components/ProductInfo/ProductInfo";
import keywords from '@/public/keywords';
export async function generateMetadata({ searchParams }: any) {
  if (!process.env.NEXT_PUBLIC_API_URL || !process.env.BASE_URL_DOMAIN) {
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
          name        
          description
          images
        }
      }
  `,
      variables: {
        productByIdId: searchParams.productId,
      },
    }),
  }).then((res) => res.json());
  const productData = data?.productById;

  return {
    metadataBase: new URL(process.env.BASE_URL_DOMAIN),
    title: `${productData?.name} - MaisonNg`,
    description: productData?.description,
    openGraph: {
      type: "article",
      images: [
        {
          url: productData?.images[0],
          width: 800,
          height: 600,
          alt: productData?.name,
        },
      ],
    },
    keywords: keywords,
    icons: {
      icon: "../../public/images/logo.jpeg",
      appleTouchIcon: "/images/logo.jpeg",
      favicon: "../../public/images/favicon.ico",
    },
  };
}

const ProductDetailsPage = async ({ searchParams }: any) => {
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
        productByIdId: searchParams.productId,
      },
    }),
  }).then((res) => res.json());
  return (
    <div className="bg-gray-50 p-6">
      <ProductDetails
        productDetails={data?.productById}
        productId={searchParams.productId}
      />
      <ProductInfo />
    </div>
  );
};

export default ProductDetailsPage;
