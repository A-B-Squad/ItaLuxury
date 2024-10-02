import React, { ChangeEvent, useState, useRef, useEffect } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  FETCH_USER_BY_ID,
  SEARCH_PRODUCTS_QUERY,
} from "../../../graphql/queries";
import { CiSearch } from "react-icons/ci";
import Link from "next/link";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import prepRoute from "../../Helpers/_prepRoute";
import triggerEvents from "@/utlils/trackEvents";

import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { pushToDataLayer } from "@/utlils/pushToDataLayer";
interface DecodedToken extends JwtPayload {
  userId: string;
}
const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const [searching, setSearching] = useState(false);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);

  const [searchProducts, { data }] = useLazyQuery(SEARCH_PRODUCTS_QUERY);
  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
  }, []);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: userData } = useQuery(FETCH_USER_BY_ID, {
    variables: {
      userId: decodedToken?.userId,
    },
    skip: !decodedToken?.userId,
  });
  const handleSearchChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchQuery(inputValue);
    searchProducts({
      variables: {
        input: {
          query: inputValue,
          page: 1,
          pageSize: 15,
          visibleProduct: true,
        },
      },
      onCompleted: () => {
        triggerEvents("SelectSearchedCategory", {
          user_data: {
            em: [userData?.fetchUsersById.email.toLowerCase()],
            fn: [userData?.fetchUsersById.fullName],
            ph: [userData?.fetchUsersById?.number],
            country: ["tn"],
            external_id: userData?.fetchUsersById.id,
          },
          custom_data: {
            content_name: "Search",
            content_type: "product",
            search_string: inputValue,
            contentIds: [
              data.searchProducts.results.categories.map(
                (category: any) => category.id
              ),
              data.searchProducts.results.products.map(
                (product: any) => product.name
              ),
            ],
            contents: [
              data.searchProducts.results.categories.map(
                (category: any) => category.name
              ),
              data.searchProducts.results.products.map(
                (product: any) => product.name
              ),
            ].join(", "),
            Currency: "TND",
            number_of_results:
              data?.searchProducts?.results?.products.length +
              data?.searchProducts?.results?.categories.length,
          },
        });
        pushToDataLayer("AddToCart");
      },
    });
  };

  useEffect(() => {
    const handleMouseLeave = () => {
      if (!inputRef.current?.contains(document.activeElement) && !searching) {
        setSearchQuery("");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [searching]);

  return (
    <div
      className="search-container relative w-full"
      onClick={() => setSearching(true)}
    >
      <div className="search-input-wrapper flex w-full items-center border mx-auto bg-white border-gray-300 pl-4 relative max-w-md h-11 rounded-full">
        <input
          ref={inputRef}
          className="h-full w-full outline-none"
          type="text"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <span
          className="flex items-center justify-center cursor-pointer h-full w-14 rounded-full bg-primaryColor"
          onClick={() => {
            router.push(`/Collections/tunisie?query=${searchQuery}`, {
              scroll: true,
            });
          }}
        >
          <CiSearch className="size-7 text-white" />
        </span>
      </div>

      {data && searching && (
        <div
          onMouseLeave={() => setSearching(false)}
          className="search-results max-h-96 bg-white border-2 w-full left-2/4 -translate-x-2/4 absolute top-12 overflow-y-auto z-[100] rounded-md shadow-lg"
        >
          <div className="p-4">
            {data.searchProducts.results.categories && (
              <ul className="border-b-black mb-5">
                <h3 className="font-bold tracking-wider">
                  Catégories ({data.searchProducts.results.categories.length})
                </h3>
                {data.searchProducts.results.categories.map((category: any) => (
                  <Link
                    key={category.id}
                    href={`/Collections/tunisie/${prepRoute(category.name)}/?category=${category.name}&categories=${encodeURIComponent(category.name)}`}
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
                      }),
                        pushToDataLayer("SelectSearchedCategory");
                    }}
                  >
                    <li className="py-2 border-b hover:opacity-75 h-full w-full transition-opacity border-b-gray-300 cursor-pointer">
                      {category.name}
                    </li>
                  </Link>
                ))}
                {data.searchProducts.results.categories.length === 0 && (
                  <p className="font-light text-red-700">
                    Aucune catégorie trouvée avec ce nom
                  </p>
                )}
              </ul>
            )}
            <h3 className="font-bold mb-2">
              Résultat de la recherche: (
              {data.searchProducts.results.products.length})
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {data.searchProducts.results.products.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/products/tunisie/${prepRoute(product?.name)}/?productId=${product?.id}&categories=${[product?.categories[0]?.name, product?.categories[0]?.subcategories[0]?.name, product?.categories[0]?.subcategories[0]?.subcategories[0]?.name, product?.name]}`}
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
                    }),
                      pushToDataLayer("SelectSearchedProduct");
                  }}
                  className="product-item flex flex-col items-center p-2 border rounded-md hover:shadow-md transition-shadow"
                >
                  <div className="relative w-24 h-24 mb-2">
                    <Image
                      layout="fill"
                      src={product.images[0]}
                      objectFit="contain"
                      alt={product.name}
                    />
                  </div>
                  <p className="text-base font-light tracking-widest text-center line-clamp-1">
                    {product.name}
                  </p>
                  <p className="text-lg font-bold text-primaryColor">
                    {product.productDiscounts.length > 0
                      ? product.productDiscounts[0].newPrice.toFixed(3) + " TND"
                      : product.price.toFixed(3) + " TND"}
                  </p>
                  {product.productDiscounts.length > 0 && (
                    <p className="text-sm line-through text-gray-500">
                      {product.price.toFixed(3)} TND
                    </p>
                  )}
                </Link>
              ))}
            </div>
            <button
              className="w-full sticky bottom-0 mt-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
              onClick={() => {
                router.push(`/Collections/tunisie?query=${searchQuery}`, {
                  scroll: true,
                });
              }}
            >
              PLUS DE RÉSULTATS
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
