import React, { ChangeEvent, useState, useRef, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { SEARCH_PRODUCTS_QUERY } from "../../../graphql/queries";
import { CiSearch } from "react-icons/ci";
import Link from "next/link";
import Image from "next/legacy/image";
import { useRouter, useSearchParams } from "next/navigation";
import prepRoute from "../../Helpers/_prepRoute";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const query = searchParams?.get("query");

  const [searching, setSearching] = useState(false);
  const [categories, setCategories] = useState([]);

  const [searchProducts, { loading, data, error }] = useLazyQuery(
    SEARCH_PRODUCTS_QUERY
  );

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchQuery(inputValue);

    searchProducts({
      variables: {
        input: {
          query: inputValue,
          page: 1,
          pageSize: 20,
        },
      },
    });
  };

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      searchProducts({
        variables: {
          input: {
            query,
            page: 1,
            pageSize: 20,
          },
        },
      });
    }
  }, [query, searchProducts]);

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

  useEffect(() => {
    if (!!data?.searchProducts?.results?.categories) {
      setCategories(data.searchProducts.results.categories);
    }
  }, [data]);

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
          className="search-results bg-white border-2 w-4/5 left-2/4 -translate-x-2/4 absolute top-12 overflow-y-auto z-[100] rounded-md shadow-lg"
        >
          <div className="p-4">
            {categories && (
              <ul className="border-b-black mb-5">
                <h3 className="font-bold tracking-wider">
                  Catégories ({categories.length})
                </h3>
                {categories.map((category: any) => (
                  <Link
                    key={category.id}
                    href={`/Collections/tunisie?category=${category.id}`}
                  >
                    <li className="py-2 border-b hover:opacity-75 h-full w-full transition-opacity border-b-gray-300 cursor-pointer">
                      {category.name}
                    </li>
                  </Link>
                ))}
                {categories.length === 0 && (
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
                  href={{
                    pathname: `/products/tunisie/${prepRoute(product?.name)}`,
                    query: {
                      productId: product?.id,
                      collection: [
                        product?.categories[0]?.name,
                        product?.categories[0]?.id,
                        product?.categories[0]?.subcategories[0]?.name,
                        product?.categories[0]?.subcategories[0]?.id,
                        product?.categories[0]?.subcategories[0]
                          ?.subcategories[0]?.name,
                        product?.categories[0]?.subcategories[0]
                          ?.subcategories[0]?.id,
                        product?.name,
                      ],
                    },
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
                  <p className="text-base font-light tracking-widest text-center">
                    {product.name}
                  </p>
                  <p className="text-lg font-bold text-amber-500">
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
              className="w-full mt-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
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
