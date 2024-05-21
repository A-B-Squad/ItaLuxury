import React from "react";
import Home from "./Home";
import {
  ADVERTISSMENT_QUERY,
  SIDE_ADS_NEW_PRODUCT,
  TAKE_6_PRODUCTS,
  TAKE_6_PRODUCTS_IN_DISCOUNT,
  TAKE_6_PRODUCTS_PRICE_20,
} from "@/graphql/queries";

const page = async () => {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }
  const { data: leftAds } = await fetch(process.env.NEXT_PUBLIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query Query($position: String!) {
          advertismentByPosition(position: $position) {
            images
            link
          }
        }
  `,
      variables: {
        position: "left_new_product",
      },
    }),
  }).then((res) => res.json());
  const { data: rightAds } = await fetch(process.env.NEXT_PUBLIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
      ${SIDE_ADS_NEW_PRODUCT}
  `,
      variables: {
        position: "rigth_new_product",
      },
    }),
  }).then((res) => res.json());
  const { data: FullAdsPromotion } = await fetch(
    process.env.NEXT_PUBLIC_API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
      ${ADVERTISSMENT_QUERY}
  `,
        variables: {
          position: "full_promotion",
        },
      }),
    }
  ).then((res) => res.json());
  const { data: leftCarouselAds } = await fetch(
    process.env.NEXT_PUBLIC_API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
      ${ADVERTISSMENT_QUERY}
  `,
        variables: {
          position: "left",
        },
      }),
    }
  ).then((res) => res.json());
  const { data: rightCarouselAds } = await fetch(
    process.env.NEXT_PUBLIC_API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
      ${ADVERTISSMENT_QUERY}
  `,
        variables: {
          position: "right",
        },
      }),
    }
  ).then((res) => res.json());
  const { data: centerCarouselAds } = await fetch(
    process.env.NEXT_PUBLIC_API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
      ${ADVERTISSMENT_QUERY}
  `,
        variables: {
          position: "slider",
        },
      }),
    }
  ).then((res) => res.json());
  const { data: FullAds20Product } = await fetch(
    process.env.NEXT_PUBLIC_API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
      ${ADVERTISSMENT_QUERY}
  `,
        variables: {
          position: "full_ads_20",
        },
      }),
    }
  ).then((res) => res.json());
  const { data: FullAdsTopDeals } = await fetch(
    process.env.NEXT_PUBLIC_API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
      ${ADVERTISSMENT_QUERY}
  `,
        variables: {
          position: "full_ads_topDeals",
        },
      }),
    }
  ).then((res) => res.json());
  const { data: Product_less_20 } = await fetch(
    process.env.NEXT_PUBLIC_API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
     ${TAKE_6_PRODUCTS_PRICE_20}
  `,
        variables: {
          limit: 6,
        },
      }),
    }
  ).then((res) => res.json());
  const { data: Products_inDiscount_6 } = await fetch(
    process.env.NEXT_PUBLIC_API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
     ${TAKE_6_PRODUCTS_IN_DISCOUNT}
  `,
        variables: {
          limit:10,
        },
      }),
    }
  ).then((res) => res.json());

  const { data: Products_6 } = await fetch(process.env.NEXT_PUBLIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
     ${TAKE_6_PRODUCTS}
  `,
      variables: {
        limit: 6,
      },
    }),
  }).then((res) => res.json());


  return (
    <Home
      leftAds={leftAds}
      Product_less_20={Product_less_20}
      Products_6={Products_6}
      Products_inDiscount_6={Products_inDiscount_6}
      rightAds={rightAds}
      FullAdsTopDeals={FullAdsTopDeals}
      FullAds20Product={FullAds20Product}
      FullAdsPromotion={FullAdsPromotion}
      leftCarouselAds={leftCarouselAds}
      rightCarouselAds={rightCarouselAds}
      centerCarouselAds={centerCarouselAds}
    />
  );
};
export default page;
