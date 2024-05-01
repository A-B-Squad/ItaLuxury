"use client";
import Link from "next/link";

import React, { ChangeEvent, useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";

import { useLazyQuery, useQuery } from "@apollo/client";
import { useSidebarStore } from "../../../store/zustand";
import {
  CATEGORY_QUERY,
  COLORS_QUERY,
  SEARCH_PRODUCTS_QUERY,
} from "../../../../graphql/queries";
import {
  useSearchParams,
  useRouter,
  ReadonlyURLSearchParams,
} from "next/navigation";

// / ------------------!--------------------

export const convertStringToQueriesObject = (
  searchParams: URLSearchParams | null
) => {
  let selectedQueries: Record<string, string[]> = {};

  if (searchParams) {
    searchParams.forEach((values, key) => {
      const queries = values.split(",");
      if (selectedQueries[key]) {
        selectedQueries[key].push(...queries);
      } else {
        selectedQueries[key] = queries;
      }
    });
  }

  return selectedQueries;
};

export const convertValidStringQueries = (
  queries: Record<string, string[]>
) => {
  let q = "";
  for (let [key, value] of Object.entries(queries)) {
    q = q + `${q === "" ? "" : "&"}${key}=${value}`;
  }

  return q;
};

const SideBar = () => {
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [priceChanged, setPriceChanged] = useState(false);
  const [price, setPrice] = useState(500);
  const router = useRouter();
  const searchParams: URLSearchParams | null = useSearchParams();
  const [selectedFilterQueries, setSelectedFilterQueries] = useState<
    Record<string, string[]>
  >({});
  const { isOpen } = useSidebarStore();
  const fetchCategories = useQuery(CATEGORY_QUERY, {
    onCompleted: (data) => {
      setCategories(data.categories);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const fetchColors = useQuery(COLORS_QUERY, {
    onCompleted: (data) => {
      setColors(data.colors);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    const paramsObj = convertStringToQueriesObject(searchParams);
    setSelectedFilterQueries(paramsObj);
  }, [searchParams]);

  const handleSelectFilterOptions = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    let updatedQueries = { ...selectedFilterQueries };
    delete updatedQueries["query"]
    
    if (checked) {
      if (updatedQueries[name]) {
        updatedQueries[name] = [...updatedQueries[name], value];
      } else {
        updatedQueries[name] = [value];
      }
    } else {
      if (updatedQueries[name]) {
        updatedQueries[name] = updatedQueries[name].filter(
          (query) => query !== value
        );

        if (updatedQueries[name].length === 0) {
          delete updatedQueries[name];
        }
      }
    }
    setSelectedFilterQueries(updatedQueries);
    const queryString = convertValidStringQueries(updatedQueries);

    router.push(`/Collections/tunisie?${queryString}`, { scroll: false });
  };

  const isChecked = (name: string, option: string) => {
    return Boolean(
      selectedFilterQueries[name] &&
        selectedFilterQueries[name].includes(option.toLowerCase())
    );
  };

  const flattenCategories = (categories: any) => {
    let flattenedCategories: any = [];

    const traverse = (category: any) => {
      flattenedCategories.push(category);

      if (category.subcategories && category.subcategories.length > 0) {
        category.subcategories.forEach((subcategory: any) => {
          traverse(subcategory);
        });
      }
    };
    categories?.forEach((category: any) => {
      traverse(category);
    });

    return flattenedCategories;
  };
  const flattenedCategories = flattenCategories(categories);

  const checkValidQuery = (queries: string[]) => {
    return queries.filter((query) => query !== "").length > 0;
  };

  const updateSearchParams = (updatedQueries: Record<string, string[]>) => {
    const queryString = convertValidStringQueries(updatedQueries);
    router.push(`/Collections/tunisie?${queryString}`, { scroll: false });
  };
  const handleCategoryClick = (categoryId: string) => {
    const updatedQueries = { ...selectedFilterQueries };

    updatedQueries["category"] = [categoryId];

    setSelectedFilterQueries(updatedQueries);

    updateSearchParams(updatedQueries);
  };
  return (
    <section
      aria-labelledby="products-heading "
      className={`w-96   top-0 h-full bg-white shadow-md sticky ${isOpen ? "sticky" : "hidden md:block"} `}
    >
      <form className="relative pl-5 pt-5  shadow-lg">
        <h3 className="font-bold tracking-widest text-lg pb-2">
          Main Categories
        </h3>

        <ul
          role="list"
          className="space-y-4 border-b  border-gray-200 pb-6 text-sm font-medium text-gray-900"
        >
          {categories?.map((category: any) => (
            <li
              key={category.id}
              className="relative group transition-all border-b py-2 "
            >
              <button
                type="button"
                onClick={() => handleCategoryClick(category.id)}
                className="focus:outline-none hover:text-black transition-colors"
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>

        <div className="border-b border-gray-200 py-6">
          <h3 className=" tracking-widest  text-gray-900 font-semibold text-base">
            <Link
              href={"/Collections/tunisie"}
              className="flex w-full items-center justify-between "
            >
              Price
              <IoIosArrowForward />
            </Link>
          </h3>
          <div className="pt-6 w-11/12" id="filter-section-0">
            <div className="relative mb-6">
              <label htmlFor="labels-range-input" className="sr-only">
                Labels range
              </label>
              <input
                id={price.toString()}
                type="range"
                min="1"
                max="3000"
                defaultValue={searchParams?.get("price") || "500"}
                name="price"
                value={searchParams?.get("price") || price}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer "
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  handleSelectFilterOptions(e);
                  setPrice(+e.target.value);
                  setPriceChanged(true);
                }}
              />
              <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6">
                Min (1 TND)
              </span>

              <span className="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6">
                Max (3000)
              </span>
            </div>
            <div className="flex justify-between mt-10">
              <span className="text-gray-400">from:</span>{" "}
              <div className="w-20 maw-h-20 border flex justify-center border-gray-200 text-gray-400">
                1 TND
              </div>
              <span className="text-gray-400">to:</span>{" "}
              <div
                className={`w-20 max-h-20 flex justify-center border border-gray-200 ${priceChanged ? "text-black" : "text-gray-400"}`}
              >
                {" "}
                {searchParams?.get("price") || price} TND
              </div>
            </div>
          </div>
        </div>
        <div className="border-b border-gray-200 py-6">
          <h3 className=" flow-root tracking-widest font-semibold text-base text-gray-900">
            <Link
              href={"/Collections/tunisie"}
              className="flex w-full items-center justify-between     "
            >
              Colors
              <IoIosArrowForward />
            </Link>
          </h3>
          <div className="pt-6 overflow-y-scroll max-h-60">
            <div className=" flex items-center flex-wrap px-3 w-full  gap-3">
              {colors?.map((color: any) => (
                <div key={color.id} className="flex items-center">
                  <input
                    id={`filtre-color-${color.id}`}
                    name="color"
                    type="checkbox"
                    value={color.id}
                    checked={isChecked("color", color.id)}
                    style={{
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                      appearance: "none",
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      outline: "none",
                      background: color.Hex,
                      border: isChecked("color", color.id)
                        ? "2px solid black"
                        : "2px solid gray",
                      transition: "border-color 0.3s",
                    }}
                    title={color.color}
                    className="color-checkbox cursor-pointer shadow-md shadow-white "
                    onChange={handleSelectFilterOptions}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-b border-gray-200 py-6">
          <h3 className=" flow-root tracking-widest text-gray-900 font-semibold text-base">
            <Link
              href={"/Collections/tunisie"}
              className="flex w-full items-center justify-between"
            >
              Category
              <IoIosArrowForward />
            </Link>
          </h3>

          <div
            className="pt-6 overflow-y-scroll max-h-60"
            id="filter-section-1"
          >
            <div className="space-y-4">
              {flattenedCategories?.map((category: any) => (
                <div key={category.id} className="flex items-center">
                  <input
                    id={`filtre-color-${category.id}`}
                    name="category"
                    type="checkbox"
                    value={category.id}
                    checked={isChecked("category", category.id)}
                    className="h-4 w-4  cursor-pointer group border-gray-300  text-strongBeige focus:ring-strongBeige"
                    onChange={handleSelectFilterOptions}
                  />
                  <label
                    htmlFor={`filtre-color-${category.id}`}
                    className="ml-3 text-sm text-gray-600 cursor-pointer group-hover:text-black group-hover:font-semibold hover:font-semibold transition-all"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default SideBar;
