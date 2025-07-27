import React, { ChangeEvent, useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  FETCH_USER_BY_ID,
  SEARCH_PRODUCTS_QUERY,
} from "../../../graphql/queries";
import { CiSearch } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import Link from "next/link";
import Image from "next/legacy/image";
import { useRouter, usePathname } from "next/navigation";
import prepRoute from "../../Helpers/_prepRoute";
import triggerEvents from "@/utlils/trackEvents";
import { normalizeText } from "@/app/Helpers/_normalizeText";
import { sendGTMEvent } from "@next/third-parties/google";
import { useAuth } from "@/lib/auth/useAuth";
import { debounce } from "lodash";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { decodedToken, isAuthenticated } = useAuth();
  const [searchProducts, { data, loading }] = useLazyQuery(SEARCH_PRODUCTS_QUERY);

  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: userData } = useQuery(FETCH_USER_BY_ID, {
    variables: { userId: decodedToken?.userId },
    skip: !isAuthenticated,
    fetchPolicy: "cache-first"
  });

  // Memoize user data for analytics
  const analyticsUserData = useMemo(() => ({
    em: userData?.fetchUsersById?.email ? [userData.fetchUsersById.email.toLowerCase()] : [],
    fn: userData?.fetchUsersById?.fullName ? [userData.fetchUsersById.fullName] : [],
    ph: userData?.fetchUsersById?.number ? [userData.fetchUsersById.number] : [],
    country: ["tn"],
    external_id: userData?.fetchUsersById?.id || null
  }), [userData]);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only apply this logic on desktop/laptop devices
      if (window.innerWidth >= 768) { // 768px is the standard md breakpoint in Tailwind
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node) &&
          !inputRef.current?.contains(event.target as Node) &&
          !mobileInputRef.current?.contains(event.target as Node)
        ) {
          setSearching(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset search state on route change
  useEffect(() => {
    setSearching(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  // Improved debounced search function with better performance
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim().length > 1) {
        searchProducts({
          variables: {
            input: {
              query: normalizeText(query),
              page: 1,
              pageSize: 15,
              visibleProduct: true,
            },
          },
          fetchPolicy: "network-only", // Ensure fresh results
          onError: (err) => {
            console.error("Error fetching search results:", err);
          },
        });
      }
    }, 350), // Slightly increased debounce time for better performance
    [searchProducts]
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchQuery(inputValue);

    if (inputValue.trim().length > 1) {
      setSearching(true);
      debouncedSearch(inputValue);
    } else if (inputValue.trim() === "") {
      // Clear results when input is empty
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearching(false);
    inputRef.current?.focus();
  };

  const handleViewAllResults = useCallback(() => {
    if (searchQuery.trim().length > 0) {
      router.push(`/Collections/tunisie?query=${encodeURIComponent(searchQuery)}`);
      setSearching(false);

      // Track search event
      sendGTMEvent({
        event: "search",
        search_term: searchQuery,
        user_data: analyticsUserData
      });
    }
  }, [router, searchQuery, analyticsUserData]);

  const handleCategoryClick = useCallback((category: any) => {
    triggerEvents("SelectSearchedCategory", {
      user_data: analyticsUserData,
      custom_data: {
        category_name: category.name,
        category_id: category.id,
      },
    });

    sendGTMEvent({
      event: "select_content",
      content_type: "category",
      item_id: category.id,
      item_name: category.name,
      user_data: analyticsUserData,
      facebook_data: {
        content_type: "category",
        category_name: category.name,
        category_id: category.id
      }
    });

    setSearching(false);
  }, [analyticsUserData]);

  const handleProductClick = useCallback((product: any) => {
    const productPrice = product.productDiscounts.length > 0
      ? product.productDiscounts[0].newPrice
      : product.price;

    triggerEvents("SelectSearchedProduct", {
      user_data: analyticsUserData,
      custom_data: {
        product_name: product.name,
        product_id: product.id,
        product_price: productPrice,
        product_category: product.categories[0]?.name,
        currency: "TND",
      },
    });

    sendGTMEvent({
      event: "select_item",
      ecommerce: {
        currency: "TND",
        items: [{
          item_id: product.id,
          item_name: product.name,
          item_category: product.categories[0]?.name,
          price: productPrice
        }]
      },
      user_data: analyticsUserData,
      facebook_data: {
        product_name: product.name,
        product_id: product.id,
        product_price: productPrice,
        product_category: product.categories[0]?.name,
        currency: "TND"
      }
    });

    setSearching(false);
  }, [analyticsUserData]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim().length > 0) {
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

  // Toggle mobile search
  const toggleMobileSearch = () => {
    setMobileSearchOpen(!mobileSearchOpen);
    // Focus the input when opening
    if (!mobileSearchOpen) {
      setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 100);
    }
  };

  // Close mobile search
  const closeMobileSearch = () => {
    setMobileSearchOpen(false);
    setSearching(false);
    setSearchQuery("");
  };

  return (
    <>
      {/* Desktop Search - Hidden on mobile */}
      <div className="search-container relative w-full z-[100] max-w-2xl mx-auto hidden md:block">
        {/* Search Input */}
        <div className="flex items-center bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md focus-within:shadow-md focus-within:border-primaryColor transition-all duration-200 h-12 px-4 overflow-hidden">
          <CiSearch className="text-gray-400 w-5 h-5 flex-shrink-0" />

          <input
            ref={inputRef}
            className="w-full h-full outline-none text-gray-700 placeholder-gray-400 text-sm font-medium px-3"
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
            className="flex items-center justify-center ml-2 px-4 h-8 rounded-full bg-primaryColor hover:bg-amber-200 transition-colors duration-200 flex-shrink-0"
            onClick={handleViewAllResults}
            aria-label="Search"
            disabled={searchQuery.trim().length < 2}
          >
            <span className="text-white text-sm font-medium">Rechercher</span>
          </button>
        </div>

        {/* Desktop Search Results Dropdown */}
        {searchResults && searching && (
          <div
            ref={dropdownRef}
            className="absolute w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-[480px] overflow-y-auto"
            style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)'
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
                        href={`/Collections/tunisie/${prepRoute(category.name)}/?${new URLSearchParams(
                          { category: category.name }
                        )}`}
                        onClick={() => handleCategoryClick(category)}
                      >
                        <li className="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150 text-sm font-medium flex items-center">
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
                        href={`/products/tunisie?productId=${product.id}`}
                        onClick={() => handleProductClick(product)}
                        className="group flex items-start p-3 space-x-3 bg-white hover:bg-gray-50 rounded-lg transition-colors duration-150 border border-gray-100"
                      >
                        <div className="relative flex-shrink-0 w-20 h-20 rounded-lg bg-gray-50 overflow-hidden">
                          {product.images && product.images[0] ? (
                            <Image
                              layout="fill"
                              src={product.images[0]}
                              objectFit="contain"
                              className="group-hover:scale-105 transition-transform duration-200"
                              quality={85}
                              alt={product.name}
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
              {searchResults.categories.length === 0 && searchResults.products.length === 0 && !loading && (
                <div className="py-8 text-center">
                  <p className="text-gray-500">Aucun résultat trouvé pour "{searchQuery}"</p>
                </div>
              )}

              {/* Show More Button */}
              {(searchResults.categories.length > 0 || searchResults.products.length > 0) && (
                <button
                  className="w-full py-3 text-sm font-semibold text-white bg-primaryColor hover:bg-amber-200 rounded-lg transition-colors duration-200"
                  onClick={handleViewAllResults}
                >
                  Voir tous les résultats
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Search Icon - Visible only on mobile */}
      <div className="md:hidden">
        <button
          onClick={toggleMobileSearch}
          className=" rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Open search"
        >
          <CiSearch className="text-gray-700 text-xl" />
        </button>
      </div>

      {/* Mobile Search Overlay - Full screen */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 bg-white z-[200] flex flex-col md:hidden">
          <div className="flex items-center p-4 border-b border-gray-200">
            <button
              onClick={closeMobileSearch}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-2"
              aria-label="Close search"
            >
              <IoCloseOutline className="text-gray-700 w-6 h-6" />
            </button>

            <div className="flex-1 flex items-center bg-gray-100 rounded-full px-3 h-10">
              <CiSearch className="text-gray-500 w-5 h-5 flex-shrink-0" />
              <input
                ref={mobileInputRef}
                className="w-full h-full bg-transparent outline-none text-gray-700 placeholder-gray-500 text-sm font-medium px-2"
                type="text"
                placeholder="Recherchez des produits..."
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
                  className="p-1 rounded-full"
                  aria-label="Clear search"
                >
                  <IoCloseOutline className="text-gray-500 w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Search Results */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading && (
              <div className="space-y-4">
                <div className="h-5 bg-gray-200 rounded-md w-1/4 animate-pulse"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-md animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded-md w-1/2 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResults && searching && !loading && (
              <div className="space-y-6">
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
                          href={`/Collections/tunisie/${prepRoute(category.name)}/?${new URLSearchParams(
                            { category: category.name }
                          )}`}
                          onClick={() => {
                            handleCategoryClick(category);
                            closeMobileSearch();
                          }}
                        >
                          <li className="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150 text-sm font-medium flex items-center">
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
                    <div className="grid grid-cols-1 gap-3">
                      {searchResults.products.map((product: any) => (
                        <Link
                          key={product.id}
                          href={`/products/tunisie?productId=${product.id}`}
                          onClick={() => {
                            handleProductClick(product);
                            closeMobileSearch();
                          }}
                          className="group flex items-start p-3 space-x-3 bg-white hover:bg-gray-50 rounded-lg transition-colors duration-150 border border-gray-100"
                        >
                          <div className="relative flex-shrink-0 w-20 h-20 rounded-lg bg-gray-50 overflow-hidden">
                            {product.images && product.images[0] ? (
                              <Image
                                layout="fill"
                                src={product.images[0]}
                                objectFit="contain"
                                className="group-hover:scale-105 transition-transform duration-200"
                                quality={85}
                                alt={product.name}
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
                {searchResults.categories.length === 0 && searchResults.products.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-gray-500">Aucun résultat trouvé pour "{searchQuery}"</p>
                  </div>
                )}

                {/* Show More Button */}
                {(searchResults.categories.length > 0 || searchResults.products.length > 0) && (
                  <button
                    className="w-full py-3 text-sm font-semibold text-white bg-primaryColor hover:bg-amber-200 rounded-lg transition-colors duration-200"
                    onClick={() => {
                      handleViewAllResults();
                      closeMobileSearch();
                    }}
                  >
                    Voir tous les résultats
                  </button>
                )}
              </div>
            )}

            {/* Empty state when no search query */}
            {(!searchQuery || searchQuery.trim().length <= 1) && !loading && (
              <div className="py-8 text-center">
                <p className="text-gray-500">Commencez à taper pour rechercher des produits</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(SearchBar);