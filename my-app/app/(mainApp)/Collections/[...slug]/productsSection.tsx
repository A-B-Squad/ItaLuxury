"use client";
import { useAllProductViewStore, useSidebarStore } from "@/app/store/zustand";
import { SEARCH_PRODUCTS_QUERY } from "@/graphql/queries";
import { useLazyQuery } from "@apollo/client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useRef, useState, startTransition } from "react";
import { FaFilter } from "react-icons/fa";
import dynamic from "next/dynamic";

const ProductBox = dynamic(() => import("../../../components/ProductBox/ProductBox"), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-2xl h-96" />
});

const CollectionToolbar = dynamic(() => import("../components/CollectionToolbar"));
const CategoryHeader = dynamic(() => import("../components/CategoryHeader"));
const LoadingOverlay = dynamic(() => import("../components/LoadingOverlay"));
const ErrorDisplay = dynamic(() => import("../components/ErrorDisplay"));
const EmptyState = dynamic(() => import("../components/EmptyState"));
const LoadingDots = dynamic(() => import("../components/LoadingDots"));

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  categories: { description: string }[];
}

interface SearchProductsResult {
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
}

interface ProductsSectionProps {
  userData: any;
  initialData?: {
    products: Product[];
    totalCount: number;
    currentPage: number;
    hasMore: boolean;
    categoryDescription: string;
  } | null;
}

// Constants
const PAGE_SIZE = 12;
const INTERSECTION_MARGIN = '200px';
const INTERSECTION_THRESHOLD = 0.1;

