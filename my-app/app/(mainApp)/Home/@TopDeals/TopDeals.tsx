"use client";
import { BASKET_QUERY, FETCH_USER_BY_ID, TOP_DEALS } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import Cookies from "js-cookie";

import jwt, { JwtPayload } from "jsonwebtoken";
import React, { useEffect, useMemo, useState } from "react";
import ProductDetails from "./ProductDetails";
interface DecodedToken extends JwtPayload {
  userId: string;
}
const TopDeals = () => {
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);



  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
  }, []);
  const { data: basketData } = useQuery(BASKET_QUERY, {
    variables: { userId: decodedToken?.userId },
    skip: !decodedToken?.userId,
  });
  const { data: userData } = useQuery(FETCH_USER_BY_ID, {
    variables: {
      userId: decodedToken?.userId,
    },
    skip: !decodedToken?.userId,
  });

  const { data: topDeals } = useQuery(TOP_DEALS);

  const renderProducts = useMemo(() => {
    if (!topDeals?.allDeals) return null;
    return (
      <>
        {topDeals.allDeals.map((product: any) => (
          <ProductDetails
            key={product.id}
            product={product}
            basketData={basketData}
            decodedToken={decodedToken}
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
