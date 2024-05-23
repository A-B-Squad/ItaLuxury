"use client";
import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { BASKET_QUERY } from "@/graphql/queries";
import { FaRegEye } from "react-icons/fa";
import { SlBasket } from "react-icons/sl";
import Link from "next/link";
import Cookies from "js-cookie";

import {
  useAllProductViewStore,
  useBasketStore,
  useComparedProductsStore,
  useDrawerBasketStore,
  useProductDetails,
  useProductsInBasketStore,
} from "../store/zustand";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ADD_TO_BASKET_MUTATION } from "@/graphql/mutations";
import FavoriteProduct from "./ProductCarousel/FavoriteProduct";
import { IoGitCompare } from "react-icons/io5";
import { FaBasketShopping } from "react-icons/fa6";
import Image from "next/legacy/image";
import { useToast } from "@/components/ui/use-toast";
import calcDateForNewProduct from "../Helpers/_calcDateForNewProduct";
import prepRoute from "../Helpers/_prepRoute";
interface DecodedToken extends JwtPayload {
  userId: string;
}
export const ProductBox = ({ product }: any) => {
  const { toast } = useToast();

  const { view } = useAllProductViewStore();
  const { openBasketDrawer } = useDrawerBasketStore();

  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);

  const [addToBasket] = useMutation(ADD_TO_BASKET_MUTATION);

  const toggleIsUpdated = useBasketStore((state) => state.toggleIsUpdated);
  const { openProductDetails } = useProductDetails();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const { addProductToCompare, productsInCompare } = useComparedProductsStore(
    (state) => ({
      addProductToCompare: state.addProductToCompare,
      productsInCompare: state.products,
    })
  );
  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
  }, []);
  const { addProductToBasket, products } = useProductsInBasketStore(
    (state) => ({
      addProductToBasket: state.addProductToBasket,
      products: state.products,
    })
  );

  const AddToBasket = (product: any) => {
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
          toast({
            title: "Notification de Panier",
            description: `Le produit "${product?.name}" a été ajouté au panier.`,
            className: "bg-strongBeige text-white",
          });
        },
      });
    } else {
      const isProductAlreadyInBasket = products.some(
        (p: any) => p.id === product?.id
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
        console.log("Product is already in the basket");
      }
    }
    toggleIsUpdated();
    openBasketDrawer();
  };

  const addToCompare = (product: any) => {
    const isProductAlreadyInCompare = productsInCompare.some(
      (p: any) => p.id === product.id
    );

    if (!isProductAlreadyInCompare) {
      addProductToCompare(product);
    } else {
      toast({
        title: "Produit ajouté à la comparaison",
        description: `Le produit "${product?.name}" a été ajouté à la comparaison.`,
        className: "bg-strongBeige text-white",
      });
    }
  };

  return (
    <>
      <ul
        className={`plus_button ${view == 1 ? "top-5 hidden md:flex" : "flex top-14"}   items-center lg:opacity-0 group-hover:opacity-100  absolute right-3 z-30  justify-between  flex-col gap-3  `}
      >
        <div
          className="product-details relative w-fit cursor-crosshair"
          title="aperçu rapide"
          onClick={() => openProductDetails(product)}
        >
          <li className="bg-strongBeige rounded-full delay-100 lg:translate-x-20 group-hover:translate-x-0 transition-all p-2 shadow-md hover:bg-mediumBeige ">
            <FaRegEye color="white" />
          </li>
        </div>

        <div
          className="add-to-basket relative w-fit h-fit cursor-crosshair"
          title="Ajouter au panier"
          onClick={() => AddToBasket(product)}
        >
          <li className="bg-strongBeige rounded-full delay-100 lg:translate-x-20 group-hover:translate-x-0 transition-all p-2 shadow-md hover:bg-mediumBeige ">
            <FaBasketShopping color="white" />
          </li>
        </div>

        <div
          className="Comparison relative w-fit cursor-crosshair"
          title="Ajouter au comparatif"
          onClick={() => addToCompare(product)}
        >
          <li className="bg-strongBeige rounded-full  delay-150 lg:translate-x-20 group-hover:translate-x-0 transition-all p-2 shadow-md hover:bg-mediumBeige ">
            <IoGitCompare color="white" />
          </li>
        </div>

        <div
          className="Favorite relative w-fit cursor-crosshair"
          title="Ajouter à ma liste d'enviess"
        >
          <li className="bg-strongBeige  rounded-full delay-200 lg:translate-x-20 group-hover:translate-x-0 transition-all p-2 shadow-md hover:bg-mediumBeige ">
            <FavoriteProduct
              isFavorite={isFavorite}
              setIsFavorite={setIsFavorite}
              productId={product?.id}
              userId={decodedToken?.userId}
              heartColor={""}
              heartSize={16}
              productName={product?.name}
            />
          </li>
        </div>
      </ul>
      <div
        className={`${view === 1 && "absolute top-0"}  flex justify-between w-full px-3 z-20 uppercase text-white text-[11px] translate-y-4 `}
      >
        {calcDateForNewProduct(product?.createdAt) && (
          <span className="bg-green-500 w-fit justify-start shadow-md p-1">
            Nouveau
          </span>
        )}
        {product?.productDiscounts?.length > 0 && (
          <span className="bg-red-500 w-fit shadow-md p-1">Promo</span>
        )}
      </div>
      <Link
        className="relative flex w-40 h-52 md:w-56 overflow-hidden"
        rel="preload"
        href={{
          pathname: `/products/tunisie/${prepRoute(product?.name)}`,
          query: {
            productId: product?.id,
            collection: [
              product?.categories[0]?.name,
              product?.categories[0]?.id,
              product?.categories[0]?.subcategories[0]?.name,
              product?.categories[1]?.subcategories[0]?.id,
              product?.categories[0]?.subcategories[0]?.subcategories[1]?.name,
              product?.categories[0]?.subcategories[0]?.subcategories[1]?.id,
              product?.name,
            ],
          },
        }}
      >
        <div className="images top-0 relative group h-40 w-40 md:h-full md:w-full">
          {product?.images.length > 1 ? (
            <>
              <Image
                src={product?.images[0]}
                className="absolute group-hover:opacity-0 z-10 opacity-100 transition-all top-0 right-0  h-full w-full object-cover"
                loading="eager"
                priority
                objectFit="contain"
                alt={`products-${product?.name}`}
                layout="fill"
              />
              <Image
                src={product?.images[1]}
                className="absolute group-hover:opacity-100 opacity-0 transition-all top-0 right-0 h-full w-full object-cover"
                loading="eager"
                priority
                objectFit="contain"
                alt={`products-${product?.name}`}
                layout="fill"
              />
            </>
          ) : (
            <Image
              src={product?.images[0]}
              className="  h-full w-full object-cover"
              loading="eager"
              priority
              alt={`products-${product?.name}`}
              layout="fill"
            />
          )}
        </div>
      </Link>

      <div
        className={`
 ${view !== 1 ? " border-t" : ""}
 mt-4 px-2 pb-5  w-full`}
      >
        <Link
          rel="preload"
          href={{
            pathname: `/products/tunisie/${prepRoute(product?.name)}`,
            query: {
              productId: product?.id,
              collection: [
                product?.categories[0]?.name,
                product?.categories[0]?.id,
                product?.categories[0]?.subcategories[0]?.name,
                product?.categories[0]?.subcategories[0]?.id,
                product?.categories[0]?.subcategories[0]?.subcategories[1]
                  ?.name,
                product?.categories[0]?.subcategories[0]?.subcategories[1]?.id,
                product?.name,
              ],
            },
          }}
        >
          <div className="product-name pt-1 tracking-wider hover:text-strongBeige transition-colors text-sm font-semibold line-clamp-2 ">
            <p className="category  font-normal -tracking-tighter  text-xs  capitalize">
              {product?.categories[2]?.name}
            </p>
            {product?.name}
          </div>
        </Link>

        {view !== 1 && (
          <>
            <div className="flex justify-between items-start py-3">
              <div>
                <p
                  className={`${
                    product?.productDiscounts.length > 0
                      ? "line-through font-semibold text-lg text-gray-700"
                      : "text-strongBeige text-xl py-1"
                  } font-semibold`}
                >
                  {product?.price.toFixed(3)} TND
                </p>
                {product?.productDiscounts.length > 0 && (
                  <div className="flex items-center">
                    <span className="text-gray-400 text-xs font-thin">
                      A partir de :
                    </span>
                    <span className="text-red-500 font-bold ml-1 text-xl">
                      {product?.productDiscounts[0]?.newPrice.toFixed(3)} TND
                    </span>
                  </div>
                )}
              </div>

              <div
                className={`Color relative  w-fit cursor-crosshair`}
                title={product?.Colors?.color}
              >
                {product?.Colors && (
                  <div
                    className="colors_available items-center   mt-1 w-5 h-5  border-black border-2 rounded-sm shadow-gray-400 shadow-sm"
                    style={{
                      backgroundColor: product?.Colors?.Hex,
                    }}
                  />
                )}
              </div>
            </div>

            <button
              className={`flex items-center gap-2 self-center py-2  m-auto w-36 text-xs justify-center bg-strongBeige px-2  text-md text-white transition hover:bg-mediumBeige`}
              onClick={() => AddToBasket(product)}
            >
              <SlBasket />
              Ajouter au panier
            </button>
          </>
        )}

        {view === 1 && (
          <div className="flex items-stretch   flex-col ">
            <div className="flex justify-between flex-col items-start ">
              <div className="flex md:gap-3 flex-col md:flex-row">
                {product?.productDiscounts.length > 0 && (
                  <div className="flex items-center ">
                    <span className="text-red-500 font-bold  text-base md:text-lg ">
                      {product?.productDiscounts[0]?.newPrice.toFixed(3)} TND
                    </span>
                  </div>
                )}
                <p
                  className={`${
                    product?.productDiscounts?.length > 0
                      ? "line-through text-base md:text-lg font-semibold text-gray-700"
                      : "text-strongBeige text-base md:text-lg py-1"
                  } font-semibold`}
                >
                  {product?.price.toFixed(3)} TND
                </p>
              </div>

              <div
                className={`Color relative  w-fit cursor-crosshair`}
                title={product?.Colors?.color}
              >
                {product?.Colors && (
                  <div
                    className="colors_available items-center   mt-1 w-5 h-5  border-black border-2 rounded-sm shadow-gray-400 shadow-sm"
                    style={{
                      backgroundColor: product?.Colors?.Hex,
                    }}
                  />
                )}
              </div>
              <p className="w-full text-xs md:text-sm pt-2 tracking-wider line-clamp-3">
                {product?.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
