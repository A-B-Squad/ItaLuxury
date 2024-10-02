"use client";
import prepRoute from "@/app/Helpers/_prepRoute";
import triggerEvents from "@/utlils/trackEvents";
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
import { BASKET_QUERY, FETCH_USER_BY_ID, TOP_DEALS } from "@/graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import Cookies from "js-cookie";

import jwt, { JwtPayload } from "jsonwebtoken";
import Image from "next/legacy/image";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaBasketShopping } from "react-icons/fa6";
import { IoGitCompare } from "react-icons/io5";
import { pushToDataLayer } from "@/utlils/pushToDataLayer";
interface DecodedToken extends JwtPayload {
  userId: string;
}
const TopDeals = () => {
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const { toast } = useToast();

  const { addProductToBasket, products, increaseProductInQtBasket } =
    useProductsInBasketStore((state) => ({
      increaseProductInQtBasket: state.increaseProductInQtBasket,
      addProductToBasket: state.addProductToBasket,
      products: state.products,
    }));

  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
  }, []);

  const { data: userData } = useQuery(FETCH_USER_BY_ID, {
    variables: {
      userId: decodedToken?.userId,
    },
    skip: !decodedToken?.userId,
  });

  const [addToBasket] = useMutation(ADD_TO_BASKET_MUTATION);

  const { toggleIsUpdated } = useBasketStore((state) => ({
    isUpdated: state.isUpdated,
    toggleIsUpdated: state.toggleIsUpdated,
  }));

  const { loading: loadingNewDeals, data: topDeals } = useQuery(TOP_DEALS);

  const { openBasketDrawer } = useDrawerBasketStore();
  const { openProductDetails } = useProductDetails();

  const AddToBasket = useCallback(
    async (product: any) => {
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
          onCompleted: async () => {
            toast({
              title: "Notification de Panier",
              description: `Le produit "${product?.name}" a été ajouté au panier.`,
              className: "bg-primaryColor text-white",
            });

            // Track Add to Cart
            triggerEvents("AddToCart", {
              user_data: {
                em: [userData?.fetchUsersById.email.toLowerCase()],
                fn: [userData?.fetchUsersById.fullName],
                ph: [userData?.fetchUsersById?.number],
                country: ["tn"],
                external_id: decodedToken?.userId,
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
          toast({
            title: "Notification de Panier",
            description: `Le produit "${product?.name}" a été ajouté au panier.`,
            className: "bg-primaryColor text-white",
          });
        } else {
          increaseProductInQtBasket(product.id);
          toast({
            title: "Notification de Panier",
            description: `Le produit est déjà dans le panier`,
            className: "bg-primaryColor text-white",
          });
        }

        // Track Add to Cart
        triggerEvents("AddToCart", {
          user_data: {
            em: [userData?.fetchUsersById.email.toLowerCase()],
            fn: [userData?.fetchUsersById.fullName],
            ph: [userData?.fetchUsersById?.number],
            country: ["tn"],
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
        className: "bg-primaryColor text-white",
      });
    },
    [addProductToCompare, toast]
  );

  const renderProducts = useMemo(() => {
    if (!topDeals?.allDeals) return null;
    return (
      <>
        {topDeals?.allDeals.map((products: any) => {
          return (
            <div
              key={products?.product?.id}
              className="grid lg:grid-cols-3 border group grid-cols-1 bg-white rounded-sm px-2 h-4/5 md:h-full  lg:h-80 min-h-80 w-full lg:w-11/12 grid-flow-col grid-rows-2 lg:grid-rows-1 lg:grid-flow-row  place-self-center  items-center gap-5  relative"
            >
              <Link
                rel="preload"
                href={`/Collections/tunisie/${prepRoute(products?.product?.name)}/?productId=${products?.product?.id}&categories=${[products?.product?.categories[0]?.name, products?.product?.categories[0]?.subcategories[0]?.name, products?.product?.categories[0]?.subcategories[0]?.subcategories[0]?.name, products?.product?.name]}`}
                className="h-56 lg:h-full  w-full"
              >
                <span className="absolute left-5 top-5 z-20 text-white bg-green-600 px-4 font-semibold text-sm py-1 rounded-md">
                  {products?.product?.productDiscounts[0]?.Discount?.percentage}
                  %
                </span>

                <div className="relative lg:col-span-1 row-span-1 lg:row-span-1 h-52 lg:h-full  w-full">
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
                  <li className="bg-primaryColor rounded-full  lg:translate-x-20 group-hover:translate-x-0   p-2 shadow-md hover:bg-secondaryColor transition-all">
                    <FaRegEye color="white" />
                  </li>
                </div>

                <button
                  type="button"
                  className={`add-to-basket relative w-fit h-fit ${products.product.inventory <= 0 ? "cursor-not-allowed" : "cursor-pointer"} cursor-crosshair`}
                  disabled={products?.product.inventory <= 0}
                  title="Ajouter au panier"
                  onClick={() => {
                    AddToBasket(products?.product);

                    toast({
                      title: "Notification de Panier",
                      description: `Le produit "${products?.product?.name}" a été ajouté au panier.`,
                      className: "bg-primaryColor text-white",
                    });
                  }}
                >
                  <li className="bg-primaryColor rounded-full delay-100 lg:translate-x-20 group-hover:translate-x-0 transition-all p-2 shadow-md hover:bg-secondaryColor ">
                    <FaBasketShopping color="white" />
                  </li>
                </button>

                <div
                  className="Comparison relative w-fit cursor-crosshair"
                  title="Ajouter au comparatif"
                  onClick={() => {
                    addToCompare(products?.product);
                    toast({
                      title: "Produit ajouté à la comparaison",
                      description: `Le produit "${products?.product?.name}" a été ajouté à la comparaison.`,
                      className: "bg-primaryColor text-white",
                    });
                  }}
                >
                  <li className="bg-primaryColor rounded-full  delay-150 lg:translate-x-20 group-hover:translate-x-0 transition-all p-2 shadow-md hover:bg-secondaryColor ">
                    <IoGitCompare color="white" />
                  </li>
                </div>

                <div
                  className="Favorite relative w-fit cursor-crosshair"
                  title="Ajouter à ma liste d'enviess"
                >
                  <li className="bg-primaryColor  rounded-full delay-200 lg:translate-x-20 group-hover:translate-x-0 transition-all p-2 shadow-md hover:bg-secondaryColor ">
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
                  href={`/Collections/tunisie/${prepRoute(products?.product?.name)}/?productId=${products?.product?.id}&categories=${[products?.product?.categories[0]?.name, products?.product?.categories[0]?.subcategories[0]?.name, products?.product?.categories[0]?.subcategories[0]?.subcategories[0]?.name, products?.product?.name]}`}
                >
                  <h2 className="tracking-wider hover:text-secondaryColor transition-colors">
                    {products?.product?.name}
                  </h2>
                  <div className="prices flex gap-3 items-center lg:mt-3">
                    <span className="line-through text-gray-700 font-semibold text-lg">
                      {products?.product?.price.toFixed(3)}TND
                    </span>
                    <span className="text-primaryColor font-bold text-xl">
                      {products?.product?.productDiscounts[0]?.newPrice.toFixed(
                        3
                      )}
                      TND
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
                  className="  bg-primaryColor w-3/5 self-center py-2 text-white lg:mt-3 hover:bg-secondaryColor transition-colors"
                  onClick={() => {
                    AddToBasket(products?.product);
                    toast({
                      title: "Notification de Panier",
                      description: `Le produit "${products?.product?.name}" a été ajouté au panier.`,
                      className: "bg-primaryColor text-white",
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
    <div className="md:grid grid-cols-2 gap-3 grid-flow-col min-h-72 bg-white border py-2 overflow-hidden block">
      {renderProducts}
    </div>
  );
};

export default React.memo(TopDeals);
