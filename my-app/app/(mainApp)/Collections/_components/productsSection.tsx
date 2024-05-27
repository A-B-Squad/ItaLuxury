"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLazyQuery } from "@apollo/client";
import { SEARCH_PRODUCTS_QUERY } from "../../../../graphql/queries";
import { IoMdArrowDropdown } from "react-icons/io";

import { ProductBox } from "../../../components/ProductBox";
import { useAllProductViewStore } from "../../../store/zustand";

import { FaRegTrashAlt } from "react-icons/fa";
import Loading from "../loading";

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
  const [searchProducts] = useLazyQuery(SEARCH_PRODUCTS_QUERY);
  const router = useRouter();
  const [productsData, setProductsData] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;
  const numberOfPages = Math.ceil(totalCount / pageSize);

  const fetchProducts = useCallback(async () => {
    setLoading(true);

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

      const fetchedProducts = [
        ...(data?.searchProducts?.results?.products || []),
      ];
      if (sortParam === "price.asc") {
        fetchedProducts.sort((a, b) => a.price - b.price);
      } else if (sortParam === "price.desc") {
        fetchedProducts.sort((a, b) => b.price - a.price);
      } else if (sortParam === "name.asc") {
        fetchedProducts.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortParam === "name.desc") {
        fetchedProducts.sort((a, b) => b.name.localeCompare(a.name));
      }

      setProductsData(fetchedProducts);
      setTotalCount(data?.searchProducts?.totalCount || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
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
    queryParam,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleNextPage = () => {
    if (page < numberOfPages) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPageNumbers = () => {
    const maxPagesToShow = 6;
    const pages: React.ReactNode[] = [];
    const startPage = Math.max(
      1,
      Math.min(
        page - Math.floor(maxPagesToShow / 2),
        numberOfPages - maxPagesToShow + 1,
      ),
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
          className={`flex items-center justify-center px-3 h-8 leading-tight cursor-pointer text-strongBeige border border-strongBeige hover:bg-strongBeige hover:text-white ${
            page === i
              ? "bg-strongBeige text-white"
              : "bg-white text-strongBeige"
          }`}
        >
          {i}
        </button>,
      );
    }

    if (numberOfPages > maxPagesToShow) {
      pages.push(
        <span
          key="more-pages"
          className="flex items-center justify-center px-3 h-8 text-strongBeige border border-strongBeige"
        >
          ...
        </span>,
      );
    }

    return pages;
  };

  return (
    <>
      {loading ? ( 
        <Loading />
      ) : (
        <div className="flex flex-col justify-between items-center  h-full bg-white ">
          {!!queryParam && (
            <h1 className="text-xl font-bold text-strongBeige mt-10 mb-10">
              {productsData.length} résultats trouvé pour "{queryParam}"
            </h1>
          )}
          {productsData.length > 0 ? (
            <>
              <div
                className={`${
                  view === 3
                    ? "md:grid-cols-2 lg:grid-cols-3 grid-cols-1 xl:grid-cols-4 "
                    : view === 2
                      ? "md:grid-cols-2 lg:grid-cols-3"
                      : view === 1
                        ? " grid-cols-1 "
                        : ""
                } w-full py-5 grid  px-10 justify-items-center items-center gap-4 relative    `}
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
            </>
          ) : (
            productsData.length > 0 &&
            !!searchParams?.getAll("") && (
              <div className="border shadow-md p-3  py-5 text-center md:mt-36 h-36 md:h-fit flex items-center flex-col justify-center ">
                <p className="  font-light  tracking-wider">
                  Désolé, mais de nombreux produits ne sont pas disponibles avec
                  cette option de filtrage.
                </p>
                <IoMdArrowDropdown size={20} />

                <button
                  className="hover:text-strongBeige gap-2 flex items-center justify-center transition-colors"
                  onClick={() => {
                    router.push("/Collections/tunisie", { scroll: true });
                  }}
                >
                  <FaRegTrashAlt />
                  <p>Réinitialiser les filtres</p>
                </button>
              </div>
            )
          )}
          {productsData.length === 0 && (
            <div className="border shadow-md p-3  py-5 text-center md:mt-36 h-36 md:h-fit flex items-center flex-col justify-center ">
              <p className="  font-light  tracking-wider">
                Désolé, mais de nombreux produits ne sont actuellement
                disponibles.
              </p>
            </div>
          )}
          {productsData.length > 0 && (
            <div className="Page pagination justify-self-start h-32">
              <ul className="inline-flex -space-x-px text-sm">
                <li>
                  <button
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    className={`flex items-center justify-center px-3 h-8 leading-tight text-strongBeige bg-white border border-strongBeige rounded-s-lg  ${page !== 1 && "hover:bg-strongBeige hover:text-white"} `}
                  >
                    Previous
                  </button>
                </li>
                {renderPageNumbers()}
                <li>
                  <button
                    onClick={handleNextPage}
                    disabled={page === Math.ceil(totalCount / pageSize)}
                    className={`flex items-center justify-center px-3 h-8 leading-tight text-strongBeige bg-white border border-strongBeige rounded-e-lg  ${page !== Math.ceil(totalCount / pageSize) && "hover:bg-strongBeige hover:text-white"} `}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ProductsSection;
