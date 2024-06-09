"use client";
import prepRoute from "@/app/Helpers/_prepRoute";
import FavoriteProduct from "@/app/components/ProductCarousel/FavoriteProduct";
import {
  useBasketStore,
  useComparedProductsStore,
  useDrawerBasketStore,
  useProductDetails,
  useProductsInBasketStore,
} from "@/app/store/zustand";
import { useToast } from "@/components/ui/use-toast";
import { ADD_TO_BASKET_MUTATION } from "@/graphql/mutations";
import { BASKET_QUERY, TOP_DEALS } from "@/graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import Image from "next/legacy/image";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaBasketShopping } from "react-icons/fa6";
import { IoGitCompare } from "react-icons/io5";
interface DecodedToken extends JwtPayload {
  userId: string;
}
const TopDeals = () => {
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const { toast } = useToast();

  const { addProductToBasket, products } = useProductsInBasketStore(
    (state) => ({
      addProductToBasket: state.addProductToBasket,
      products: state.products,
    })
  );

  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
  }, []);

  const [addToBasket] = useMutation(ADD_TO_BASKET_MUTATION);

  const { toggleIsUpdated } = useBasketStore((state) => ({
    isUpdated: state.isUpdated,
    toggleIsUpdated: state.toggleIsUpdated,
  }));

  const { loading: loadingNewDeals, data: topDeals } = useQuery(TOP_DEALS);

  const { openBasketDrawer } = useDrawerBasketStore();
  const { openProductDetails } = useProductDetails();

  const AddToBasket = useCallback(
    (product: any) => {
      if (decodedToken) {
        addToBasket({
          variables: {
            input: {
              userId: decodedToken.userId,
              quantity: 1,
              productId: product.id,
            },
          },
          refetchQueries: [
            { query: BASKET_QUERY, variables: { userId: decodedToken.userId } },
          ],
        });
      } else {
        const isProductAlreadyInBasket = products.some(
          (p: any) => p.id === product.id
        );
        if (!isProductAlreadyInBasket) {
          addProductToBasket({
            ...product,
            price:
              product.productDiscounts.length > 0
                ? product.productDiscounts[0].newPrice
                : product.price,
            actualQuantity: 1,
          });
        } else {
          console.log("Product is already in the basket");
        }
      }
      toggleIsUpdated();
      openBasketDrawer();
    },
    [
      decodedToken,
      products,
      addProductToBasket,
      addToBasket,
      toggleIsUpdated,
      openBasketDrawer,
    ]
  );

  const addProductToCompare = useComparedProductsStore(
    (state) => state.addProductToCompare
  );

  const addToCompare = useCallback(
    (product: any) => {
      addProductToCompare(product);
      toast({
        title: "Produit ajouté à la comparaison",
        description: `Le produit "${product.name}" a été ajouté à la comparaison.`,
        className: "bg-strongBeige text-white",
      });
    },
    [addProductToCompare, toast]
  );

  const renderProducts = useMemo(() => {
    if (!topDeals?.allDeals) return null;
    return (
      <>
        {topDeals?.allDeals.map((products: any, index: number) => {
          return (
            <div
              key={products?.product?.id}
              className="grid lg:grid-cols-3 border group grid-cols-1 rounded-lg p-2 h-4/5 md:h-full  lg:h-80 min-h-80 w-full lg:w-11/12 grid-flow-col grid-rows-2 lg:grid-rows-1 lg:grid-flow-row  place-self-center  items-center gap-5 shadow-lg relative"
            >
              <Link
                rel="preload"
                href={{
                  pathname: `products/tunisie/${prepRoute(products?.product?.name)}`,
                  query: {
                    productId: products?.product?.id,
                    collection: [
                      products?.product?.categories[0]?.name,
                      products?.product?.categories[0]?.id,
                      products?.product?.name,
                    ],
                  },
                }}
                className="h-56 lg:h-full  w-full"
              >
                <span className="absolute left-5 top-5 z-20 text-white bg-green-600 px-4 font-semibold text-sm py-1 rounded-md">
                  {products?.product?.productDiscounts[0]?.Discount?.percentage}
                  %
                </span>

                <div className="relative lg:col-span-1 row-span-1 lg:row-span-1 h-56 lg:h-full  w-full">
                  <Image
                    layout="fill"
                    objectFit="contain"
                    className="h-full w-full"
                    src={products?.product?.images[0]}
                    alt="product"
                  />
                </div>
              </Link>
              <ul className="plus_button lg:opacity-0 group-hover:opacity-100  absolute right-3 z-40  top-14 flex flex-col gap-3  ">
                <div
                  className="product-details relative w-fit cursor-crosshair"
                  title="aperçu rapide"
                  onClick={() => openProductDetails(products?.product)}
                >
                  <li className="bg-strongBeige rounded-full  lg:translate-x-20 group-hover:translate-x-0   p-2 shadow-md hover:bg-mediumBeige transition-all">
                    <FaRegEye color="white" />
                  </li>
                </div>

                <div
                  className="add-to-basket relative w-fit h-fit cursor-crosshair"
                  title="Ajouter au panier"
                  onClick={() => {
                    AddToBasket(products?.product);

                    toast({
                      title: "Notification de Panier",
                      description: `Le produit "${products?.product?.name}" a été ajouté au panier.`,
                      className: "bg-strongBeige text-white",
                    });
                  }}
                >
                  <li className="bg-strongBeige rounded-full delay-100 lg:translate-x-20 group-hover:translate-x-0 transition-all p-2 shadow-md hover:bg-mediumBeige ">
                    <FaBasketShopping color="white" />
                  </li>
                </div>

                <div
                  className="Comparison relative w-fit cursor-crosshair"
                  title="Ajouter au comparatif"
                  onClick={() => {
                    addToCompare(products?.product);
                    toast({
                      title: "Produit ajouté à la comparaison",
                      description: `Le produit "${products?.product?.name}" a été ajouté à la comparaison.`,
                      className: "bg-strongBeige text-white",
                    });
                  }}
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
                      heartSize={16}
                      heartColor={""}
                      productId={products?.product?.id}
                      userId={decodedToken?.userId}
                      productName={products?.product?.name}
                    />
                  </li>
                </div>
              </ul>
              <div className="lg:col-span-2 row-span-1 lg:row-span-1  place-self-stretch lg:mt-3 flex flex-col justify-around ">
                <Link
                  href={{
                    pathname: `products/tunisie/${prepRoute(products?.product?.name)}`,
                    query: {
                      productId: products?.product?.id,
                      collection: [
                        products?.product?.categories[0]?.name,
                        products?.product?.categories[0]?.id,
                        products?.product?.name,
                      ],
                    },
                  }}
                >
                  <h2 className="tracking-wider hover:text-mediumBeige transition-colors">
                    {products?.product?.name}
                  </h2>
                  <div className="prices flex gap-3 items-center lg:mt-3">
                    <span className="text-strongBeige font-bold text-xl">
                      {products?.product?.productDiscounts[0]?.newPrice.toFixed(
                        3
                      )}
                      TND
                    </span>
                    <span className="line-through text-gray-700 font-semibold text-lg">
                      {products?.product?.price.toFixed(3)}TND
                    </span>
                  </div>

                  <ul className=" text-xs md:text-sm text-gray-500 tracking-wider  mt-2">
                    {products?.product?.attributes
                      .slice(0, 2)
                      .map((attribute: any, i: number) => (
                        <li key={i}>
                          <span className="text-sm font-semibold">
                            {attribute.name}
                          </span>{" "}
                          :{" "}
                          <span className="text-sm font-light capitalize">
                            {attribute.value}
                          </span>
                        </li>
                      ))}
                  </ul>

                  <div
                    className="Color relative w-fit cursor-crosshair my-3 lg:my-0"
                    title={products?.product?.Colors?.color}
                  >
                    {products?.product.Colors && (
                      <div
                        className="colors_available items-center   lg:mt-2 w-5 h-5  border-black border-2 rounded-sm shadow-gray-400 shadow-sm"
                        style={{
                          backgroundColor: products?.product?.Colors?.Hex,
                        }}
                      />
                    )}
                  </div>
                </Link>

                <button
                  type="button"
                  className=" rounded-lg bg-strongBeige w-full py-2 text-white lg:mt-3 hover:bg-mediumBeige transition-colors"
                  onClick={() => {
                    AddToBasket(products?.product);

                    toast({
                      title: "Notification de Panier",
                      description: `Le produit "${products?.product?.name}" a été ajouté au panier.`,
                      className: "bg-strongBeige text-white",
                    });
                  }}
                >
                  Acheter maintenant
                </button>
              </div>
            </div>
          );
        })}
      </>
    );
  }, [
    topDeals,
    AddToBasket,
    addToCompare,
    setIsFavorite,
    isFavorite,
    decodedToken,
  ]);

  return (
    <div className="md:grid grid-cols-2 gap-3 grid-flow-col overflow-hidden block">
      {renderProducts}
    </div>
  );
};

export default React.memo(TopDeals);
