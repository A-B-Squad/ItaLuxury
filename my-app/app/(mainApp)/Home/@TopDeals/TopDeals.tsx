"use client";
import { BASKET_QUERY, FETCH_USER_BY_ID, TOP_DEALS } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import React, { useEffect, useMemo, useState } from "react";
import ProductDetails from "./ProductDetails";
import { useAuth } from "@/lib/auth/useAuth";

const TopDeals = () => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const { decodedToken, isAuthenticated } = useAuth();


  const { data: basketData } = useQuery(BASKET_QUERY, {
    variables: { userId: decodedToken?.userId },
    skip: !isAuthenticated,
  });

  const { data: userData } = useQuery(FETCH_USER_BY_ID, {
    variables: {
      userId: decodedToken?.userId,
    },
    skip: !isAuthenticated
  });

  const { data: topDeals } = useQuery(TOP_DEALS);

  const renderProducts = useMemo(() => {
    if (!topDeals?.allDeals) return null;
    return (
      <>
        {topDeals.allDeals?.map((product: any) => (
          <ProductDetails
            key={product.id}
            product={product.product}
            basketData={basketData}
            setIsFavorite={setIsFavorite}
            isFavorite={isFavorite}
            userData={userData}
          />
        ))}
      </>
    );
  }, [topDeals, basketData, decodedToken, setIsFavorite, isFavorite, userData]);

  return (
    <div className="md:grid grid-cols-2 gap-3 grid-flow-col min-h-72 bg-white border py-2 overflow-hidden block">
      {renderProducts}
    </div>
  );
};

export default React.memo(TopDeals);
