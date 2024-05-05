"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLazyQuery } from "@apollo/client";
import { SEARCH_PRODUCTS_QUERY } from "../../../../graphql/queries";
import { IoIosClose } from "react-icons/io";

import { ProductBox } from "../../../components/ProductBox";
import { useAllProductViewStore } from "../../../store/zustand";

import NoProductYet from "../../../components/ProductCarousel/NoProductYet";

const ProductsSection = () => {
  const searchParams = useSearchParams();
  const colorParam = searchParams?.get("color");
  const categoryParam = searchParams?.get("category");
  const sortParam = searchParams?.get("sort");
  const priceParamString = searchParams?.get("price");
  const choiceParam = searchParams?.get("choice");
  const brandParam = searchParams?.get("brand");
  const queryParam = searchParams?.get("query");
  const priceParam = priceParamString ? +priceParamString : undefined;
  const { view } = useAllProductViewStore();
  const [searchProducts, { loading, data }] = useLazyQuery(
    SEARCH_PRODUCTS_QUERY
  );

  const [productsData, setProductsData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;
  const numberOfPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await searchProducts({
          variables: {
            input: {
              query: queryParam || undefined,
              categoryId: categoryParam || undefined,
              colorId: colorParam || undefined,
              minPrice: 1,
              maxPrice: priceParam || undefined,
              choice: choiceParam || undefined,
              markeId: brandParam || undefined,
              page,
              pageSize,
            },
          },
        });

        const fetchedProducts: any = [
          ...(data?.searchProducts.results.products || []),
        ];

        if (sortParam === "asc") {
          fetchedProducts.sort((a: any, b: any) => a.price - b.price);
        } else if (sortParam === "desc") {
          fetchedProducts.sort((a: any, b: any) => b.price - a.price);
        }

        setProductsData(fetchedProducts);
        setTotalCount(data?.searchProducts.totalCount || 0);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    console.log(productsData);

    fetchProducts();
  }, [
    searchProducts,
    categoryParam,
    colorParam,
    sortParam,
    priceParam,
    brandParam,
    choiceParam,
    page,
    pageSize,
  ]);

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
          {/* <Loading /> */}
        </div>
      ) : (
        <div className="flex flex-col items-center  h-full ">
          {!!queryParam && (
            <h1 className="text-xl font-bold text-strongBeige mt-10 mb-10">
              {productsData.length} résultats trouvé pour "{queryParam}"
            </h1>
          )}
          <div className="p-4 bg-[#f2f2f278] mt-3 w-11/12 tracking-wider flex items-center font-semibold">
            Filtres actifs :
            {choiceParam && (
              <div>
                <button className="border  bg-white hover:opacity-70 transition-opacity flex items-center gap-1 text-sm py-1 px-2 ml-4 font-light shadow">
                  <p>Choix : </p>
                  {choiceParam}
                  <IoIosClose size={25} />
                </button>
              </div>
            )}
          </div>

          <div
            className={`${
              view === 3
                ? "md:grid-cols-2 lg:grid-cols-3 grid-cols-1 xl:grid-cols-4 "
                : view === 2
                  ? "md:grid-cols-2 lg:grid-cols-3"
                  : view === 1
                    ? " grid-cols-1 "
                    : ""
            } w-full py-5 grid  px-10 justify-items-center items-center gap-4    `}
          >
            {productsData.map((product: Product) => (
              <div
                key={product.id}
                className={`
              
              ${
                view === 3 || view == 2
                  ? "flex-col items-center justify-between h-[400px]"
                  : view === 1
                    ? " flex-row h-52 gap-8 items-center justify-between pl-2 "
                    : ""
              }
              group flex relative w-full overflow-hidden border border-gray-100 bg-white shadow-md`}
              >
                <ProductBox product={product} />
              </div>
            ))}
          </div>

          {productsData.length > 0 && (
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
          )}
        </div>
      )}
      {!productsData && <NoProductYet />}
    </>
  );
};

export default ProductsSection;
