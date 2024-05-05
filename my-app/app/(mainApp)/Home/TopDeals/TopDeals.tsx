import prepRoute from "@/app/components/_prepRoute";
import PopHover from "@/app/components/PopHover";
import FavoriteProduct from "@/app/components/ProductCarousel/FavoriteProduct";
import {
  useBasketStore,
  useComparedProductsStore,
  useDrawerBasketStore,
  useProductDetails,
  useProductsInBasketStore,
} from "@/app/store/zustand";
import { ADD_TO_BASKET_MUTATION } from "@/graphql/mutations";
import { BASKET_QUERY, TOP_DEALS } from "@/graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaBasketShopping } from "react-icons/fa6";
import { IoGitCompare } from "react-icons/io5";
interface DecodedToken extends JwtPayload {
  userId: string;
}
const TopDeals = () => {
  const [showPopover, setShowPopover] = useState(false);
  const [popoverTitle, setPopoverTitle] = useState("");
  const [popoverIndex, setPopoverIndex] = useState<number>(0);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const [addToBasket] = useMutation(ADD_TO_BASKET_MUTATION);
  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
  }, []);
  const handleMouseEnter = (title: string, index: number) => {
    setShowPopover(true);
    setPopoverTitle(title);
    setPopoverIndex(index);
  };

  const handleMouseLeave = () => {
    setShowPopover(false);
    setPopoverTitle("");
    setPopoverIndex(0);
  };

  const { loading: loadingNewDeals, data: topDeals } = useQuery(TOP_DEALS);

  const { openBasketDrawer } = useDrawerBasketStore();
  const { openProductDetails } = useProductDetails();

  const [addToBasketMutation, { loading: addToBasketLoading }] = useMutation(
    ADD_TO_BASKET_MUTATION
  );

  const AddToBasket = (productId: string) => {
    if (decodedToken?.userId) {
      addToBasketMutation({
        variables: {
          input: {
            userId: decodedToken?.userId,
            productId: productId,
            quantity: 1,
          },
        },
      });
    } else {
      window.sessionStorage.setItem("products", productId);
    }
    openBasketDrawer();
  };

  const handleMouseEnterHoverPop = (title: string) => {
    setShowPopover(true);
    setPopoverTitle(title);
  };

  const handleMouseLeaveHoverPop = () => {
    setShowPopover(false);
    setPopoverTitle("");
  };
  const addProductToCompare = useComparedProductsStore(
    (state) => state.addProductToCompare
  );
  const addToCompare = (product: any) => {
    addProductToCompare(product);
  };

  const { isUpdated, toggleIsUpdated } = useBasketStore((state) => ({
    isUpdated: state.isUpdated,
    toggleIsUpdated: state.toggleIsUpdated,
  }));

  const { addProductToBasket, productsInBasket } = useProductsInBasketStore(
    (state) => ({
      addProductToBasket: state.addProductToBasket,
      productsInBasket: state.products,
    })
  );

  return (
    <div className="md:grid grid-cols-2 gap-3 grid-flow-col overflow-hidden  block">
      {topDeals?.allDeals.map((products: any, index: number) => {
        return (
          <div
            key={index}
            className="grid lg:grid-cols-3 border group grid-cols-1 rounded-lg p-2 h-4/5 md:h-full  lg:h-80 min-h-80 w-full lg:w-11/12 grid-flow-col grid-rows-2 lg:grid-rows-1 lg:grid-flow-row  place-self-center  items-center gap-5 shadow-lg relative"
          >
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
              className="h-56 lg:h-full  w-full"
            >
              <span className="absolute left-5 top-5 z-20 text-white bg-green-600 px-4 font-semibold text-sm py-1 rounded-md">
                {products?.product?.productDiscounts[0]?.Discount.percentage}%
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
                onMouseEnter={() => handleMouseEnterHoverPop("aperçu rapide")}
                onMouseLeave={handleMouseLeaveHoverPop}
                onClick={() => openProductDetails(products?.product)}
              >
                {showPopover && popoverTitle === "aperçu rapide" && (
                  <PopHover title={popoverTitle} />
                )}
                <li className="bg-strongBeige rounded-full  lg:translate-x-20 group-hover:translate-x-0   p-2 shadow-md hover:bg-mediumBeige transition-all">
                  <FaRegEye color="white" />
                </li>
              </div>

              <div
                className="add-to-basket relative w-fit h-fit cursor-crosshair"
                onMouseEnter={() =>
                  handleMouseEnterHoverPop("Ajouter au panier")
                }
                onMouseLeave={handleMouseLeaveHoverPop}
                onClick={() => AddToBasket(products?.product?.id)}
              >
                {showPopover && popoverTitle === "Ajouter au panier" && (
                  <PopHover title={popoverTitle} />
                )}
                <li className="bg-strongBeige rounded-full delay-100 lg:translate-x-20 group-hover:translate-x-0 transition-all p-2 shadow-md hover:bg-mediumBeige ">
                  <FaBasketShopping color="white" />
                </li>
              </div>

              <div
                className="Comparison relative w-fit cursor-crosshair"
                onMouseEnter={() =>
                  handleMouseEnterHoverPop("Ajouter au comparatif")
                }
                onMouseLeave={handleMouseLeaveHoverPop}
                onClick={() => addToCompare(products?.product)}
              >
                {showPopover && popoverTitle === "Ajouter au comparatif" && (
                  <PopHover title={popoverTitle} />
                )}
                <li className="bg-strongBeige rounded-full  delay-150 lg:translate-x-20 group-hover:translate-x-0 transition-all p-2 shadow-md hover:bg-mediumBeige ">
                  <IoGitCompare color="white" />
                </li>
              </div>

              <div
                className="Favorite relative w-fit cursor-crosshair"
                onMouseEnter={() =>
                  handleMouseEnterHoverPop("Ajouter à ma liste d'enviess")
                }
                onMouseLeave={handleMouseLeaveHoverPop}
              >
                {showPopover &&
                  popoverTitle === "Ajouter à ma liste d'enviess" && (
                    <PopHover title={popoverTitle} />
                  )}
                <li className="bg-strongBeige  rounded-full delay-200 lg:translate-x-20 group-hover:translate-x-0 transition-all p-2 shadow-md hover:bg-mediumBeige ">
                  <FavoriteProduct
                    isFavorite={isFavorite}
                    setIsFavorite={setIsFavorite}
                    productId={products?.product?.id}
                    userId={decodedToken?.userId}
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
                <div className="prices flex gap-3 text-lg lg:mt-3">
                  <span className="text-strongBeige font-semibold">
                    {products?.product?.productDiscounts[0]?.newPrice.toFixed(
                      3
                    )}
                    TND
                  </span>
                  <span className="line-through text-gray-400">
                    {products?.product?.price.toFixed(3)}TND
                  </span>
                </div>

                <ul className=" text-xs md:text-sm text-gray-500 tracking-wider mt-2">
                  {products?.product?.attributes
                    .slice(0, 4)
                    .map((attribute: any, i: number) => (
                      <li key={i}>
                        <span className="text-sm font-semibold">
                          {attribute.name}
                        </span>{" "}
                        : <span className="text-base">{attribute.value}</span>
                      </li>
                    ))}
                </ul>

                <div
                  className="Color relative w-fit cursor-crosshair my-3 lg:my-0"
                  onMouseEnter={() =>
                    handleMouseEnter(products?.product?.Colors?.color, index)
                  }
                  onMouseLeave={handleMouseLeave}
                >
                  {showPopover &&
                    popoverTitle === products?.product?.Colors?.color &&
                    popoverIndex == index && (
                      <PopHover title={products?.product?.Colors?.color} />
                    )}
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
                className=" rounded-lg bg-strongBeige w-full py-2 text-white lg:mt-3 hover:bg-mediumBeige transition-colors"
                onClick={() => {
                  if (decodedToken) {
                    addToBasket({
                      variables: {
                        input: {
                          userId: decodedToken?.userId,
                          quantity: 1,
                          productId: products?.product?.id,
                        },
                      },
                      refetchQueries: [
                        {
                          query: BASKET_QUERY,
                          variables: { userId: decodedToken?.userId },
                        },
                      ],
                    });
                  } else {
                    const isProductAlreadyInBasket = productsInBasket.some(
                      (p: any) => p.id === products?.product?.id
                    );

                    if (!isProductAlreadyInBasket) {
                      addProductToBasket({
                        ...products?.product,
                        price: products?.product?.discount
                          ? products?.product.discount?.newPrice
                          : products?.product?.price,
                        quantity: 1,
                      });
                    } else {
                      console.log("Product is already in the basket");
                    }
                  }
                  toggleIsUpdated();
                }}
              >
                Acheter maintenant
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TopDeals;
