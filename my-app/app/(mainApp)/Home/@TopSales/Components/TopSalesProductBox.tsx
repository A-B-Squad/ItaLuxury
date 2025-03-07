"use client";
import React, { useState, useCallback, memo } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { BASKET_QUERY, FETCH_USER_BY_ID } from "@/graphql/queries";
import Image from "next/legacy/image";
import Link from "next/link";
import { FaBasketShopping } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
import {
  useBasketStore,
  useProductDetails,
  useProductsInBasketStore,
} from "@/app/store/zustand";
import { ADD_TO_BASKET_MUTATION } from "@/graphql/mutations";
import FavoriteProduct from "@/app/components/ProductCarousel/FavoriteProduct";
import { useToast } from "@/components/ui/use-toast";
import triggerEvents from "@/utlils/trackEvents";
import { sendGTMEvent } from "@next/third-parties/google";
import { useAuth } from "@/lib/auth/useAuth";

const TopSalesProductBox = memo(({ product }: any) => {
  const { toast } = useToast();
  const { decodedToken, isAuthenticated } = useAuth();
  const [addToBasket] = useMutation(ADD_TO_BASKET_MUTATION);
  const toggleIsUpdated = useBasketStore((state) => state.toggleIsUpdated);
  const { openProductDetails } = useProductDetails();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  
  const { data: userData } = useQuery(FETCH_USER_BY_ID, {
    variables: {
      userId: decodedToken?.userId,
    },
    skip: !isAuthenticated,
  });

  const {
    products,
    addProductToBasket,
    increaseProductInQtBasket,
  } = useProductsInBasketStore();

  // Calculate price once to avoid recalculations
  const price = product.productDiscounts.length > 0
    ? product.productDiscounts[0].newPrice
    : product.price;
  
  const formattedPrice = price.toFixed(3);
  const isDiscounted = product.productDiscounts.length > 0;
  const originalPrice = isDiscounted ? product.productDiscounts[0].price.toFixed(3) : null;
  const isOutOfStock = product.inventory <= 0;

  const AddToBasket = useCallback(async () => {
    // Analytics data
    const analyticsData = {
      user_data: {
        em: [userData?.fetchUsersById?.email?.toLowerCase()],
        fn: [userData?.fetchUsersById?.fullName],
        ph: [userData?.fetchUsersById?.number],
        country: ["tn"],
        external_id: userData?.fetchUsersById?.id,
      },
      custom_data: {
        content_name: product.name,
        content_type: "product",
        content_ids: [product.id],
        contents: [{
          id: product.id,
          quantity: 1,
          item_price: price
        }],
        value: price,
        currency: "TND",
      },
    };

    // Track events
    triggerEvents("AddToCart", analyticsData);
    sendGTMEvent({
      event: "add_to_cart",
      ecommerce: {
        currency: "TND",
        value: price,
        items: [{
          item_id: product.id,
          item_name: product.name,
          quantity: 1,
          price: price
        }]
      },
      user_data: analyticsData.user_data,
      facebook_data: {
        ...analyticsData.custom_data,
        value: price,
      }
    });

    // Add to basket based on authentication status
    if (isAuthenticated) {
      try {
        await addToBasket({
          variables: {
            input: {
              userId: decodedToken?.userId,
              quantity: 1,
              productId: product.id,
            },
          },
          refetchQueries: [
            {
              query: BASKET_QUERY,
              variables: { userId: decodedToken?.userId },
            },
          ],
        });
      } catch (error) {
        console.error("Error adding to basket:", error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter le produit au panier",
          className: "bg-red-600 text-white",
        });
        return;
      }
    } else {
      const isProductAlreadyInBasket = products.some(p => p.id === product.id);
      
      if (isProductAlreadyInBasket) {
        increaseProductInQtBasket(product.id, 1);
      } else {
        addProductToBasket({
          ...product,
          price,
          actualQuantity: 1,
        });
      }
    }
    
    // Update basket state and show notification
    toggleIsUpdated();
    toast({
      title: "Notification de Panier",
      description: `Le produit "${product?.name}" a été ajouté au panier.`,
      className: "bg-primaryColor text-white",
    });
  }, [product, price, isAuthenticated, decodedToken, userData]);

  return (
    <div className="flex font-medium text-gray-900 w-full relative group">
      <div className="w-full flex gap-5 items-center">
        <div className="relative h-28 w-28 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 z-10 flex flex-col gap-1 items-center justify-center">
            <button
              type="button"
              className={`transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 ${
                isOutOfStock ? "cursor-not-allowed bg-gray-300" : "cursor-pointer hover:bg-primaryColor bg-white hover:text-white"
              } text-black rounded-full`}
              disabled={isOutOfStock}
              title={isOutOfStock ? "Rupture de stock" : "Ajouter au panier"}
              onClick={AddToBasket}
              aria-label="Ajouter au panier"
            >
              <FaBasketShopping size={18} />
            </button>
            <button
              className="transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 p-2 hover:bg-primaryColor bg-white text-black hover:text-white rounded-full"
              title="Aperçu rapide"
              onClick={() => openProductDetails(product)}
              aria-label="Aperçu rapide"
            >
              <FaRegEye size={18} />
            </button>
          </div>
          <Image
            src={product.images[0]}
            alt={product.name}
            layout="fill"
            objectFit="contain"
            className="transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {isOutOfStock && (
            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 z-20">
              Rupture
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          
          <Link
            className="hover:text-primaryColor text-base font-light transition-all cursor-pointer tracking-wider"
            title={product.name}
            href={`/products/tunisie?productId=${product.id}`}
          >
            <p className="text-left line-clamp-2 leading-tight">{product.name}</p>
          </Link>

          {!isDiscounted ? (
            <div className="flex gap-2 font-bold text-lg tracking-wider text-primaryColor">
              <span>{formattedPrice} DT</span>
            </div>
          ) : (
            <div className="flex gap-2 tracking-wider items-center">
              <span className="text-primaryColor font-bold text-lg">
                {formattedPrice} DT
              </span>
              <span className="line-through text-gray-700 text-base font-semibold">
                {originalPrice} DT
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="absolute right-4 top-4 hover:text-black transition-colors">
        <FavoriteProduct
          isFavorite={isFavorite}
          setIsFavorite={setIsFavorite}
          heartSize={20}
          heartColor={"gray"}
          productId={product?.id}
          userId={decodedToken?.userId}
          productName={product?.name}
        />
      </div>
    </div>
  );
});

export default TopSalesProductBox;
