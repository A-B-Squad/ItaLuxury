"use client";

import React, { useEffect, useState } from "react";
import { FAVORITE_PRODUCTS_QUERY } from "../../../graphql/queries";
import { useLazyQuery } from "@apollo/client";

import jwt, { JwtPayload } from "jsonwebtoken";
import Cookies from "js-cookie";

import Loading from "../loading";
import { ProductBox } from "../../components/ProductBox";

interface DecodedToken extends JwtPayload {
  userId: string;
}

const FavoriteList = () => {
  const [productsData, setProductsData] = useState([]);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);

  const [getFavoriteProducts, { loading, data }] = useLazyQuery(
    FAVORITE_PRODUCTS_QUERY
  );

  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }

    const fetchProducts = async () => {
      try {
        const { data } = await getFavoriteProducts({
          variables: {
            userId: "b4110f43-f83f-4b39-b2c0-dba5f2981c30",
          },
        });

        const fetchedProducts = data?.favoriteProducts;
        setProductsData(data?.favoriteProducts.map((fav: any) => fav.Product));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [data]);

  return (
    <div className="flex flex-col">
      {loading ? (
        <div className="flex items-center h-full justify-center">
          <Loading />
        </div>
      ) : (
        <>
          <div className=" w-full py-5 grid  px-10 justify-items-center items-center  h-[400px] transition-all relative pb-2    flex-col justify-between   border shadow-xl  gap-4 md:grid-cols-3 grid-cols-1 lg:grid-cols-5">
            {productsData.map((product: Product) => (
              <ProductBox product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FavoriteList;
