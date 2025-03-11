"use client";
import { SEARCH_PRODUCTS_QUERY } from "@/graphql/queries";
import { useLazyQuery } from "@apollo/client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { useAllProductViewStore, useSidebarStore } from "@/app/store/zustand";
import ProductBox from "../../../components/ProductBox/ProductBox";
import CollectionToolbar from "../components/CollectionToolbar";

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
    pagination: {
      currentPage: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
};

const ProductsSection: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { view } = useAllProductViewStore();
  const [searchProducts,] = useLazyQuery<SearchProductsResult>(SEARCH_PRODUCTS_QUERY);
  const { toggleOpenSidebar } = useSidebarStore();

  const [categoryDescription, setCategoryDescription] = useState<string>("");
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(
    Number(searchParams?.get("page")) || 1
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const lastProductRef = useRef<HTMLDivElement | null>(null);
  const prevParamsRef = useRef<string>("");
  const currentPageRef = useRef(currentPage);

  // Constants
  const pageSize = 12;
  const sort = searchParams?.get("sort") || undefined;

  // Update URL with current page
  const updateURL = useCallback((page: number) => {
    const newSearchParams = new URLSearchParams(searchParams?.toString());
    newSearchParams.set("page", page.toString());
    router.push(`${window.location.pathname}?${newSearchParams.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const getSearchParams = useCallback(() => {
    const sortParam = searchParams?.get("sort");

    return {
      query: searchParams?.get("query") || undefined,
      categoryName: searchParams?.get("category") || undefined,
      colorName: searchParams?.get("color") || undefined,
      maxPrice: searchParams?.get("price") ? +searchParams.get("price")! : undefined,
      choice: searchParams?.get("choice") || undefined,
      brandName: searchParams?.get("brand") || undefined,
      sortBy: sortParam?.split(".")[0],
      sortOrder: sortParam?.split(".")[1]
    };
  }, [searchParams]);


  const fetchProducts = useCallback(async (pageToFetch: number, shouldAppend: boolean = false) => {
    // Prevent multiple simultaneous fetches
    if (isLoading || (!hasMore && shouldAppend)) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get current search parameters
      const params = getSearchParams();

      // Fetch products from the API
      const { data } = await searchProducts({
        variables: {
          input: {
            ...params,
            minPrice: 1,
            page: pageToFetch,
            pageSize,
          },
        },
      });
      // Extract fetched products and total count from the API response
      const fetchedProducts = data?.searchProducts?.results?.products || [];
      const pagination = data?.searchProducts?.pagination || {
        currentPage: pageToFetch,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      // Update products data based on whether we're appending or replacing
      if (shouldAppend) {
        setProductsData((prev) => [...prev, ...fetchedProducts]);
      } else {
        setProductsData(fetchedProducts);
      }
      // Update the total count of products
      setTotalCount(data?.searchProducts?.totalCount || 0);

      // Determine if there are more products to load
      setHasMore(pagination.hasNextPage);


      // Update the category description if it's the first page
      if (fetchedProducts.length > 0 && !shouldAppend) {
        setCategoryDescription(fetchedProducts[0]?.categories[0]?.description || "");
      }

      // Update the URL with the current page number
      updateURL(pageToFetch);

      // Update the current page state after a successful fetch
      setCurrentPage(pageToFetch);
    } catch (error) {
      // Handle errors during the fetch process
      setError("Error loading products. Please try again.");
      console.error("Error fetching products:", error);
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  }, [
    searchProducts,
    getSearchParams,
    pageSize,
    sort,
    updateURL,
    productsData.length,
    isLoading,
    hasMore,
  ]);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  // Modify the Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry?.isIntersecting && hasMore && !isLoading) {
          const nextPage = currentPageRef.current + 1;
          fetchProducts(nextPage, true);
        }
      },
      { root: null, rootMargin: '200px', threshold: 0.1 }
    );

    const lastProduct = lastProductRef.current;
    if (lastProduct) {
      observer.observe(lastProduct);
    }

    return () => {
      if (lastProduct) {
        observer.unobserve(lastProduct);
      }
    };
  }, [hasMore, isLoading, fetchProducts]);
  // Reset state when search params (except page) change
  useEffect(() => {
    const currentParams = { ...getSearchParams(), sort: searchParams?.get("sort") };
    const paramsString = JSON.stringify(currentParams);

    if (prevParamsRef.current !== paramsString) {
      // Reset all states
      setProductsData([]);
      setCurrentPage(1);
      currentPageRef.current = 1;
      setHasMore(true);
      setError(null);

      // Fetch fresh data
      fetchProducts(1, false);
      prevParamsRef.current = paramsString;
    }
  }, [getSearchParams, fetchProducts]);

  // Handle clearing all filters
  const handleClearFilters = useCallback(() => {
    router.push("/Collections/tunisie?page=1");
  }, [router]);

  // Memoize grid classes based on view
  const gridClasses = useMemo(() => {
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
  }, [view]);

  // Memoize product classes based on view
  const productClasses = useMemo(() => {
    switch (view) {
      case 3:
      case 2:
        return "flex-col items-center justify-between";
      case 1:
        return "flex-row h-52 gap-8 items-center justify-between pl-2";
      default:
        return "";
    }
  }, [view]);




  const renderProducts = () => (
    <div className={`grid w-full gap-2 md:gap-4 ${gridClasses}`}>
      {productsData.map((product, index) => (
        <div
          key={product.id}
          className={`group flex relative w-full overflow-hidden ${productClasses}`}
          ref={index === productsData.length - 1 ? lastProductRef : null}
        >
          <ProductBox product={product} />
        </div>
      ))}
      {isLoading && (
        <div className="col-span-full flex justify-center py-4">
          <div className="w-8 h-8 border-4 border-primaryColor border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col justify-between items-center h-full pb-10">
      {productsData.length > 0 ? (
        <>
          {searchParams?.get("category") && categoryDescription !== "" && (
            <p className="bg-white hidden md:block tracking-wider text-sm md:text-[15px] leading-7 px-2 md:px-7 text-gray-800 mb-5 py-2">
              {categoryDescription}
            </p>
          )}
          <CollectionToolbar numberOfProduct={totalCount} />
          {renderProducts()}
          {error && (
            <div className="text-red-500 mt-4 text-center">
              {error}
            </div>
          )}
        </>
      ) : isLoading ? (
        <div role="status" className="w-full h-screen absolute bg-gray-200 flex items-center justify-center">
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

      <button
        type="button"
        className="fixed left-1/2 -translate-x-1/2 bottom-[90px] 
        bg-red-500 rounded-full w-20 h-11 
        shadow-lg transition-transform hover:scale-105 md:hidden
        hover:bg-red-600 z-50"
        onClick={toggleOpenSidebar}
        aria-label="Open filters"
      >
        <span className="text-white font-medium">Filters</span>
      </button>
    </div>
  );
};

export default ProductsSection;