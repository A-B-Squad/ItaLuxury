import React, { ChangeEvent, useState, useRef, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { SEARCH_PRODUCTS_QUERY } from "../../../graphql/queries";
import { CiSearch } from "react-icons/ci";
import Link from "next/link";
import Image from "next/legacy/image";

import { useRouter } from "next/navigation";
import prepRoute from "../../Helpers/_prepRoute";
const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
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
      className="search z-50 flex items-center border border-gray-300 px-4 w-full relative max-w-md h-11 rounded-full    pl-4"
      onClick={() => setSearching(true)}
      onMouseLeave={() => setSearching(false)}
    >
      <input
        ref={inputRef}
        className="h-full w-full outline-none"
        type="text"
        placeholder="Rechercher..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <span
        className="flex items-center right-0 absolute justify-center cursor-pointer h-full w-14 rounded-full hover:bg-mediumBeige transition-all bg-strongBeige"
        onClick={() => {
          router.push(`/Collections?query=${searchQuery}`, { scroll: true });
        }}
      >
        <CiSearch className="size-7 text-white" />
      </span>
      {data && searching && (
        <div className="bg-white border w-full left-0 absolute top-11 z-50 overflow-y-scroll max-h-80 py-2 pl-4">
          {categories && (
            <ul className="border-b-black mb-5">
              <h3 className="font-bold tracking-wider ">
                Catégories ({categories.length})
              </h3>
              {categories.map((category: any) => (
                <Link href={`/Collections/tunisie?category=${category.id}`}>
                  <li
                    key={category.id}
                    className="py-2  border-b hover:opacity-75 h-full w-full transition-opacity border-b-gray-300  cursor-pointer"
                  >
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

          <ul className="border-b-black  mb-5">
            <h3 className="font-bold tracking-wider">
              Produits ({data.searchProducts.results.products.length})
            </h3>
            {data.searchProducts.results.products.map((result: Product) => (
              <div className="py-2">
                <Link
                  key={result.id}
                  href={{
                    pathname: `/products/tunisie/${prepRoute(result?.name)}`,
                    query: {
                      productId: result?.id,
                      collection: [
                        result?.categories[0]?.name,
                        result?.categories[0]?.id,
                        result?.categories[0]?.subcategories[0]?.name,
                        result?.categories[0]?.subcategories[0]?.id,
                        result?.categories[0]?.subcategories[0]
                          ?.subcategories[1]?.name,
                        result?.categories[0]?.subcategories[0]
                          ?.subcategories[1]?.id,
                        result?.name,
                      ],
                    },
                  }}
                  className="flex items-center relative gap-3 border-b hover:opacity-75 h-full w-full transition-opacity border-b-gray-300  cursor-pointer"
                >
                  {result.productDiscounts.length > 0 && (
                    <p className="bg-red-500 py-1 px-2 absolute right-1 top-1 text-white text-xs">
                      PROMO!
                    </p>
                  )}
                  <Image
                    width={80}
                    height={80}
                    src={result.images[0]}
                    objectFit="contain"
                    alt="product img"
                  />
                  <div className="text-sm gap-2 flex flex-col">
                    <p className="w-full text-base font-medium">
                      {result.name}
                    </p>
                    <div className="flex gap-3">
                      <span
                        className={`${result.productDiscounts.length > 0 ? "text-strongBeige" : ""} font-bold text-base`}
                      >
                        {result.productDiscounts.length > 0
                          ? `À partir de : ${result.productDiscounts[0].newPrice.toFixed(3)}`
                          : result.price.toFixed(3)}
                        TND
                      </span>
                      {result.productDiscounts.length > 0 && (
                        <span className="font-bold line-through text-gray-700">
                          {result.price.toFixed(3)} TND
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}

            {data.searchProducts.results.products.length === 0 && (
              <p className="font-light text-red-700">
                Aucun produit trouvé avec ce nom et lié à cette catégorie
              </p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
