import React from "react";
import ProductDetails from "./ProductDetails";

export async function generateMetadata({ searchParams }: any) {
  const { data } = await fetch("http://localhost:3000/api/graphql", {
    method: "POST",
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
    next: { revalidate: 10 },
  }).then((res) => res.json());
  const productData = data.productById;

  return {
    title: `${productData.name} - MaisonNg`,
    description: productData.description,
    openGraph: {
      type: "article",
      images: [
        {
          url: productData.images[0],
          width: 800,
          height: 600,
          alt: productData.name,
        },
      ],
    },
  };
}

const page = async ({ searchParams }: any) => {
  const { data } = await fetch("http://localhost:3000/api/graphql", {
    method: "POST",
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
    next: { revalidate: 10 },
  }).then((res) => res.json());
  return (
    <ProductDetails
      productDetails={data.productById}
      productId={searchParams.productId}
    />
  );
};

export default page;
