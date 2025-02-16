import React, { ChangeEvent, useState, useRef, useEffect } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  FETCH_USER_BY_ID,
  SEARCH_PRODUCTS_QUERY,
} from "../../../graphql/queries";
import { CiSearch } from "react-icons/ci";
import Link from "next/link";
import Image from "next/legacy/image";
import { useRouter, usePathname } from "next/navigation";
import prepRoute from "../../Helpers/_prepRoute";
import triggerEvents from "@/utlils/trackEvents";
import { normalizeText } from "@/app/Helpers/_normalizeText";
import { sendGTMEvent } from "@next/third-parties/google";
import { useAuth } from "@/lib/auth/useAuth";



const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const { decodedToken, isAuthenticated } = useAuth();
  const [searchProducts, { data }] = useLazyQuery(SEARCH_PRODUCTS_QUERY);

  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: userData } = useQuery(FETCH_USER_BY_ID, {
    variables: { userId: decodedToken?.userId },
    skip: !isAuthenticated,
  });


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setSearching(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSearching(false);
  }, [pathname]);

  const handleSearchChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchQuery(inputValue);

    searchProducts({
      variables: {
        input: {
          query: normalizeText(inputValue),
          page: 1,
          pageSize: 15,
          visibleProduct: true,
        },
      },

      onError: (err) => {
        console.error("Error fetching search results:", err);
      },
    });
  };

  return (
    <div className="search-container relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 h-14 px-4">
        <input
          ref={inputRef}
          className="w-full h-full outline-none text-gray-700 placeholder-gray-400 text-sm font-medium pr-4"
          type="text"
          placeholder="Recherchez meubles, déco, cuisine, salle de bain..."
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setSearching(true)}
        />
        <button
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary hover:bg-primary-dark transition-colors duration-200"
          onClick={() => {
            router.push(`/Collections/tunisie?query=${searchQuery}`);
            setSearching(false);
          }}
        >
          <CiSearch className="text-white w-5 h-5" />
        </button>
      </div>

      {/* Search Results Dropdown */}
      {data && searching && (
        <div
          ref={dropdownRef}
          className="absolute w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-[480px] overflow-y-auto"
        >
          <div className="p-4 space-y-4">
            {/* Categories Section */}
            {data.searchProducts.results.categories && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Catégories ({data.searchProducts.results.categories.length})
                </h3>
                <ul className="space-y-1">
                  {data.searchProducts.results.categories.map((category: any) => (
                    <Link
                      key={category.id}
                      href={`/Collections/tunisie/${prepRoute(category.name)}/?${new URLSearchParams(
                        { category: category.name }
                      )}`}
                      onClick={() => {
                        triggerEvents("SelectSearchedCategory", {
                          user_data: {
                            em: [userData?.fetchUsersById.email.toLowerCase()],
                            fn: [userData?.fetchUsersById.fullName],
                            ph: [userData?.fetchUsersById?.number],
                            country: ["tn"],
                            external_id: userData?.fetchUsersById.id,
                          },
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
                          user_data: {
                            em: [userData?.fetchUsersById.email.toLowerCase()],
                            fn: [userData?.fetchUsersById.fullName],
                            ph: [userData?.fetchUsersById?.number],
                            country: ["tn"],
                            external_id: userData?.fetchUsersById.id
                          },
                          facebook_data: {
                            content_type: "category",
                            category_name: category.name,
                            category_id: category.id
                          }
                        });
                        setSearching(false);
                      }}
                    >
                      <li className="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150 text-sm font-medium">
                        {category.name}
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
            )}

            {/* Products Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Produits ({data.searchProducts.results.products.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.searchProducts.results.products.map((product: any) => (
                  <Link
                    key={product.id}
                    href={`/products/tunisie?productId=${product.id}`}
                    onClick={() => {
                      triggerEvents("SelectSearchedProduct", {
                        user_data: {
                          em: [userData?.fetchUsersById.email.toLowerCase()],
                          fn: [userData?.fetchUsersById.fullName],
                          ph: [userData?.fetchUsersById?.number],
                          country: ["tn"],
                          external_id: userData?.fetchUsersById.id,
                        },
                        custom_data: {
                          product_name: product.name,
                          product_id: product.id,
                          product_price:
                            product.productDiscounts.length > 0
                              ? product.productDiscounts[0].newPrice
                              : product.price,
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
                            price: product.productDiscounts.length > 0
                              ? product.productDiscounts[0].newPrice
                              : product.price
                          }]
                        },
                        user_data: {
                          em: [userData?.fetchUsersById.email.toLowerCase()],
                          fn: [userData?.fetchUsersById.fullName],
                          ph: [userData?.fetchUsersById?.number],
                          country: ["tn"],
                          external_id: userData?.fetchUsersById.id
                        },
                        facebook_data: {
                          product_name: product.name,
                          product_id: product.id,
                          product_price: product.productDiscounts.length > 0
                            ? product.productDiscounts[0].newPrice
                            : product.price,
                          product_category: product.categories[0]?.name,
                          currency: "TND"
                        }
                      });
                      setSearching(false);
                    }}
                    className="group flex items-start p-3 space-x-3 bg-white hover:bg-gray-50 rounded-lg transition-colors duration-150 border border-gray-100"
                  >
                    <div className="relative flex-shrink-0 w-20 h-20 rounded-lg bg-gray-50 overflow-hidden">
                      <Image
                        layout="fill"
                        src={product.images[0]}
                        objectFit="contain"
                        className="group-hover:scale-105 transition-transform duration-200"
                        quality={85}
                        alt={product.name}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate mb-1">
                        {product.name}
                      </p>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-base font-bold text-primary">
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

            {/* Show More Button */}
            <button
              className="w-full py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors duration-200"
              onClick={() => {
                router.push(`/Collections/tunisie?query=${searchQuery}`);
                setSearching(false);
              }}
            >
              Voir tous les résultats
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
