"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLazyQuery } from "@apollo/client";
import { SEARCH_PRODUCTS_QUERY } from "@/graphql/queries";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";

import { useAllProductViewStore } from "@/app/store/zustand";
import Pagination from "../components/Paginations";
import ProductBox from "../../../components/ProductBox/ProductBox";
import TopBar from "../components/topBar";

// Define types for clarity
type Product = {
  id: string;
  name: string;
  price: number;
  categories: { description: string }[];
};

type SearchProductsResult = {
  searchProducts: {
    results: {
      products: Product[];
    };
    totalCount: number;
  };
};

const ProductsSection: React.FC = () => {
  // Initialize hooks and state
  const searchParams = useSearchParams();
  const router = useRouter();
  const { view } = useAllProductViewStore();
  const [searchProducts, { loading }] = useLazyQuery<SearchProductsResult>(
    SEARCH_PRODUCTS_QUERY,
  );

  const [productsData, setProductsData] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(
    Number(searchParams?.get("page")) || 1,
  );
  const [categoryDescription, setCategoryDescription] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(true);

  // Constants
  const pageSize = 12;
  const totalPages = Math.ceil(totalCount / pageSize);
  const sort = searchParams?.get("sort") || undefined;

  // Utility functions
  const getSearchParams = useCallback(() => {
    return {
      query: searchParams?.get("query") || undefined,
      categoryName: searchParams?.get("category") || undefined,
      colorName: searchParams?.get("color") || undefined,
      maxPrice: searchParams?.get("price")
        ? +searchParams.get("price")!
        : undefined,
      choice: searchParams?.get("choice") || undefined,
      brandName: searchParams?.get("brand") || undefined,
    };
  }, [searchParams]);

  const sortProducts = (products: Product[], sortParam: string): Product[] => {
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

  // Data fetching function
  const fetchProducts = useCallback(async () => {
    const params = getSearchParams();
    setIsSearching(true);

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

      setCategoryDescription(
        fetchedProducts[0]?.categories[0]?.description || "",
      );
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsSearching(false);
    }
  }, [searchProducts, getSearchParams, currentPage, sort]);

  // Effects
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams?.toString());
    newSearchParams.set("page", currentPage.toString());
    router.push(`${window.location.pathname}?${newSearchParams.toString()}`);
  }, [currentPage, router, searchParams]);

  // Event handlers
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () => {
    router.push("/Collections/tunisie?page=1&section=Boutique", {
      scroll: true,
    });
  };

  // Render helpers
  const getGridClasses = (): string => {
    switch (view) {
      case 3:
        return "grid-cols-2 lg:grid-cols-3 grid-cols-1 xl:grid-cols-4";
      case 2:
        return "grid-cols-2 lg:grid-cols-3";
      case 1:
        return "grid-cols-1";
      default:
        return "";
    }
  };

  const getProductClasses = (): string => {
    switch (view) {
      case 3:
      case 2:
        return "flex-col items-center justify-between h-[344px]";
      case 1:
        return "flex-row h-52 gap-8 items-center justify-between pl-2";
      default:
        return "";
    }
  };

  const renderProducts = () => (
    <div className={`grid w-full gap-4 ${getGridClasses()}`}>
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

  // Render component
  return (
    <div className="flex flex-col justify-between items-center h-full pb-10">
      {productsData.length > 0 && !loading ? (
        <>
          {searchParams?.get("category") && categoryDescription !== "" && (
            <p className="bg-white tracking-wider text-sm md:text-[15px] leading-7 px-2 md:px-7 text-gray-800 mb-5 py-2">
              {categoryDescription}
            </p>
          )}
          <TopBar numberOfProduct={productsData.length} />

          {renderProducts()}
        </>
      ) : isSearching || loading ? (
        <div
          role="status "
          className="
        w-full h-screen absolute bg-gray-200  flex items-center justify-center"
        >
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-[#c7ae91]"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
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
