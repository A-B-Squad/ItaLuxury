"use client";
import React, { useEffect, useState, useCallback } from "react";
import { FAVORITE_PRODUCTS_QUERY } from "@/graphql/queries";
import { useLazyQuery, useMutation } from "@apollo/client";

import Loading from "../loading";
import { HiX } from "react-icons/hi";
import { FaHeart } from "react-icons/fa";
import ProductBox from "../../components/ProductBox/ProductBox";
import { ADD_DELETE_PRODUCT_FAVORITE_MUTATION } from "@/graphql/mutations";
import { useAuth } from "@/app/hooks/useAuth";

const FavoriteList = ({ userData }: any) => {
  const [productsData, setProductsData] = useState<Product[]>([]);
  const { decodedToken, isAuthenticated } = useAuth();

  const [getFavoriteProducts, { loading }] = useLazyQuery(
    FAVORITE_PRODUCTS_QUERY,
  );

  const [removeFromFavorites, { loading: removingProduct }] = useMutation(
    ADD_DELETE_PRODUCT_FAVORITE_MUTATION,
  );

  // Memoize fetchProducts to prevent unnecessary re-renders
  const fetchProducts = useCallback(async () => {
    if (!decodedToken?.userId) return;

    try {
      const { data } = await getFavoriteProducts({
        variables: {
          userId: decodedToken?.userId,
        },
      });

      if (data) {
        const fetchedProducts = data.favoriteProducts.map(
          (fav: any) => fav.Product,
        );
        setProductsData(fetchedProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [decodedToken?.userId, getFavoriteProducts]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated, fetchProducts]);

  const handleRemoveFromFavorites = async (productId: string) => {
    try {
      await removeFromFavorites({
        variables: {
          input: {
            userId: decodedToken?.userId,
            productId: productId,
          },
        },
        onCompleted: () => {
          // Optimistically update UI by filtering out the removed product
          setProductsData(prev => prev.filter(product => product.id !== productId));
        }
      });
    } catch (error) {
      console.error("Error removing product from favorites:", error);
      // Refetch in case of error to ensure UI is in sync
      fetchProducts();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center py-10 px-4">
        <div className="border shadow-md p-8 w-full h-fit md:w-4/5 bg-white text-center rounded-lg">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <FaHeart className="text-gray-400" size={30} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Connexion requise</h2>
            <p className="font-normal tracking-wider text-gray-600 max-w-lg">
              Vous n'êtes pas connecté. Veuillez vous connecter pour accéder à votre liste de favoris.
            </p>
            <a
              href="/signin"
              className="mt-2 px-6 py-2 bg-primaryColor text-white rounded-md hover:bg-opacity-90 transition-all"
            >
              Se connecter
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Mes Produits Favoris</h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loading />
          </div>
        ) : (
          <>
            {productsData.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {productsData.map((product: Product) => (
                  <div
                    key={product.id}
                    className="relative group bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all hover:shadow-lg"
                  >
                    <ProductBox userData={userData} product={product} />
                    <button
                      onClick={() => handleRemoveFromFavorites(product.id)}
                      disabled={removingProduct}
                      className="absolute top-3 right-3 bg-white text-red-500 p-2 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors duration-200 z-10"
                      aria-label="Retirer des favoris"
                    >
                      <HiX size={18} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center py-16">
                <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                      <FaHeart className="text-gray-300" size={30} />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Liste de favoris vide</h2>
                    <p className="text-gray-600">
                      Vous n'avez pas encore ajouté de produits à vos favoris.
                    </p>
                    <a
                      href="/Collections/tunisie?page=1"
                      className="mt-2 px-6 py-2 bg-primaryColor text-white rounded-md hover:bg-opacity-90 transition-all"
                    >
                      Découvrir nos produits
                    </a>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FavoriteList;
