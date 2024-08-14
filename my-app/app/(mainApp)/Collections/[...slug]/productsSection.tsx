"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLazyQuery } from "@apollo/client";
import { SEARCH_PRODUCTS_QUERY } from "@/graphql/queries";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";

import { useAllProductViewStore } from "@/app/store/zustand";
import Loading from "../loading";
import Pagination from "../components/Paginations";
import ProductBox from "../../../components/ProductBox/ProductBox";

const ProductsSection = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { view } = useAllProductViewStore();
  const [searchProducts] = useLazyQuery(SEARCH_PRODUCTS_QUERY);

  const [productsData, setProductsData] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams?.get("page")) || 1,
  );

  const pageSize = 12;
  const totalPages = Math.ceil(totalCount / pageSize);

  const sort = searchParams?.get("sort") || undefined;
  const getSearchParams = useCallback(
    () => ({
      query: searchParams?.get("query") || undefined,
      categoryId: searchParams?.get("category") || undefined,
      colorId: searchParams?.get("color") || undefined,
      maxPrice: searchParams?.get("price")
        ? +searchParams.get("price")!
        : undefined,
      choice: searchParams?.get("choice") || undefined,
      brandId: searchParams?.get("brand") || undefined,
    }),
    [searchParams],
  );
  const sortProducts = (products: any[], sortParam: string) => {
    return [...products].sort((a, b) => {
      switch (sortParam) {
        case "price.asc":
          return a.price - b.price;
        case "price.desc":
          return b.price - a.price;
        case "name.asc":
          return a.name.localeCompare(b.name);
        case "name.desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  };
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = getSearchParams();

    try {
      const { data } = await searchProducts({
        variables: {
          input: {
            ...params,
            minPrice: 1,
            page: currentPage,
            pageSize,
            visibleProduct: true,
          },
        },
      });

      let fetchedProducts = [
        ...(data?.searchProducts?.results?.products || []),
      ];

      if (sort) {
        fetchedProducts = sortProducts(fetchedProducts, sort);
      }
      setProductsData(fetchedProducts);
      setTotalCount(data?.searchProducts?.totalCount || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [searchProducts, getSearchParams, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams?.toString());
    newSearchParams.set("page", currentPage.toString());
    router.push(`${window.location.pathname}?${newSearchParams.toString()}`);
  }, [currentPage, router, searchParams]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () => {
    router.push("/Collections/tunisie", { scroll: true });
  };

  const renderProducts = () => (
    <div className={`grid w-full py-5 px-10 gap-4 ${getGridClasses()}`}>
      {productsData.map((product) => (
        <div
          key={product.id}
          className={`bg-white group flex relative w-full overflow-hidden border border-gray-100 shadow-md ${getProductClasses()}`}
        >
          <ProductBox product={product} />
        </div>
      ))}
    </div>
  );

  const getGridClasses = () => {
    switch (view) {
      case 3:
        return "md:grid-cols-2 lg:grid-cols-3 grid-cols-1 xl:grid-cols-4";
      case 2:
        return "md:grid-cols-2 lg:grid-cols-3";
      case 1:
        return "grid-cols-1";
      default:
        return "";
    }
  };

  const getProductClasses = () => {
    switch (view) {
      case 3:
      case 2:
        return "flex-col items-center justify-between h-[400px]";
      case 1:
        return "flex-row h-52 gap-8 items-center justify-between pl-2";
      default:
        return "";
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col justify-between items-center h-full pb-10">
      {productsData.length > 0 ? (
        renderProducts()
      ) : (
        <div className="border bg-white shadow-md p-3 py-5 text-center md:mt-36 h-36 md:h-fit flex items-center flex-col justify-center">
          <p className="font-light tracking-wider">
            Désolé, mais de nombreux produits ne sont pas disponibles avec cette
            option de filtrage.
          </p>
          <IoMdArrowDropdown size={20} />
          <button
            type="button"
            className="hover:text-primaryColor gap-2 flex items-center justify-center transition-colors"
            onClick={handleClearFilters}
          >
            <FaRegTrashAlt />
            <p>Réinitialiser les filtres</p>
          </button>
        </div>
      )}

      {productsData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ProductsSection;
