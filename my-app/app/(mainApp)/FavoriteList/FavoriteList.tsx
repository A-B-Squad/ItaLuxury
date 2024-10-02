"use client";
import React, { useEffect, useState } from "react";
import { FAVORITE_PRODUCTS_QUERY } from "@/graphql/queries";
import { useLazyQuery, useMutation } from "@apollo/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import Cookies from "js-cookie";
import Loading from "../loading";
import { HiX } from "react-icons/hi";
import ProductBox from "../../components/ProductBox/ProductBox";
import { ADD_DELETE_PRODUCT_FAVORITE_MUTATION } from "@/graphql/mutations";

interface DecodedToken extends JwtPayload {
  userId: string;
}

const FavoriteList = () => {
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);

  const [getFavoriteProducts, { loading }] = useLazyQuery(
    FAVORITE_PRODUCTS_QUERY,
    {
      fetchPolicy: "no-cache",
    }
  );

  const [removeFromFavorites] = useMutation(
    ADD_DELETE_PRODUCT_FAVORITE_MUTATION
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
      fetchProducts();
    }
  }, [decodedToken]);

  const fetchProducts = async () => {
    try {
      const { data } = await getFavoriteProducts({
        variables: {
          userId: decodedToken?.userId,
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

  const handleRemoveFromFavorites = async (productId: string) => {
    try {
      console.log({
        product: productsData,
        userId: decodedToken?.userId,
        productId: productId,
      });

      await removeFromFavorites({
        variables: {
          input: {
            userId: decodedToken?.userId,
            productId: productId,
          },
        },
      });
      fetchProducts();
    } catch (error) {
      console.error("Error removing product from favorites:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {loading ? (
        <div className="flex items-center h-full justify-center">
          <Loading />
        </div>
      ) : (
        <>
          <div className="w-full py-5 grid px-10 justify-items-center items-center gap-2 relative md:grid-cols-2 lg:grid-cols-3 grid-cols-1 xl:grid-cols-4">
            {productsData?.map((product: Product) => (
              <div
                key={product.id}
                className="flex-col items-center justify-between h-[400px] group flex relative w-full overflow-hidden border border-gray-100 bg-white shadow-md"
              >
                <ProductBox product={product} />
                <button
                  onClick={() => handleRemoveFromFavorites(product.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                >
                  <HiX size={20} />
                </button>
              </div>
            ))}
          </div>
          {productsData.length === 0 && (
            <div className="h-screen flex justify-center item-start">
              <div className="border shadow-md bg-white p-3 w-4/5 py-5 text-center md:mt-36 h-36 md:h-fit flex items-center gap-3 justify-center">
                <HiX size={25} className="text-red-400" />
                <p className="font-normal tracking-wider">
                  Aucun produit n'est présent dans la liste des favoris.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FavoriteList;
