"use client"
import React, { ChangeEvent, useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useLazyQuery } from "@apollo/client";
import {
  SEARCH_PRODUCTS_QUERY,
} from "../../../graphql/queries";
import { CiSearch } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";

import { useRouter, usePathname } from "next/navigation";

import { trackSearch } from "@/utils/facebookEvents";

// Helper: Prepare user data for tracking
const prepareUserData = (userData: any) => {
  if (!userData) return undefined;

  return {
    id: userData.id,
    email: userData.email,
    firstName: userData.fullName?.split(' ')[0] || userData.fullName,
    lastName: userData.fullName?.split(' ').slice(1).join(' ') || '',
    phone: userData.number,
    country: "tn",
    city: userData.city || "",
  };
};

// Helper: Execute search query
const executeSearch = (searchProducts: any, query: string) => {
  searchProducts({
    variables: {
      input: {
        query: query,
        page: 1,
        pageSize: 15,
        visibleProduct: true,
        sortOrder: "asc",
        sortBy: "name"
      },
    },
    fetchPolicy: "cache-and-network",
    onError: (err: any) => {
      console.error("Error fetching search results:", err);
    },
  });
};

// Helper: Create debounced search function
const createDebouncedSearch = (searchProducts: any, delay: number = 350) => {
  let timer: any;

  return (query: string) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (query.trim().length > 1) {
        executeSearch(searchProducts, query);
      }
    }, delay);
  };
};

