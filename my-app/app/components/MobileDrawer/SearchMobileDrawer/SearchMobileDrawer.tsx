"use client";

import { useDrawerMobileSearch } from "@/app/store/zustand";
import { useLazyQuery } from "@apollo/client";
import { Drawer } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoArrowBack, IoCloseOutline } from "react-icons/io5";
import { SEARCH_PRODUCTS_QUERY } from "../../../../graphql/queries";
import CategoriesList from "./Components/CategoriesList";
import EmptyState from "./Components/EmptyState";
import LoadingSkeleton from "./Components/LoadingSkeleton";
import NoResults from "./Components/NoResults";
import ProductsList from "./Components/ProductsList";



// Helper: Execute search query
const executeSearchQuery = (searchProducts: any, query: string) => {
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
                executeSearchQuery(searchProducts, query);
            }
        }, delay);
    };
};



const SearchMobileDrawer = () => {
    const { isOpen, closeDrawerMobileSearch } = useDrawerMobileSearch();
    const [searchQuery, setSearchQuery] = useState("");
    const [searching, setSearching] = useState(false);
    const [searchProducts, { data, loading }] = useLazyQuery(SEARCH_PRODUCTS_QUERY);

    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when drawer opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 300);
        }
    }, [isOpen]);

    // Reset search when drawer closes
    useEffect(() => {
        if (!isOpen) {
            setSearchQuery("");
            setSearching(false);
        }
    }, [isOpen]);

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

    const handleViewAllResults = useCallback(() => {
        if (searchQuery.trim().length > 0) {
            router.push(`/Collections?query=${encodeURIComponent(searchQuery)}`);
            closeDrawerMobileSearch();
        }
    }, [router, searchQuery, closeDrawerMobileSearch]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchQuery.trim().length > 0) {
            handleViewAllResults();
        } else if (e.key === 'Escape') {
            closeDrawerMobileSearch();
        }
    };

    const searchResults = useMemo(() => {
        if (!data) return null;

        return {
            categories: data.searchProducts.results.categories || [],
            products: data.searchProducts.results.products || []
        };
    }, [data]);

    const hasResults = searchResults &&
        (searchResults.categories.length > 0 || searchResults.products.length > 0);

    const hasNoResults = searchResults &&
        searchResults.categories.length === 0 &&
        searchResults.products.length === 0;

    const showEmptyState = (!searchQuery || searchQuery.trim().length <= 1) && !loading;

    return (
        <Drawer
            open={isOpen || false}
            onClose={closeDrawerMobileSearch}
            placement="right"
            size={400}
            className="p-0 overflow-hidden"
            overlayProps={{
                className: "fixed inset-0 bg-black/50"
            }}
            placeholder={null}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
        >
            <div className="h-full flex flex-col bg-white">
                {/* Header */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white flex-shrink-0">
                    <button
                        onClick={closeDrawerMobileSearch}
                        className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
                        aria-label="Close search"
                    >
                        <IoArrowBack className="w-6 h-6 text-gray-700" />
                    </button>

                    <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 h-12">
                        <CiSearch className="text-gray-400 w-5 h-5 flex-shrink-0" />
                        <input
                            ref={inputRef}
                            className="w-full h-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-base font-medium px-3"
                            type="text"
                            placeholder="Rechercher des produits..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onKeyDown={handleKeyDown}
                            aria-label="Search products"
                            autoComplete="off"
                        />
                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                className="p-1 rounded-full hover:bg-gray-200 transition-colors flex-shrink-0"
                                aria-label="Clear search"
                            >
                                <IoCloseOutline className="text-gray-500 w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4">
                        {/* Loading State */}
                        {loading && <LoadingSkeleton />}

                        {/* Search Results */}
                        {searchResults && searching && !loading && (
                            <div className="space-y-6">
                                {/* Categories */}
                                {searchResults.categories.length > 0 && (
                                    <CategoriesList
                                        categories={searchResults.categories}
                                        closeDrawer={closeDrawerMobileSearch}
                                    />
                                )}

                                {/* Products */}
                                {searchResults.products.length > 0 && (
                                    <ProductsList
                                        products={searchResults.products}
                                        closeDrawer={closeDrawerMobileSearch}
                                    />
                                )}

                                {/* No Results */}
                                {hasNoResults && <NoResults searchQuery={searchQuery} />}
                            </div>
                        )}

                        {/* Empty State */}
                        {showEmptyState && <EmptyState />}
                    </div>

                    {/* View All Results Button */}
                    {hasResults && searching && !loading && (
                        <div className="sticky bottom-0 bg-white p-4 border-t border-gray-100">
                            <button
                                className="w-full py-3.5 text-base font-semibold text-white bg-primaryColor hover:bg-amber-200 active:bg-amber-300 rounded-xl transition-colors duration-200"
                                onClick={handleViewAllResults}
                            >
                                Voir tous les résultats
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Drawer>
    );
};

export default React.memo(SearchMobileDrawer);