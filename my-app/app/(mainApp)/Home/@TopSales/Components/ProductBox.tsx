"use client";
import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { BASKET_QUERY, FETCH_USER_BY_ID } from "@/graphql/queries";
import Image from "next/legacy/image";
import Link from "next/link";
import prepRoute from "@/app/Helpers/_prepRoute";
import { FaBasketShopping } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
import {
  useBasketStore,
  useDrawerBasketStore,
  useProductDetails,
  useProductsInBasketStore,
} from "@/app/store/zustand";
import { ADD_TO_BASKET_MUTATION } from "@/graphql/mutations";
import FavoriteProduct from "@/app/components/ProductCarousel/FavoriteProduct";
import { useToast } from "@/components/ui/use-toast";

import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import triggerEvents from "@/utlils/trackEvents";
import { pushToDataLayer } from "@/utlils/pushToDataLayer";

const ProductBox = ({ product }: any) => {
  const { toast } = useToast();
  interface DecodedToken extends JwtPayload {
    userId: string;
  }

  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);

  const [addToBasket] = useMutation(ADD_TO_BASKET_MUTATION);

  const toggleIsUpdated = useBasketStore((state) => state.toggleIsUpdated);
  const { openProductDetails } = useProductDetails();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const { data: userData } = useQuery(FETCH_USER_BY_ID, {
    variables: {
      userId: decodedToken?.userId,
    },
    skip: !decodedToken?.userId,
  });
  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
  }, []);

  const { addProductToBasket, products, increaseProductInQtBasket } =
    useProductsInBasketStore((state) => ({
      increaseProductInQtBasket: state.increaseProductInQtBasket,
      addProductToBasket: state.addProductToBasket,
      products: state.products,
    }));

  const AddToBasket = async (product: any) => {
    if (decodedToken) {
      addToBasket({
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
        onCompleted: () => {
          // Track Add to Cart
          triggerEvents("AddToCart", {
            user_data: {
              em: [userData?.fetchUsersById.email.toLowerCase()],
              fn: [userData?.fetchUsersById.fullName],
              ph: [userData?.fetchUsersById?.number],
              country: ["tn"],
              external_id: userData?.fetchUsersById.email.id,
            },
            custom_data: {
              content_name: product.name,
              content_type: "product",
              content_ids: [product.id],
              contents: {
                id: product.id,
                quantity: product.actualQuantity || product.quantity,
              },
              value:
                product.productDiscounts.length > 0
                  ? product.productDiscounts[0].newPrice
                  : product.price,
              currency: "TND",
            },
          });
          pushToDataLayer("AddToCart");
        },
      });
    } else {
      const isProductAlreadyInBasket = products.some(
        (p: any) => p.id === product?.id,
      );
      if (!isProductAlreadyInBasket) {
        addProductToBasket({
          ...product,
          price:
            product.productDiscounts.length > 0
              ? product?.productDiscounts[0]?.newPrice
              : product?.price,
          actualQuantity: 1,
        });
      } else {
        increaseProductInQtBasket(product.id, 1);
      }

      // Track Add to Cart
      triggerEvents("AddToCart", {
        user_data: {
          em: [userData?.fetchUsersById.email.toLowerCase()],
          fn: [userData?.fetchUsersById.fullName],
          ph: [userData?.fetchUsersById?.number],
          country: ["tn"],
          external_id: userData?.fetchUsersById.email.id,
        },
        custom_data: {
          content_name: product.name,
          content_type: "product",
          content_ids: [product.id],
          contents: {
            id: product.id,
            quantity: product.actualQuantity || product.quantity,
          },
          value:
            product.productDiscounts.length > 0
              ? product.productDiscounts[0].newPrice
              : product.price,
          currency: "TND",
        },
      });
      pushToDataLayer("AddToCart");
    }
    toggleIsUpdated();
  };
  const categoryNames = product.categories
    .map((cat: { name: string; }) => cat.name)
  const queryParams = new URLSearchParams({
    productId: product.id,
    categories: [categoryNames, product?.name].join(',')
  });
  return (
    <div className="flex font-medium text-gray-900 w-full relative">
      <div className="w-full flex gap-5 items-center">
        <div className="relative h-20 w-20">
          <span className="z-50 flex flex-col gap-1 items-center justify-center group-hover:bg-[#000000ba] transition-all absolute h-full w-full top-0 left-0">
            <button
              type="button"
              className={`${product.inventory <= 0 ? "cursor-not-allowed" : "cursor-pointer"} hover:opacity-70 p-2 group-hover:opacity-100 opacity-0 hover:bg-primaryColor bg-white text-black hover:text-white rounded-full transition-all`}
              disabled={product.inventory <= 0}
              title="Ajouter au panier"
              onClick={() => {
                AddToBasket(product);
                toast({
                  title: "Notification de Panier",
                  description: `Le produit "${product?.name}" a été ajouté au panier.`,
                  className: "bg-primaryColor text-white",
                });
              }}
            >
              <FaBasketShopping size={18} />
            </button>
            <div
              className="cursor-pointer hover:opacity-70 p-2 group-hover:opacity-100 opacity-0 hover:bg-primaryColor bg-white text-black hover:text-white rounded-full transition-all"
              title="aperçu rapide"
              onClick={() => openProductDetails(product)}
            >
              <FaRegEye size={18} />
            </div>
          </span>
          <Image
            src={product.images[0]}
            alt="product"
            layout="fill"
            objectFit="contain"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Link
            className="hover:text-primaryColor text-base font-light transition-all  cursor-pointer tracking-wider"
            title={product.name}
            href={`/products/tunisie/${prepRoute(product?.name)}/?${queryParams}`}
          >
            <p className="text-left">{product.name}</p>
          </Link>

          {product.productDiscounts.length === 0 ? (
            <div className="flex gap-2 font-bold text-lg tracking-wider text-primaryColor">
              <span>{product?.price.toFixed(3)} DT</span>
            </div>
          ) : (
            <div className="flex gap-2 tracking-wider items-center">
              <span className="text-primaryColor font-bold text-lg">
                {product.productDiscounts[0]?.newPrice.toFixed(3)} DT
              </span>
              <span className="line-through text-gray-700 text-base font-semibold">
                {product.productDiscounts[0]?.price.toFixed(3)} DT
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="relative right-4 top-4 hover:text-black transition-colors">
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
};

export default ProductBox;
