import calcDateForNewProduct from "@/app/components/_calcDateForNewProduct";
import prepRoute from "@/app/components/_prepRoute";
import jwt, { JwtPayload } from "jsonwebtoken";
import Cookies from "js-cookie";
import { gql, useMutation } from "@apollo/client";
import { FaSearch } from "react-icons/fa";
import { FaBasketShopping } from "react-icons/fa6";
import { IoGitCompare } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Loading from "./Loading";
import { useDrawerBasketStore } from "@/app/store/zustand";
import PopHover from "../PopHover";
import NoProductYet from "./NoProductYet";

interface Product {
  images: string[];
  Colors: {
    color: string;
    Hex: string;
  };
}

interface DecodedToken extends JwtPayload {
  userId: string;
}

const ADD_TO_BASKET = gql`
  mutation AddToBasket($input: CreateToBasketInput!) {
    addToBasket(input: $input) {
      id
      userId
      quantity
      productId
    }
  }
`;

const ProductTabs = ({ data, loadingNewProduct }: any) => {
  const { openBasketDrawer } = useDrawerBasketStore();
  const [showPopover, setShowPopover] = useState(false);
  const [popoverTitle, setPopoverTitle] = useState("");
  const [popoverIndex, setPopoverIndex] = useState("");
  const [addToBasketMutation, { loading: addToBasketLoading }] =
    useMutation(ADD_TO_BASKET);

  const AddToBasket = (productId: string) => {
    const token = Cookies.get("Token");

    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      console.log(decoded);
      addToBasketMutation({
        variables: {
          input: {
            userId: decoded.userId,
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

  const handleMouseEnter = (title: string, index: string) => {
    setShowPopover(true);
    setPopoverTitle(title);
    setPopoverIndex(index);
  };

  const handleMouseLeave = () => {
    setShowPopover(false);
    setPopoverTitle("");
    setPopoverIndex("");
  };

  return (
    <div className="products-tabs relative cursor-pointer rounded-md shadow-lg grid">
      {loadingNewProduct && <Loading />}
      {!loadingNewProduct && data && (
        <div className="flex overflow-hidden w-full h-fit  ">
          <Carousel className="carousel w-full h-4/5 flex items-center transition-all duration-500 ease-in-out">
            <CarouselContent className="h-full gap-1 px-3  w-full ">
              {data?.products.map((product: any, index: any) => (
                <CarouselItem
                  key={index}
                  className="carousel-item  group hover:rounded-sm  h-96   transition-all relative pb-3 flex  flex-col justify-start items-center border shadow-xl basis-full md:basis-1/2 lg:basis-1/3  xl:basis-1/5"
                >
                  <ul className="plus_button opacity-0 group-hover:opacity-100  absolute right-3 z-50  top-14 flex flex-col gap-3  ">
                    <div
                      className="relative w-fit cursor-crosshair"
                      onMouseEnter={() =>
                        handleMouseEnter("produit en details", index)
                      }
                      onMouseLeave={handleMouseLeave}
                    >
                      {showPopover &&
                        popoverTitle === "produit en details" &&
                        popoverIndex == index && (
                          <PopHover title={popoverTitle} />
                        )}
                      <li className="bg-strongBeige rounded-full  translate-x-20 group-hover:translate-x-0   p-2 shadow-md hover:bg-mediumBeige transition-all">
                        <FaSearch color="white" />
                      </li>
                    </div>
                    <div
                      className="relative w-fit h-fit cursor-crosshair"
                      onMouseEnter={() =>
                        handleMouseEnter("Ajouter au panier", index)
                      }
                      onMouseLeave={handleMouseLeave}
                    >
                      {showPopover &&
                        popoverTitle === "Ajouter au panier" &&
                        popoverIndex == index && (
                          <PopHover title={popoverTitle} />
                        )}
                      <li className="bg-strongBeige rounded-full delay-100 translate-x-20 group-hover:translate-x-0 transition-all p-2 shadow-md hover:bg-mediumBeige ">
                        <FaBasketShopping color="white" />
                      </li>
                    </div>
                    <div
                      className="relative w-fit cursor-crosshair"
                      onMouseEnter={() =>
                        handleMouseEnter("Ajouter au comparatif", index)
                      }
                      onMouseLeave={handleMouseLeave}
                    >
                      {showPopover &&
                        popoverTitle === "Ajouter au comparatif" &&
                        popoverIndex == index && (
                          <PopHover title={popoverTitle} />
                        )}
                      <li className="bg-strongBeige rounded-full  delay-150 translate-x-20 group-hover:translate-x-0 transition-all p-2 shadow-md hover:bg-mediumBeige ">
                        <IoGitCompare color="white" />
                      </li>
                    </div>
                    <div
                      className="relative w-fit cursor-crosshair"
                      onMouseEnter={() =>
                        handleMouseEnter("Ajouter à ma liste d'enviess", index)
                      }
                      onMouseLeave={handleMouseLeave}
                    >
                      {showPopover &&
                        popoverTitle === "Ajouter à ma liste d'enviess" &&
                        popoverIndex == index && (
                          <PopHover title={popoverTitle} />
                        )}
                      <li className="bg-strongBeige  rounded-full delay-200 translate-x-20 group-hover:translate-x-0 transition-all p-2 shadow-md hover:bg-mediumBeige ">
                        <FaRegHeart color="white" />
                      </li>
                    </div>
                  </ul>
                  <Link
                    className="w-full overflow-hidden group-hover:bg-[#00000030] transition-colors"
                    href={{
                      pathname: `products/tunisie/${prepRoute(product?.name)}`,
                      query: {
                        productId: product.id,
                      },
                    }}
                  >
                    <div className=" flex justify-between w-full px-3 z-50 uppercase text-white text-[11px] translate-y-4 ">
                      {calcDateForNewProduct(product?.createdAt) && (
                        <span className="bg-green-500 w-fit justify-start shadow-md p-1">
                          Nouveau
                        </span>
                      )}
                      {product.productDiscounts.length > 0 && (
                        <span className="bg-red-500 w-fit shadow-md p-1">
                          Promo
                        </span>
                      )}
                    </div>

                    <div className="images relative -z-10 w-full h-[250px] lg:h-[260px]  transition-all overflow-hidden cursor-crosshair text-black flex justify-center items-center">
                      <Image
                        src={product.images[0]} // Change to select appropriate image
                        className="w-52 h-full"
                        width={300}
                        height={250}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        alt={`products-${product.name}`}
                        layout="responsive"
                      />
                    </div>
                  </Link>

                  <div className="relative border-t-2  flex flex-col px-3 w-full justify-end items-start">
                    <p className="category  font-normal -tracking-tighter  text-xs py-1 capitalize">
                      {product.categories[2]?.name}
                    </p>
                    <Link
                      href={{
                        pathname: `products/tunisie/${prepRoute(product.name)}`,
                        query: {
                          productId: product.id,
                        },
                      }}
                      product-name={product.name}
                      className="product-name hover:text-strongBeige transition-colors text-sm font-medium tracking-wide
                    line-clamp-2 "
                    >
                      {product.name}
                    </Link>
                    <p className="text-sm text-gray-400 tracking-tight">
                      {product.categories[0].name}
                    </p>
                    <div
                      className="relative w-fit cursor-crosshair"
                      onMouseEnter={() =>
                        handleMouseEnter(product?.Colors?.color, index)
                      }
                      onMouseLeave={handleMouseLeave}
                    >
                      {showPopover &&
                        popoverTitle === product?.Colors?.color &&
                        popoverIndex == index && (
                          <PopHover title={product?.Colors?.color} />
                        )}
                      {product.Colors && (
                        <div
                          className="colors_available items-center   mt-2 w-5 h-5  border-black border-2 rounded-sm shadow-gray-400 shadow-sm"
                          style={{
                            backgroundColor: product?.Colors?.Hex,
                          }}
                        />
                      )}
                    </div>

                    <button
                      onClick={() => AddToBasket(product.id)}
                      className={`${
                        product.productDiscounts.length > 0
                          ? "group-hover:-translate-y-4 "
                          : "group-hover:translate-3"
                      } bg-strongBeige  uppercase absolute translate-y-32 left-1/2 -translate-x-1/2 group-hover:translate-y-0 text-xs md:text-sm md:px-3 z-50 hover:bg-mediumBeige transition-all text-white w-4/5 py-2 rounded-md`}
                      disabled={addToBasketLoading}
                    >
                      {addToBasketLoading ? "Adding..." : "Ajouter au"}
                    </button>

                    <div className="priceDetails group-hover:translate-y-32 translate-y-0">
                      <p
                        className={`${
                          product.productDiscounts.length > 0
                            ? "line-through text-lg"
                            : " text-strongBeige text-xl"
                        } py-1 font-semibold`}
                      >
                        {product.price.toFixed(3)} TND
                      </p>
                      {product.productDiscounts.length > 0 && (
                        <div className="flex items-center">
                          <span className="text-gray-400 text-xs font-thin">
                            A partir de :
                          </span>
                          <span className="text-red-500 font-bold ml-1 text-xl">
                            {product.productDiscounts[0]?.newPrice.toFixed(3)}{" "}
                            TND
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="px-2 left-5 transition-all bg-strongBeige text-white z-50" />
            <CarouselNext className="px-2 transition-all right-5 bg-strongBeige text-white z-50" />
          </Carousel>
        </div>
      )}
      {!data && !loadingNewProduct && <NoProductYet />}
    </div>
  );
};

export default ProductTabs;
