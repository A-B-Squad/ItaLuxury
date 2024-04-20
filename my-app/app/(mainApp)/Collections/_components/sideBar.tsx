"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";

import { useLazyQuery, useQuery } from "@apollo/client";
import {
  CATEGORY_QUERY,
  COLORS_QUERY,
  SEARCH_PRODUCTS_QUERY,
} from "../../../../graphql/queries";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const SideBar = () => {
  const [categories, setCategories] = useState(null);
  const [colors, setColors] = useState(null);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceValue, setPriceValue] = useState(500);
  const [priceChanged, setPriceChanged] = useState(false);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [searchProducts] = useLazyQuery(SEARCH_PRODUCTS_QUERY);

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
      // console.log(data);

      setColors(data.colors);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString());
    if (
      selectedColors.length > 0 ||
      selectedCategories.length > 0 ||
      priceValue !== 500
    ) {
      const queryObj: { [key: string]: any } = {};

      if (selectedColors.length > 0) {
        queryObj.colors = selectedColors;
      }

      if (selectedCategories.length > 0) {
        queryObj.categories = selectedCategories;
      }

      if (priceValue !== 500) {
        queryObj.price = priceValue;
      }
      params.set("query", JSON.stringify(queryObj));
    }

    router.push(`/Collections?${params.toString()}`, { scroll: false });

    searchProducts({
      variables: {
        input: {
          colorIds: selectedColors,
          categoryIds: selectedCategories,
          minPrice: 1,
          maxPrice: +priceValue,
        },
      },
      onCompleted: (data) => {
        console.log("====================================");
        console.log(data);
        console.log("====================================");
      },
      onError: (error) => {
        return error;
      },
    });
  }, [selectedColors, selectedCategories, priceValue]);

  // Function to handle checkbox change for colors
  const handleColorChange = (colorId: string) => {
    const updatedColors = selectedColors.includes(colorId)
      ? selectedColors.filter((id) => id !== colorId)
      : [...selectedColors, colorId];
    setSelectedColors(updatedColors);
  };

  // Function to handle checkbox change for categories
  const handleCategoryChange = (categoryId: string) => {
    const isSelected = selectedCategories.includes(categoryId);

    if (isSelected) {
      // Remove category ID from selectedCategories
      const updatedCategories = selectedCategories.filter(
        (id) => id !== categoryId
      );
      setSelectedCategories(updatedCategories);
    } else {
      // Add category ID to selectedCategories
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handlePriceChange = (price: number) => {
    setPriceValue(price);
    setPriceChanged(true);
  };

  const flattenCategories = (categories: any) => {
    let flattenedCategories: any = [];

    const traverse = (category: any) => {
      flattenedCategories.push(category);

      if (category.subcategories && category.subcategories.length > 0) {
        category.subcategories?.forEach((subcategory: any) => {
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

  return (
    <section
      aria-labelledby="products-heading "
      className=" w-80  sticky top-0 h-full bg-white shadow-md "
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
            <li key={category.id} className="relative group transition-all border-b py-2 ">
              <a
                href="#"
                className="before:absolute w-full before:bg-mediumBeige before:h-[2px] before:w-0 before:transition-all group-hover:before:w-full before:top-9"
              >
                {category.name}
              </a>
            </li>
          ))}
        </ul>

        <div className="border-b border-gray-200 py-6">
          <h3 className=" tracking-widest  text-gray-900 font-semibold text-base">
            <Link
              href={"/Collections"}
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
                id="labels-range-input"
                type="range"
                min="1"
                max="3000"
                defaultValue="500"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer "
                onChange={(e: any) => {
                  e.preventDefault();
                  handlePriceChange(e.target.value);
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
                {priceValue} TND
              </div>
            </div>
          </div>
        </div>
        <div className="border-b border-gray-200 py-6">
          <h3 className=" flow-root tracking-widest font-semibold text-base text-gray-900">
            <Link
              href={"/Collections"}
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
                    name="color[]"
                    type="checkbox"
                    checked={selectedColors.includes(color.id)}
                    style={{
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                      appearance: "none",
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      outline: "none",
                      background: color.Hex,
                      border: selectedColors.includes(color.id)
                        ? "2px solid black"
                        : "2px solid gray",
                      transition: "border-color 0.3s",
                    }}
                    title={color.color}
                    className="color-checkbox cursor-pointer shadow-md shadow-white "
                    onChange={() => handleColorChange(color.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-b border-gray-200 py-6">
          <h3 className=" flow-root tracking-widest text-gray-900 font-semibold text-base">
            <Link
              href={"/Collections"}
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
                    name="category[]"
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    className="h-4 w-4  cursor-pointer group border-gray-300  text-strongBeige focus:ring-strongBeige"
                    onChange={(e) => {
                      handleCategoryChange(category.id);
                      e.preventDefault();
                    }}
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