const SearchBar = ({ userData }: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchProducts, { data, loading }] = useLazyQuery(SEARCH_PRODUCTS_QUERY);

  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Track search with debouncing
  const trackSearchEvent = useCallback(async (query: string, resultsCount?: number) => {
    if (query.trim().length < 2) return;

    try {
      const user = prepareUserData(userData);

      console.log('🔍 Tracking Search event:', {
        query: query,
        results_count: resultsCount,
        user: user ? 'logged_in' : 'guest'
      });

      await trackSearch(query, user, resultsCount);
      console.log('✅ Search event tracked successfully');
    } catch (error) {
      console.error("❌ Error tracking search:", error);
    }
  }, [userData]);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedOutside =
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node);

      if (clickedOutside) {
        setSearching(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset search state on route change
  useEffect(() => {
    setSearching(false);
  }, [pathname]);

  // Track search when results are loaded
  useEffect(() => {
    if (data && searchQuery.trim().length > 1) {
      const totalResults = (data.searchProducts.results.categories?.length || 0) +
        (data.searchProducts.results.products?.length || 0);

      if (totalResults > 0) {
        trackSearchEvent(searchQuery, totalResults);
      }
    }
  }, [data, searchQuery, trackSearchEvent]);

  // Memoize debounced search function
  const debouncedSearch = useMemo(
    () => createDebouncedSearch(searchProducts),
    [searchProducts]
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchQuery(inputValue);

    if (inputValue.trim().length > 1) {
      setSearching(true);
      debouncedSearch(inputValue);
    } else if (inputValue.trim() === "") {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearching(false);
    inputRef.current?.focus();
  };

  const getResultsCount = useCallback(() => {
    return (data?.searchProducts.results.categories?.length || 0) +
      (data?.searchProducts.results.products?.length || 0);
  }, [data]);

  const handleViewAllResults = useCallback(() => {
    if (searchQuery.trim().length > 0) {
      trackSearchEvent(searchQuery, getResultsCount());
      router.push(`/Collections?query=${encodeURIComponent(searchQuery)}`);
      setSearching(false);
    }
  }, [router, searchQuery, trackSearchEvent, getResultsCount]);

  const handleCategoryClick = useCallback((categoryName: string) => {
    trackSearchEvent(searchQuery, getResultsCount());
    setSearching(false);
  }, [searchQuery, trackSearchEvent, getResultsCount]);

  const handleProductClick = useCallback(() => {
    trackSearchEvent(searchQuery, getResultsCount());
    setSearching(false);
  }, [searchQuery, trackSearchEvent, getResultsCount]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim().length > 0) {
      trackSearchEvent(searchQuery, getResultsCount());
      handleViewAllResults();
    } else if (e.key === 'Escape') {
      setSearching(false);
    }
  };

  // Memoize search results
  const searchResults = useMemo(() => {
    if (!data) return null;

    return {
      categories: data.searchProducts.results.categories || [],
      products: data.searchProducts.results.products || []
    };
  }, [data]);

  const hasNoResults = searchResults &&
    searchResults.categories.length === 0 &&
    searchResults.products.length === 0 &&
    !loading;

  const hasResults = searchResults &&
    (searchResults.categories.length > 0 || searchResults.products.length > 0);

  return (
    <div className="search-container relative w-full max-w-2xl mx-auto ">
      {/* Search Input */}
      <div className="relative  flex items-center bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md focus-within:shadow-md focus-within:border-primaryColor transition-all duration-200 h-12 px-4 overflow-hidden">
        <CiSearch className="text-gray-400 w-5 h-5 flex-shrink-0" />

        <input
          ref={inputRef}
          className="w-full h-full outline-none text-gray-700 placeholder-gray-400 text-base font-medium px-3"
          type="text"
          placeholder="Recherchez meubles, déco, cuisine, salle de bain..."
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => searchQuery.trim().length > 1 && setSearching(true)}
          onKeyDown={handleKeyDown}
          aria-label="Search products"
          autoComplete="off"
        />

        {searchQuery && (
          <button
            onClick={clearSearch}
            className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Clear search"
          >
            <IoCloseOutline className="text-gray-500 w-5 h-5" />
          </button>
        )}

        <button
          className="flex items-center justify-center ml-2 px-4 h-8 rounded-full bg-logoColor hover:bg-amber-200 transition-colors duration-200 flex-shrink-0"
          onClick={handleViewAllResults}
          aria-label="Search"
          disabled={searchQuery.trim().length < 2}
        >
          <span className="text-white text-sm font-medium">Rechercher</span>
        </button>
      </div>

      {/* Search Results Dropdown */}
      {searchResults && searching && (
        <>
          <div
            className="fixed inset-0 bg-transparent z-40"
            onClick={() => setSearching(false)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setSearching(false);
              }
            }}
            aria-label="Close search results"
          />

          <div
            ref={dropdownRef}
            className="absolute w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-[480px] overflow-y-auto"
            style={{
              zIndex: 9999,
              position: 'absolute',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="p-4 space-y-4">
              {/* Categories Section */}
              {searchResults.categories.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Catégories ({searchResults.categories.length})
                  </h3>
                  <ul className="space-y-1">
                    {searchResults.categories.map((category: any) => (
                      <Link
                        key={category.id}
                        href={`/Collections?${new URLSearchParams(
                          { category: category.name }
                        )}`}
                        onClick={() => handleCategoryClick(category.name)}
                      >
                        <li className="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150 text-sm font-medium flex items-center relative z-10">
                          <CiSearch className="mr-2 text-gray-400" />
                          {category.name}
                        </li>
                      </Link>
                    ))}
                  </ul>
                </div>
              )}

              {/* Products Section */}
              {searchResults.products.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Produits ({searchResults.products.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {searchResults.products.map((product: any) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={handleProductClick}
                        className="group flex items-start p-3 space-x-3 bg-white hover:bg-gray-50 rounded-lg transition-colors duration-150 border border-gray-100 relative z-10"
                      >
                        <div className="relative flex-shrink-0 w-20 h-20 rounded-lg bg-gray-50 overflow-hidden">
                          {product.images && product.images[0] ? (
                            <Image
                              sizes="80px"
                              src={product.images[0]}
                              style={{ objectFit: "cover" }}
                              className="group-hover:scale-105 transition-transform duration-200"
                              quality={85}
                              alt={product.name}
                              width={80}
                              height={80}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <span className="text-gray-400 text-xs">No image</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                            {product.name}
                          </p>
                          <div className="flex items-baseline space-x-2">
                            <span className="text-base font-bold text-primaryColor">
                              {(
                                product.productDiscounts.length > 0
                                  ? product.productDiscounts[0].newPrice
                                  : product.price
                              ).toFixed(3)} TND
                            </span>
                            {product.productDiscounts.length > 0 && (
                              <span className="text-sm text-gray-400 line-through">
                                {product.price.toFixed(3)} TND
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {hasNoResults && (
                <div className="py-8 text-center">
                  <p className="text-gray-500">Aucun résultat trouvé pour "{searchQuery}"</p>
                </div>
              )}

              {/* Show More Button */}
              {hasResults && (
                <button
                  className="w-full py-3 text-sm font-semibold text-white bg-primaryColor hover:bg-amber-200 rounded-lg transition-colors duration-200 relative z-10"
                  onClick={handleViewAllResults}
                >
                  Voir tous les résultats
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(SearchBar);