const ProductsSection: React.FC<ProductsSectionProps> = ({ userData, initialData }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { view } = useAllProductViewStore();
  const [searchProducts] = useLazyQuery<SearchProductsResult>(SEARCH_PRODUCTS_QUERY, {
    fetchPolicy: 'cache-first',
  });
  const { toggleOpenSidebar } = useSidebarStore();

  // State management - simplified
  const [state, setState] = useState({
    categoryDescription: initialData?.categoryDescription || "",
    productsData: (initialData?.products as Product[]) || [],
    totalCount: initialData?.totalCount || 0,
    currentPage: initialData?.currentPage || Number(searchParams?.get("page")) || 1,
    isLoading: false,
    hasMore: typeof initialData?.hasMore === 'boolean' ? initialData?.hasMore : true,
    error: false,
    isInitialLoad: !(initialData && initialData.products?.length > 0),
  });

  const lastProductRef = useRef<HTMLDivElement | null>(null);
  const prevParamsRef = useRef<string>("");
  const currentPageRef = useRef(state.currentPage);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Update current page ref when state changes
  useEffect(() => {
    currentPageRef.current = state.currentPage;
  }, [state.currentPage]);

  // Memoized search parameters
  const searchParameters = useMemo(() => {
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

  // Check if there are any active search/filter parameters
  const hasActiveSearchParams = useMemo(() => {
    return !!(
      searchParameters.query ||
      searchParameters.categoryName ||
      searchParameters.colorName ||
      searchParameters.maxPrice ||
      searchParameters.choice ||
      searchParameters.brandName ||
      searchParameters.sortBy ||
      searchParameters.sortOrder
    );
  }, [searchParameters]);

  // Update URL with current page - using startTransition for non-urgent updates
  const updateURL = useCallback((page: number) => {
    startTransition(() => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());
      newSearchParams.set("page", page.toString());
      const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`;
      router.push(newUrl, { scroll: false });
    });
  }, [router, searchParams]);

  // Optimized state update function
  const updateState = useCallback((updates: Partial<typeof state>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Simplified fetch products function - removed scroll restoration complexity
  const fetchProducts = useCallback(async (pageToFetch: number, shouldAppend = false) => {
    if (state.isLoading || (!state.hasMore && shouldAppend)) return;

    updateState({ isLoading: true, error: false });

    try {
      const { data } = await searchProducts({
        variables: {
          input: {
            ...searchParameters,
            minPrice: 1,
            visibleProduct: true,
            page: pageToFetch,
            pageSize: PAGE_SIZE,
          },
        },
      });

      const fetchedProducts = data?.searchProducts?.results?.products || [];
      const pagination = data?.searchProducts?.pagination || {
        currentPage: pageToFetch,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      const newProductsData = shouldAppend
        ? [...state.productsData, ...fetchedProducts]
        : fetchedProducts;

      updateState({
        productsData: newProductsData,
        totalCount: data?.searchProducts?.totalCount || 0,
        hasMore: pagination.hasNextPage,
        currentPage: pageToFetch,
        categoryDescription: !shouldAppend && fetchedProducts.length > 0
          ? fetchedProducts[0]?.categories[0]?.description || ""
          : state.categoryDescription,
        error: false,
        isInitialLoad: false,
        isLoading: false,
      });

      updateURL(pageToFetch);

    } catch (error) {
      console.error("Error fetching products:", error);
      updateState({
        error: true,
        hasMore: false,
        isInitialLoad: false,
        isLoading: false,
      });
    }
  }, [searchProducts, searchParameters, state.productsData, state.isLoading, state.hasMore, state.categoryDescription, updateState, updateURL]);

  // Optimized intersection observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry?.isIntersecting && state.hasMore && !state.isLoading) {
          const nextPage = currentPageRef.current + 1;
          fetchProducts(nextPage, true);
        }
      },
      {
        root: null,
        rootMargin: INTERSECTION_MARGIN,
        threshold: INTERSECTION_THRESHOLD
      }
    );

    const lastProduct = lastProductRef.current;
    if (lastProduct && observerRef.current) {
      observerRef.current.observe(lastProduct);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [state.hasMore, state.isLoading, fetchProducts]);

  // Handle parameter changes
  useEffect(() => {
    const currentParams = { ...searchParameters, sort: searchParams?.get("sort") };
    const paramsString = JSON.stringify(currentParams);

    if (prevParamsRef.current !== paramsString) {
      updateState({
        productsData: [],
        currentPage: 1,
        hasMore: true,
        error: false,
        isInitialLoad: true,
      });

      currentPageRef.current = 1;
      fetchProducts(1, false);
      prevParamsRef.current = paramsString;
    }
  }, [searchParameters, searchParams, fetchProducts, updateState]);

  // Memoized grid classes
  const gridClasses = useMemo(() => {
    const baseClasses = "grid w-full gap-4 md:gap-6";
    switch (view) {
      case 3:
        return `${baseClasses} grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`;
      case 2:
        return `${baseClasses} grid-cols-2 lg:grid-cols-3`;
      case 1:
        return `${baseClasses} grid-cols-1`;
      default:
        return baseClasses;
    }
  }, [view]);

  const shouldShowEmptyState = !state.isLoading && state.productsData.length === 0 && !state.isInitialLoad;
  const shouldShowProducts = state.productsData.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {state.isLoading && state.productsData.length === 0 && <LoadingOverlay />}

      <div className="container mx-auto py-8">
        {shouldShowProducts ? (
          <>
            <CategoryHeader state={state} searchParams={searchParams} />
            {state.error && <ErrorDisplay />}

            <CollectionToolbar numberOfProduct={state.totalCount} />

            <div className="mt-8">
              <div className={gridClasses}>
                {state.productsData.map((product, index) => (
                  <div
                    key={`${product.id}-${index}`}
                    ref={index === state.productsData.length - 1 ? lastProductRef : null}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <ProductBox userData={userData} product={product} />
                  </div>
                ))}

                {state.isLoading && state.productsData.length > 0 && <LoadingDots />}
              </div>
            </div>
          </>
        ) : (
          shouldShowEmptyState && <EmptyState />
        )}

        {(hasActiveSearchParams || shouldShowProducts) && (
          <button
            onClick={toggleOpenSidebar}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 md:hidden
                     bg-primaryColor text-white px-6 py-3 rounded-full shadow-lg
                     transition-all hover:shadow-xl
                     flex items-center gap-2 font-medium"
            aria-label="Ouvrir les filtres"
          >
            <FaFilter className="w-4 h-4" />
            Filtres
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductsSection;