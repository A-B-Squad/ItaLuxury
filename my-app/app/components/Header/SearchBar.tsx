import React, { ChangeEvent, useState, useRef, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { SEARCH_PRODUCTS_QUERY } from "@/graphql/queries";
import { CiSearch } from "react-icons/ci";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
      setCategories(data.searchProducts.results.categories)
    }
  }, [data]);

  return (
    <div
      className="search z-50 flex items-center border-2 px-4 w-full relative max-w-md h-11 border-[#e0d7d0] rounded-lg pl-4"
      onMouseEnter={() => setSearching(true)}
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
        className="flex items-center right-0 absolute justify-center cursor-pointer h-full w-20 bg-mediumBeige"
        onClick={() => {
          router.push(`/Collections?query=${searchQuery}`, { scroll: false });
        }}
      >
        <CiSearch className="size-7 text-white" />
      </span>
      {data && searching && (
        <div className="bg-lightBeige absolute top-10 z-50 overflow-y-scroll max-h-80 p-2">
    
          {
            categories && (
              <ul className="border-b-black mb-5">
                <li className="font-bold">Catégories ({categories.length})</li>
                {
                  categories.map((category:any) =>(
                    <li key={category.id} className="mb-2 border-b border-b-gray-300 pb-1 gap-2 cursor-pointer">{category.name}</li>
                  ))
                }
              </ul>
            )
          }
        
          <ul className="border-b-black  mb-5">
            <li className="font-bold">Produits ({data.searchProducts.results.products.length})</li>
            {data.searchProducts.results.products.map((result: Product) => (
              <Link
                key={result.id}
                href={""}
                className="flex items-center mb-2 border-b border-b-gray-300 pb-1 gap-2 cursor-pointer"
              >
                <img
                  src={result.images[0]}
                  alt="product img"
                  className="w-12 h-12"
                />
                <p className="text-sm flex flex-col">
                  {result.name}
                  <div className="flex gap-3">
                    <span className="font-bold">
                      {result.productDiscounts.length > 0
                        ? `À partir de : ${result.productDiscounts[0].newPrice.toFixed(3)}`
                        : result.price.toFixed(3)}
                      TND
                    </span>
                    {result.productDiscounts.length > 0 && (
                      <span className="font-bold line-through">
                        {result.price.toFixed(3)} TND
                      </span>
                    )}
                  </div>
                </p>
              </Link>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
