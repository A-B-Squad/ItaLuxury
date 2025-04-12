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
  const [searchProducts] = useLazyQuery<SearchProductsResult>(SEARCH_PRODUCTS_QUERY);
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
            visibleProduct: true,
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

  // Enhanced loading indicator with subtle animation
  const LoadingIndicator = () => (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center transition-opacity duration-300">
      <div className="w-16 h-16 relative">
        <div className="absolute inset-0 border-2 border-gray-100 rounded-full"></div>
        <div className="absolute inset-0 border-t-2 border-primaryColor rounded-full animate-spin"></div>
        <div className="absolute inset-0 border-t-2 border-primaryColor/30 rounded-full animate-pulse"></div>
      </div>
      <p className="mt-6 text-gray-700 font-light tracking-wider uppercase text-sm">Chargement</p>
    </div>
  );

  // Refined empty state component
  const EmptyState = () => (
    <div className="border bg-white shadow-sm rounded-lg p-8 py-10 text-center md:mt-24 w-full max-w-lg mx-auto flex items-center flex-col justify-center">
      <div className="mb-4 text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-800 mb-2">Aucun produit trouvé</h3>
      <p className="font-light tracking-wider text-gray-600 mb-6">
        Désolé, mais aucun produit ne correspond à vos critères de recherche.
      </p>
      <button
        type="button"
        className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-800 rounded-md border border-gray-200 transition-colors"
        onClick={handleClearFilters}
      >
        <FaRegTrashAlt className="text-gray-500" />
        <span>Réinitialiser les filtres</span>
      </button>
    </div>
  );

  const renderProducts = () => (
    <div className={`grid w-full gap-3 md:gap-6 ${gridClasses}`}>
      {productsData.map((product, index) => (
        <div
          key={product.id}
          className={`group flex relative w-full overflow-hidden bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 ${productClasses}`}
          ref={index === productsData.length - 1 ? lastProductRef : null}
        >
          <ProductBox product={product} />
        </div>
      ))}
      {isLoading && productsData.length > 0 && (
        <div className="col-span-full py-8 flex justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="w-4 h-4 rounded-full bg-gray-300 animate-pulse delay-150"></div>
            <div className="w-4 h-4 rounded-full bg-gray-400 animate-pulse delay-300"></div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col justify-between items-center h-full pb-10 w-full">
      {isLoading && productsData.length === 0 ? (
        <LoadingIndicator />
      ) : productsData.length > 0 ? (
        <>
          {searchParams?.get("category") && categoryDescription !== "" && (
            <div className="bg-white hidden md:block w-full rounded-md shadow-sm mb-6 border-l-4 border-primaryColor overflow-hidden">
              <div className="px-6 py-5">
                <h2 className="text-lg font-medium text-gray-800 mb-2">
                  {searchParams?.get("category")}
                </h2>
                <p className="tracking-wide text-base leading-relaxed text-gray-700 font-normal">
                  {categoryDescription}
                </p>
              </div>
            </div>
          )}
          <CollectionToolbar numberOfProduct={totalCount} />
          <div className="w-full mt-6">
            {renderProducts()}
          </div>
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-md mt-6 text-center max-w-md mx-auto">
              {error}
            </div>
          )}
        </>
      ) : (
        <EmptyState />
      )}

      <button
        type="button"
        className="fixed left-1/2 -translate-x-1/2 bottom-[90px] 
        bg-primaryColor text-white rounded-full px-6 py-2.5
        shadow-lg transition-all hover:shadow-xl md:hidden
        hover:bg-primaryColor/90 z-50 flex items-center gap-2"
        onClick={toggleOpenSidebar}
        aria-label="Open filters"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span className="font-medium">Filtres</span>
      </button>
    </div>
  );
};

export default ProductsSection;