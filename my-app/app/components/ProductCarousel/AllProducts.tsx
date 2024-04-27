import calcDateForNewProduct from "@/app/components/_calcDateForNewProduct";
import prepRoute from "@/app/components/_prepRoute";
import { ADD_TO_BASKET_MUTATION } from "@/graphql/mutations";
import { useMutation } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaBasketShopping } from "react-icons/fa6";
import { IoGitCompare } from "react-icons/io5";
import { CarouselItem } from "../../../components/ui/carousel";
import {
  useBasketStore,
  useComparedProductsStore,
  useDrawerBasketStore,
  useProductDetails,
  useProductsInBasketStore,
} from "../../store/zustand";
import PopHover from "../PopHover";
import FavoriteProduct from "./FavoriteProduct";
import NoProductYet from "./NoProductYet";
import { BASKET_QUERY } from "@/graphql/queries";
interface Product {
  id: string;
  name: string;
  price: number;
  reference: string;
  description: string;
  createdAt: Date;
  inventory: number;
  images: string[];
  categories: {
    name: string;
    subcategories: {
      name: any;
    };
  }[];
  Colors: {
    color: string;
    Hex: string;
  };
  productDiscounts: {
    price: number;
    newPrice: number;
    Discount: {
      percentage: number;
    };
  }[];
}

