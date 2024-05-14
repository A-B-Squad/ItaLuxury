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
    FAVORITE_PRODUCTS_QUERY,
    {
      fetchPolicy: "no-cache",
    }
  );

  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
  }, []);

  useEffect(() => {
    if (decodedToken?.userId) {
      const fetchProducts = async () => {
        try {
          const { data } = await getFavoriteProducts({
            variables: {
              userId: decodedToken.userId,
            },
          });

          if (data) {
            const fetchedProducts = data.favoriteProducts.map(
              (fav: any) => fav.Product
            );
            setProductsData(fetchedProducts);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };

      fetchProducts();
    }
  }, [decodedToken, getFavoriteProducts]);
  return (
    <div className="flex min-h-screen flex-col">
      {loading ? (
        <div className="flex items-center h-full justify-center">
          <Loading />
        </div>
      ) : (
        <>
          <div
            className={`w-full py-5 grid  px-10 justify-items-center items-center gap-2 relative md:grid-cols-2 lg:grid-cols-3 grid-cols-1 xl:grid-cols-4 `}
          >
            {productsData?.map((product: Product) => (
              <div
                className="flex-col items-center justify-between h-[400px] group flex relative w-full overflow-hidden border border-gray-100 bg-white shadow-md
              "
              >
                <ProductBox product={product} />
              </div>
            ))}

          
          </div>
          {productsData.length === 0 && (
              <p className="text-red-600 flex items-center justify-center w-full self-center h-screen px-2 text-center tracking-widest">Aucun produit n'est présent dans la liste des favoris.</p>
            )}
        </>
      )}
    </div>
  );
};

export default FavoriteList;
