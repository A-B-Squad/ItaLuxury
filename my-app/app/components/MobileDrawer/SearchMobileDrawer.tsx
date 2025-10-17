"use client";

import React, { ChangeEvent, useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useLazyQuery } from "@apollo/client";
import { SEARCH_PRODUCTS_QUERY } from "../../../graphql/queries";
import { CiSearch } from "react-icons/ci";
import { IoCloseOutline, IoArrowBack } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { sendGTMEvent } from "@next/third-parties/google";
import { normalizeText } from "@/app/Helpers/_normalizeText";
import { Drawer } from "@material-tailwind/react";
import { useDrawerMobileSearch } from "@/app/store/zustand";
import { size } from "lodash";

interface SearchMobileDrawerProps {
    userData?: any;
}

const SearchMobileDrawer: React.FC<SearchMobileDrawerProps> = ({
    userData
}) => {
    const { isOpen, closeDrawerMobileSearch } = useDrawerMobileSearch();
    const [searchQuery, setSearchQuery] = useState("");
    const [searching, setSearching] = useState(false);
    const [searchProducts, { data, loading }] = useLazyQuery(SEARCH_PRODUCTS_QUERY);

    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    // Memoize user data for analytics
    const analyticsUserData = useMemo(() => ({
        em: userData?.email ? [userData.email.toLowerCase()] : [],
        fn: userData?.fullName ? [userData.fullName] : [],
        ph: userData?.number ? [userData.number] : [],
        country: ["tn"],
        external_id: userData?.id || null
    }), [userData]);

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

    // Debounced search
    const debouncedSearch = useMemo(() => {
        let timer: any;
        return (query: string) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (query.trim().length > 1) {
                    searchProducts({
                        variables: {
                            input: {
                                query: normalizeText(query),
                                page: 1,
                                pageSize: 15,
                                visibleProduct: true,
                                sortOrder: "asc",
                                sortBy: "name"
                            },
                        },
                        fetchPolicy: "cache-and-network",
                        onError: (err) => {
                            console.error("Error fetching search results:", err);
                        },
                    });
                }
            }, 350);
        };
    }, [searchProducts]);

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
            router.push(`/Collections/tunisie?query=${encodeURIComponent(searchQuery)}`);
            closeDrawerMobileSearch();

            sendGTMEvent({
                event: "search",
                search_term: searchQuery,
                user_data: analyticsUserData
            });
        }
    }, [router, searchQuery, analyticsUserData, closeDrawerMobileSearch]);

    const handleCategoryClick = useCallback((category: any) => {
        sendGTMEvent({
            event: "select_content",
            content_type: "category",
            item_id: category.id,
            item_name: category.name,
            user_data: analyticsUserData,
        });

        closeDrawerMobileSearch();
    }, [analyticsUserData, closeDrawerMobileSearch]);

    const handleProductClick = useCallback((product: any) => {
        const productPrice = product.productDiscounts.length > 0
            ? product.productDiscounts[0].newPrice
            : product.price;

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
        });

        closeDrawerMobileSearch
        closeDrawerMobileSearch();
    }, [analyticsUserData, closeDrawerMobileSearch]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchQuery.trim().length > 0) {
            handleViewAllResults();
        } else if (e.key === 'Escape') {
            closeDrawerMobileSearch
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
                            className="w-full h-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm font-medium px-3"
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
                        {loading && (
                            <div className="space-y-4">
                                <div className="h-5 bg-gray-200 rounded-md w-1/4 animate-pulse"></div>
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center space-x-3">
                                            <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
                                                <div className="h-4 bg-gray-200 rounded-md w-1/2 animate-pulse"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Search Results */}
                        {searchResults && searching && !loading && (
                            <div className="space-y-6">
                                {/* Categories */}
                                {searchResults.categories.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Catégories ({searchResults.categories.length})
                                        </h3>
                                        <ul className="space-y-1">
                                            {searchResults.categories.map((category: any) => (
                                                <Link
                                                    key={category.id}
                                                    href={`/Collections/tunisie?${new URLSearchParams({ category: category.name })}`}
                                                    onClick={() => handleCategoryClick(category)}
                                                >
                                                    <li className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-colors duration-150 text-sm font-medium">
                                                        <CiSearch className="text-gray-400 w-5 h-5 flex-shrink-0" />
                                                        <span className="flex-1">{category.name}</span>
                                                    </li>
                                                </Link>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Products */}
                                {searchResults.products.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Produits ({searchResults.products.length})
                                        </h3>
                                        <div className="space-y-3">
                                            {searchResults.products.map((product: any) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/products/tunisie?slug=${product.slug}`}
                                                    onClick={() => handleProductClick(product)}
                                                    className="block"
                                                >
                                                    <div className="flex items-start gap-4 p-3 bg-white hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-colors duration-150 border border-gray-100">
                                                        <div className="relative flex-shrink-0 w-20 h-20 rounded-lg bg-gray-50 overflow-hidden">
                                                            {product.images && product.images[0] ? (
                                                                <Image
                                                                    src={product.images[0]}
                                                                    alt={product.name}
                                                                    width={80}
                                                                    height={80}
                                                                    sizes="80px"
                                                                    style={{
                                                                        objectFit: "cover",
                                                                        width: '100%',
                                                                        height: '100%'
                                                                    }}
                                                                    quality={85}
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                                    <span className="text-gray-400 text-xs">No image</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 leading-5">
                                                                {product.name}
                                                            </p>
                                                            <div className="flex items-baseline gap-2">
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
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* No Results */}
                                {searchResults.categories.length === 0 && searchResults.products.length === 0 && (
                                    <div className="py-12 text-center">
                                        <CiSearch className="mx-auto w-16 h-16 text-gray-300 mb-4" />
                                        <p className="text-gray-600 text-base font-medium">
                                            Aucun résultat pour "{searchQuery}"
                                        </p>
                                        <p className="text-gray-400 text-sm mt-2">
                                            Essayez avec d'autres mots-clés
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Empty State */}
                        {(!searchQuery || searchQuery.trim().length <= 1) && !loading && (
                            <div className="py-16 text-center">
                                <CiSearch className="mx-auto w-20 h-20 text-gray-300 mb-4" />
                                <p className="text-gray-600 text-base font-medium">
                                    Que recherchez-vous ?
                                </p>
                                <p className="text-gray-400 text-sm mt-2">
                                    Meubles, déco, cuisine, salle de bain...
                                </p>
                            </div>
                        )}
                    </div>

                    {/* View All Results Button */}
                    {searchResults && searching && !loading &&
                        (searchResults.categories.length > 0 || searchResults.products.length > 0) && (
                            <div className="sticky bottom-0 bg-white p-4 border-t border-gray-100">
                                <button
                                    className="w-full py-3.5 text-sm font-semibold text-white bg-primaryColor hover:bg-amber-200 active:bg-amber-300 rounded-xl transition-colors duration-200"
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