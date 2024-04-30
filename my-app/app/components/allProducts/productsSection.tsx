"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLazyQuery, useMutation } from "@apollo/client";
import { SEARCH_PRODUCTS_QUERY } from "../../../graphql/queries";
import { FaHeart, FaRegEye } from "react-icons/fa";
import { SlBasket } from "react-icons/sl";
import Link from "next/link";
import prepRoute from "../_prepRoute";
import Loading from "@/app/(mainApp)/loading";
import {
  useAllProductViewStore,
  useBasketStore,
  useComparedProductsStore,
  useProductDetails,
  useProductsInBasketStore,
} from "../../store/zustand";
import { ADD_TO_BASKET_MUTATION } from "../../../graphql/mutations";
import PopHover from "../PopHover";
import { FaBasketShopping } from "react-icons/fa6";
import { IoGitCompare } from "react-icons/io5";
import FavoriteProduct from "../ProductCarousel/FavoriteProduct";
import { JwtPayload } from "jsonwebtoken";
import Cookies from "js-cookie";
import jwt from 'jsonwebtoken';

interface DecodedToken extends JwtPayload {
  userId: string;
}
const ProductsSection = () => {
  const searchParams = useSearchParams();
  const colorParam = searchParams?.get("color");
  const categoryParam = searchParams?.get("category");
  const priceParamString = searchParams?.get("price");
  const priceParam = priceParamString ? +priceParamString : undefined;
  const { view } = useAllProductViewStore();
  const [showPopover, setShowPopover] = useState<Boolean>(false);
  const [popoverTitle, setPopoverTitle] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;
  const numberOfPages = Math.ceil(totalCount / pageSize);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);

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
  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
  }, []);
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

  const [searchProducts, { loading, data }] = useLazyQuery(
    SEARCH_PRODUCTS_QUERY
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await searchProducts({
          variables: {
            input: {
              categoryId: categoryParam || undefined,
              colorId: colorParam || undefined,
              minPrice: 1,
              maxPrice: priceParam || undefined,
              page,
              pageSize,
            },
          },
        });

        setProducts(data?.searchProducts.results || []);
        setTotalCount(data?.searchProducts.totalCount || 0);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [searchProducts, categoryParam, colorParam, priceParam, page, pageSize]);

  const handleNextPage = () => {
    if (page < numberOfPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const renderPageNumbers = () => {
    const maxPagesToShow = 6;
    const pages: any = [];
    const startPage = Math.max(
      1,
      Math.min(
        page - Math.floor(maxPagesToShow / 2),
        numberOfPages - maxPagesToShow + 1
      )
    );

    for (
      let i = startPage;
      i < startPage + maxPagesToShow && i <= numberOfPages;
      i++
    ) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`flex items-center justify-center px-3 h-8 leading-tight cursor-pointer text-strongBeige border border-strongBeige hover:bg-strongBeige hover:text-white ${page === i ? "bg-strongBeige text-white" : "bg-white text-strongBeige"}`}
        >
          {i}
        </button>
      );
    }

    if (numberOfPages > maxPagesToShow) {
      pages.push(
        <span
          key="more-pages"
          className="flex items-center justify-center px-3 h-8 text-strongBeige border border-strongBeige"
        >
          ...
        </span>
      );
    }

    return pages;
  };

  return (
    <>
      {loading ? (
        <div className="flex items-center h-full justify-center">
          <Loading />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-between h-full ">
         
          <div
            className={`${
              view === 3
                ? "md:grid-cols-3 grid-cols-1 xl:grid-cols-4 "
                : view === 2
                  ? "grid-cols-2"
                  : view === 1
                    ? " grid-cols-1 "
                    : ""
            } w-full py-5 grid  px-10 justify-items-center items-center gap-4 `}
          >
            {products.map((product: Product) => (
              <div
                className={`
              
              ${
                view === 3 || view == 2
                  ? "flex-col items-center justify-center h-[335.5px]"
                  : view === 1
                    ? " flex-row h-52 gap-8 items-center justify-between px-6 "
                    : ""
              }
              group flex w-full overflow-hidden border border-gray-100 bg-white shadow-md`}
              >
                 {/* <ul className="plus_button lg:opacity-0 group-hover:opacity-100  absolute right-3 z-50  top-14 flex flex-col gap-3  ">
            <div
              className="product-details relative w-fit cursor-crosshair"
              onMouseEnter={() =>
                handleMouseEnterHoverPop("produit en details")
              }
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
              {showPopover &&
                popoverTitle === "Ajouter à ma liste d'enviess" && (
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
          </ul> */}
                <Link
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
                  className="relative flex w-40 h-40 md:h-56 md:w-56 overflow-hidden"
                >
                  <div className="group">
                    <img
                      className="absolute group-hover:opacity-0 z-10 opacity-100 transition-all top-0 right-0 h-full w-full object-cover"
                      src={product.images[0]}
                      alt="product image"
                    />
                    <img
                      className="absolute group-hover:opacity-100 opacity-0 transition-all top-0 right-0 h-full w-full object-cover"
                      src={product.images[1]}
                      alt="product image"
                    />
                  </div>

                  <div className="absolute -right-16 bottom-0 mr-2 mb-4 space-y-2 transition-all duration-300 group-hover:right-0">
                    <button className="flex h-10 w-10 items-center justify-center bg-strongBeige text-white transition hover:bg-yellow-700">
                      <FaHeart />
                    </button>
                  </div>
                </Link>
                <div
                  className={`
                ${view !== 1 ? " border-t" : ""}
                mt-4 px-2 pb-5  w-full`}
                >
                  <Link
                    href={{
                      pathname: `products/tunisie/${prepRoute(product?.name)}`,
                      query: {
                        productId: product?.id,
                        collection: [
                          product?.categories[0]?.name,
                          product?.name,
                        ],
                      },
                    }}
                    product-name={product?.name}
                    className="product-name tracking-wider hover:text-strongBeige transition-colors text-sm font-medium 
      line-clamp-2 "
                  >
                    <p className="category  font-normal -tracking-tighter  text-xs py-1 capitalize">
                      {product?.categories[2]?.name}
                    </p>
                    {product?.name}
                  </Link>
                  <div>
                    <p
                      className={`${
                        product?.productDiscounts.length > 0
                          ? "line-through text-lg"
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
                          {product?.productDiscounts[0]?.newPrice.toFixed(3)}{" "}
                          TND
                        </span>
                      </div>
                    )}
                  </div>
                  <button className="flex items-center gap-1 justify-center bg-strongBeige px-2 py-1 text-md text-white transition hover:bg-yellow-700">
                    <SlBasket />
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="Page pagination justify-self-start h-32 ">
            <ul className="inline-flex -space-x-px text-sm">
              <li>
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-strongBeige bg-white border border-e-0 border-strongBeige rounded-s-lg hover:bg-strongBeige hover:text-white"
                >
                  Previous
                </button>
              </li>
              {renderPageNumbers()}
              <li>
                <button
                  onClick={handleNextPage}
                  disabled={page === Math.ceil(totalCount / pageSize)}
                  className="flex items-center justify-center px-3 h-8 leading-tight text-strongBeige bg-white border border-strongBeige rounded-e-lg hover:bg-strongBeige hover:text-white"
                >
                  Next
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsSection;
