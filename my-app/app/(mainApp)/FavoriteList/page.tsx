"use client";

import React, { useEffect, useState } from "react";
import {
  BASKET_QUERY,
  FAVORITE_PRODUCTS_QUERY,
} from "../../../graphql/queries";
import { useLazyQuery, useMutation } from "@apollo/client";
import Link from "next/link";
import prepRoute from "../../components/_prepRoute";
import {
  useBasketStore,
  useComparedProductsStore,
  useProductsInBasketStore,
} from "../../store/zustand";
import { ADD_TO_BASKET_MUTATION } from "../../../graphql/mutations";
import jwt, { JwtPayload } from "jsonwebtoken";
import Cookies from "js-cookie";
import { GoGitCompare } from "react-icons/go";
import { FaHeart } from "react-icons/fa";
import { SlBasket } from "react-icons/sl";
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
        setProductsData(data?.favoriteProducts.map((fav:any)=> (fav.Product)));

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
          <div className=" w-full py-5 grid  px-10 justify-items-center items-center gap-4 md:grid-cols-3 grid-cols-1 lg:grid-cols-5">
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