const AllProducts = ({
  product,
  userId,
  carouselWidthClass,
}: {
  product: Product;
  userId: string;
  carouselWidthClass: string;
}) => {
  const [showPopover, setShowPopover] = useState<Boolean>(false);
  const [popoverTitle, setPopoverTitle] = useState<string>("");
  const { openBasketDrawer } = useDrawerBasketStore();
  const toggleIsUpdated = useBasketStore((state) => state.toggleIsUpdated);
  const { openProductDetails } = useProductDetails();

  const [addToBasketMutation, { loading: addToBasketLoading }] = useMutation(
    ADD_TO_BASKET_MUTATION
  );

  const { addProductToBasket, products } = useProductsInBasketStore(
    (state) => ({
      addProductToBasket: state.addProductToBasket,
      products: state.products,
    })
  );

  const AddToBasket = (productId: string) => {
    if (userId) {
      addProductToBasket({
        variables: {
          input: {
            userId: userId,
            quantity: 1,
            productId: productId,
          },
        },
        refetchQueries: [
          {
            query: BASKET_QUERY,
            variables: { userId: userId },
          },
        ],
      });
    } else {
      const isProductAlreadyInBasket = products.some(
        (p: any) => p.id === product.id
      );

      if (!isProductAlreadyInBasket) {
        addProductToBasket({
          ...product,
          price: product.productDiscounts.length
            ? product.productDiscounts[0].newPrice
            : product.price,
          quantity: 1,
        });
        openBasketDrawer();
      } else {
        console.log("Product is already in the basket");
      }
    }
    toggleIsUpdated();
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
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
console.log( product?.categories[0]?.subcategories[0]?.name);

  return (
    <>
      <CarouselItem
        key={product?.id}
        className={`carousel-item  group hover:rounded-sm  h-[420px]   transition-all relative pb-3 flex  flex-col justify-start items-center border shadow-xl basis-full  md:basis-1/2 lg:basis-1/3  xl:basis-1/5 ${carouselWidthClass}`}
      >
        <ul className="plus_button lg:opacity-0 group-hover:opacity-100  absolute right-3 z-50  top-14 flex flex-col gap-3  ">
          <div
            className="product-details relative w-fit cursor-crosshair"
            onMouseEnter={() => handleMouseEnterHoverPop("produit en details")}
            onMouseLeave={handleMouseLeaveHoverPop}
            onClick={() => openProductDetails(product)}
          >
            {showPopover && popoverTitle === "produit en details" && (
              <PopHover title={popoverTitle} />
            )}
            <li className="bg-strongBeige rounded-full  lg:translate-x-20 group-hover:translate-x-0   p-2 shadow-md hover:bg-mediumBeige transition-all">
              <FaRegEye color="white" />
            </li>
          </div>

          <div
            className="add-to-basket relative w-fit h-fit cursor-crosshair"
            onMouseEnter={() => handleMouseEnterHoverPop("Ajouter au panier")}
            onMouseLeave={handleMouseLeaveHoverPop}
            onClick={() => AddToBasket(product?.id)}
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
            onClick={() => addToCompare(product)}
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
            {showPopover && popoverTitle === "Ajouter à ma liste d'enviess" && (
              <PopHover title={popoverTitle} />
            )}
            <li className="bg-strongBeige  rounded-full delay-200 lg:translate-x-20 group-hover:translate-x-0 transition-all p-2 shadow-md hover:bg-mediumBeige ">
              <FavoriteProduct
                isFavorite={isFavorite}
                setIsFavorite={setIsFavorite}
                productId={product?.id}
                userId={userId}
              />
            </li>
          </div>
        </ul>

        <Link
          className="w-full flex items-center flex-col overflow-hidden group-hover:bg-lightBlack transition-colors"
          href={{
            pathname: `products/tunisie/${prepRoute(product?.name)}`,
            query: {
              productId: product?.id,
              collection: [
                product?.categories[0]?.name,
                product?.categories[0]?.subcategories[0]?.name,
                product?.name,
              ],
            },
          }}
        >
          <div className=" flex justify-between w-full px-3 z-20 uppercase text-white text-[11px] translate-y-4 ">
            {calcDateForNewProduct(product?.createdAt) && (
              <span className="bg-green-500 w-fit justify-start shadow-md p-1">
                Nouveau
              </span>
            )}
            {product?.productDiscounts.length > 0 && (
              <span className="bg-red-500 w-fit shadow-md p-1">Promo</span>
            )}
          </div>

          <div className="images relative  -z-10 w-[250px] h-[250px]  transition-all overflow-hidden cursor-crosshair text-black flex justify-center items-center">
            <Image
              src={product?.images[0]}
              className="w-full h-full"
              loading="eager"
              priority
              objectPosition="0"
              alt={`products-${product?.name}`}
              layout="fill"
            />
          </div>
        </Link>

        <div className="relative border-t-2  flex flex-col px-3 w-full justify-end items-start">
          <Link
            href={{
              pathname: `products/tunisie/${prepRoute(product?.name)}`,
              query: {
                productId: product?.id,
                collection: [product?.categories[0]?.name, product?.name],
              },
            }}
            product-name={product?.name}
            className="product-name hover:text-strongBeige transition-colors text-sm font-medium tracking-wide
      line-clamp-2 "
          >
            <p className="category  font-normal -tracking-tighter  text-xs py-1 capitalize">
              {product?.categories[2]?.name}
            </p>
            {product?.name}
          </Link>
          <div
            className={`relative ${product?.productDiscounts.length > 0 ? "group-hover:hidden" : ""} w-fit cursor-crosshair`}
            onMouseEnter={() =>
              handleMouseEnterHoverPop(product?.Colors?.color)
            }
            onMouseLeave={handleMouseLeaveHoverPop}
          >
            {showPopover && popoverTitle === product?.Colors?.color && (
              <PopHover title={product?.Colors?.color} />
            )}
            {product?.Colors && (
              <div
                className="colors_available items-center   mt-2 w-5 h-5  border-black border-2 rounded-sm shadow-gray-400 shadow-sm"
                style={{
                  backgroundColor: product?.Colors?.Hex,
                }}
              />
            )}
          </div>

          <button
            onClick={() => AddToBasket(product?.id)}
            className={`${
              product?.productDiscounts.length > 0
                ? "group-hover:translate-y-16 "
                : "group-hover:translate-y-2"
            } bg-strongBeige  uppercase absolute translate-y-32 left-1/2 -translate-x-1/2 group-hover:translate-y-0 text-xs md:text-sm md:px-3 z-50 hover:bg-mediumBeige transition-all text-white w-4/5 py-2 rounded-md`}
            disabled={addToBasketLoading}
          >
            {addToBasketLoading ? "Adding..." : "Ajouter au"}
          </button>

          <div
            className={`priceDetails ${product?.productDiscounts.length > 0 ? "group-hover:hidden" : "group-hover:translate-y-32 "}  translate-y-0`}
          >
            <p
              className={`${
                product?.productDiscounts.length > 0
                  ? "line-through text-lg"
                  : " text-strongBeige text-xl py-1"
              }  font-semibold`}
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
        </div>
      </CarouselItem>

      {!product && <NoProductYet />}
    </>
  );
};

export default AllProducts;
