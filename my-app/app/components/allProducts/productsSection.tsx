"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLazyQuery } from "@apollo/client";
import { SEARCH_PRODUCTS_QUERY } from "../../../graphql/queries";
import { FaHeart } from "react-icons/fa";
import { SlBasket } from "react-icons/sl";
import Link from "next/link";
import prepRoute from "../_prepRoute";
import Loading from "@/app/(mainApp)/loading";
import { useAllProductViewStore } from "../../store/zustand";

const ProductsSection = () => {
  const searchParams = useSearchParams();
  const colorParam = searchParams?.get("color");
  const categoryParam = searchParams?.get("category");
  const priceParamString = searchParams?.get("price");
  const priceParam = priceParamString ? +priceParamString : undefined;
  const { view } = useAllProductViewStore();

  const [searchProducts, { loading, data }] = useLazyQuery(
    SEARCH_PRODUCTS_QUERY
  );
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;
  const numberOfPages = Math.ceil(totalCount / pageSize);
  console.log(numberOfPages);

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
                ? "md:grid-cols-3 grid-cols-1 lg:grid-cols-5 "
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
                  className="relative flex h-56 w-56 overflow-hidden"
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
