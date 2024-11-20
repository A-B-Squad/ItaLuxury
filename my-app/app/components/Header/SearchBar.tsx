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
  const [searchProducts, { data, error }] = useLazyQuery(SEARCH_PRODUCTS_QUERY);

  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: userData } = useQuery(FETCH_USER_BY_ID, {
    variables: { userId: decodedToken?.userId },
    skip: !decodedToken?.userId,
  });

  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
  }, []);

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
      onError: (err) => {
        console.error("Error fetching search results:", err);
      },
    });
  };

  return (
    <div className="search-container relative w-full">
      <div className="search-input-wrapper flex w-full items-center border mx-auto bg-white border-gray-300 pl-4 relative max-w-lg h-11 rounded-full">
        <input
          ref={inputRef}
          className="h-full w-full outline-none"
          type="text"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setSearching(true)}
        />
        <span
          className="flex items-center justify-center cursor-pointer h-full w-14 rounded-full bg-primaryColor"
          onClick={() => {
            router.push(`/Collections/tunisie?query=${searchQuery}`, {
              scroll: true,
            });
            setSearching(false);
          }}
        >
          <CiSearch className="size-7 text-white" />
        </span>
      </div>

      {data && searching && (
        <div
          ref={dropdownRef}
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
                    href={`/Collections/tunisie/${prepRoute(category.name)}`}
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
                      pushToDataLayer("SelectSearchedCategory");
                      setSearching(false);
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
            <div className="grid place-content-start grid-cols-1 lg:grid-cols-2 gap-4">
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
                    pushToDataLayer("SelectSearchedProduct");
                    setSearching(false);
                  }}
                  className="product-item flex flex-row lg:flex-col items-center lg:p-2 border-b rounded-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative w-24  h-24 mb-2">
                    <Image
                      layout="fill"
                      src={product.images[0]}
                      objectFit="contain"
                      priority={true}
                      quality={75}
                      alt={product.name}
                    />
                  </div>
                  <div className="info lg:text-center ml-2  ">

                    <p className="text-xs w-auto lg:text-base font-medium line-clamp-1 lg:line-clamp-none tracking-wider ">
                      {product.name}
                    </p>
                    <div className="price">

                      <p className="text-sm lg:text-lg font-bold text-primaryColor">
                        {product.productDiscounts.length > 0
                          ? product.productDiscounts[0].newPrice.toFixed(3) + " TND"
                          : product.price.toFixed(3) + " TND"}
                      </p>
                      {product.productDiscounts.length > 0 && (
                        <p className=" text-xs lg:text-sm line-through text-gray-500">
                          {product.price.toFixed(3)} TND
                        </p>
                      )}
                    </div>
                  </div>

                </Link>
              ))}
            </div>
            <button
              className="w-full sticky bottom-0 mt-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
              onClick={() => {
                router.push(`/Collections/tunisie?query=${searchQuery}`);
                setSearching(false);
              }}
            >
              Afficher plus de résultats
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
