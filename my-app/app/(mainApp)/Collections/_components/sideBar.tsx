"use client";
import Link from "next/link";

import React, { ChangeEvent, useEffect, useState } from "react";
import { IoIosArrowForward, IoIosClose } from "react-icons/io";

import { useQuery } from "@apollo/client";
import { useSidebarStore } from "../../../store/zustand";
import {
  ALL_BRANDS,
  CATEGORY_QUERY,
  COLORS_QUERY,
} from "../../../../graphql/queries";
import { useSearchParams, useRouter } from "next/navigation";
import prepRoute from "../../../components/_prepRoute";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

  const [categories, setCategories] = useState([]);
  const [Brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [priceChanged, setPriceChanged] = useState(false);
  const [price, setPrice] = useState(500);
  const router = useRouter();

  const searchParams: URLSearchParams | null = useSearchParams();
  const [selectedFilterQueries, setSelectedFilterQueries] = useState<
    Record<string, string[]>
  >({});
  const { isOpenSideBard, toggleOpenSidebar } = useSidebarStore();

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
  const fetchMarkes = useQuery(ALL_BRANDS, {
    onCompleted: (data) => {
      setBrands(data.fetchBrands);
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
    const { name, value, checked } = e.target;

    let updatedQueries = { ...selectedFilterQueries };
    delete updatedQueries["query"];

    if (name === "brand") {
      updatedQueries["brand"] = checked ? [value] : [];
    } else {
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
    }

    setSelectedFilterQueries(updatedQueries);
    const queryString = convertValidStringQueries(updatedQueries);

    router.push(`/Collections/tunisie?${queryString}`, { scroll: false });
  };

  const handleChoiceFilterOptions = (value: string) => {
    let updatedQueries = { ...selectedFilterQueries };

    // Check if the value is "in-discount" or "new-product"
    if (value === "in-discount") {
      // If "En Promo" is selected, remove "Nouveau Produit"
      delete updatedQueries["new_product"];
      // Update selected option
      updatedQueries["choice"] = [value];
    } else if (value === "new-product") {
      // If "Nouveau Produit" is selected, remove "En Promo"
      delete updatedQueries["en_promo"];
      // Update selected option
      updatedQueries["choice"] = [value];
    }

    setSelectedFilterQueries(updatedQueries);
    const queryString = convertValidStringQueries(updatedQueries);

    router.push(`/Collections/tunisie?${queryString}`, { scroll: false });
    toggleOpenSidebar();
  };
  const handleColorSelection = (colorId: string) => {
    let updatedQueries = { ...selectedFilterQueries };

    // Only allow one color selection
    updatedQueries["color"] = [colorId];

    setSelectedFilterQueries(updatedQueries);
    const queryString = convertValidStringQueries(updatedQueries);

    router.push(`/Collections/tunisie?${queryString}`, { scroll: false });
    toggleOpenSidebar();
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPrice = +e.target.value;
    setPrice(newPrice);
    setPriceChanged(true);
    router.push(`/Collections/tunisie?price=${newPrice}`, { scroll: false });
  };

  const isChecked = (name: string, option: string) => {
    return Boolean(
      selectedFilterQueries[name] &&
        selectedFilterQueries[name].includes(option.toLowerCase())
    );
  };

  const handleClearFilters = () => {
    setSelectedFilterQueries({});
    router.push("/Collections/tunisie", { scroll: false });
    toggleOpenSidebar();
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
    toggleOpenSidebar();
  };

  return (
    <section
      aria-labelledby="products-heading "
      className={`w-96   top-0 h-full transition-all bg-white shadow-md sticky ${isOpenSideBard ? "sticky" : "hidden md:block"} `}
    >
      <form className="relative  pt-5  shadow-lg">
        <h3 className="font-semibold tracking-widest  pl-5 text-lg pb-2">
          FILTRER
        </h3>

        {Object.keys(selectedFilterQueries).length > 0 && (
          <div
            onClick={() => {
              handleClearFilters();
              toast({
                title: "Filtres réinitialisés",
                description: "Les filtres ont été réinitialisés avec succès.",
                className: "bg-strongBeige text-white",
              });
            }}
            className="flex  items-center justify-center transition-all hover:text-red-700   cursor-pointer"
          >
            <button className="flex border rounded-md gap-2 items-center  py-1 shadow px-2">
              <IoIosClose size={25} />
              Effacer Filters
            </button>
          </div>
        )}
        {/* filter with choix */}
        <div className="border-b pl-5 border-gray-200 py-6">
          <h3 className="font-normal tracking-widest   text-sm pb-6">CHOIX</h3>

          <div className=" space-y-3 max-h-60" id="filter-section-1">
            <div className="flex items-center group">
              <input
                id="filtre-choix-en-promo"
                name="choice"
                type="radio"
                value={"in-discount"}
                checked={isChecked("choice", "in-discount")}
                className={` h-3 w-3 appearance-none outline-none ${isChecked("choice", "in-discount") ? "bg-mediumBeige" : "bg-white"} rounded-sm h-5 w-5 border-gray-300 border hover:bg-lightBeige transition-all hover:shadow-strongBeige hover:shadow-lg cursor-pointer group   text-strongBeige `}
                onChange={() => handleChoiceFilterOptions("in-discount")}
              />
              <label
                htmlFor={`filtre-choix-en-promo`}
                className={`ml-3 text-sm tracking-widest cursor-pointer ${isChecked("choice", "in-discount") ? "text-black font-semibold" : "text-gray-600"} group-hover:text-black group-hover:font-semibold  transition-all`}
              >
                En Promo
              </label>
            </div>

            <div className="flex items-center group">
              <input
                id="filtre-choix-nouveau-produit"
                name="choice"
                type="radio"
                value={"new-product"}
                checked={isChecked("choice", "new-product")}
                className={` h-3 w-3 appearance-none outline-none ${isChecked("choice", "new-product") ? "bg-mediumBeige" : "bg-white"} rounded-sm h-5 w-5 border-gray-300 border hover:bg-lightBeige transition-all hover:shadow-lightBeige hover:shadow-lg cursor-pointer group    text-strongBeige `}
                onChange={() => handleChoiceFilterOptions("new-product")}
              />
              <label
                htmlFor={`filtre-choix-nouveau-produit`}
                className={`ml-3 text-sm tracking-widest cursor-pointer ${isChecked("choice", "new-product") ? "text-black font-semibold" : "text-gray-600"} group-hover:text-black group-hover:font-semibold  transition-all`}
              >
                Nouveau Produit
              </label>
            </div>
          </div>
        </div>
        {/* filter with main categories */}
        <div className="border-b pl-5 border-gray-200  py-3">
          <h3 className="font-normal tracking-widest text-sm  mb-6">
            CATEGORIES
          </h3>

          <ul
            role="list"
            className="space-y-4 pl-5   border-gray-200 text-sm font-medium text-gray-900"
          >
            {categories?.map((category: any, index) => (
              <li
                key={category.id}
                className={`${searchParams?.get("category") === category?.id ? "font-bold" : ""} hover:text-black hover:font-bold  relative cursor-pointer h-full w-full group transition-all flex items-center justify-between py-2 `}
              >
                <Link
                  href={`/Collections/tunisie/${prepRoute(category.name)}/?category=${category.id}`}
                  key={category.id}
                  className="w-full h-full"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  {category.name}
                </Link>
                <span
                  className={`  ${searchParams?.get("category") === category?.id ? "bg-strongBeige" : "bg-mediumBeige"} h-full w-[5px]  absolute right-0 group-hover:bg-strongBeige  rounded-lg border transition-all`}
                ></span>
              </li>
            ))}
          </ul>
        </div>
        {/* filter with prices */}
        <div className="border-b pl-5 border-gray-200 py-3">
          <h3 className="font-normal tracking-widest text-sm pb-2">PRIX</h3>
          <div className=" w-11/12" id="filter-section-0">
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
                onChange={handlePriceChange}
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
        {/* filter with colors */}
        <div className="border-b pl-5 border-gray-200 py-6">
          <h3 className="font-normal tracking-widest text-sm  mb-6">
            COULEURS
          </h3>

          <div className=" overflow-y-scroll max-h-60">
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
                    onChange={() => handleColorSelection(color.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* filter with Brands */}
        <div className="border-b pl-5 border-gray-200 py-6">
          <h3 className="font-normal tracking-widest text-sm  mb-6">MARKES</h3>

          <div className=" overflow-y-scroll max-h-60" id="filter-section-1">
            <div className="space-y-4">
              {Brands?.map((brand: any) => (
                <div key={brand.id} className="flex items-center">
                  <input
                    id={`filtre-brand-${brand.id}`}
                    name="brand"
                    type="radio"
                    value={brand.id}
                    checked={isChecked("brand", brand.id)}
                    className={` h-3 w-3 appearance-none outline-none ${isChecked("brand", brand.id) ? "bg-mediumBeige" : "bg-white"} rounded-sm h-5 w-5 border-gray-300 border hover:bg-lightBeige transition-all hover:shadow-strongBeige hover:shadow-lg cursor-pointer group   text-strongBeige `}
                    onChange={handleSelectFilterOptions}
                  />
                  <div className="flex items-center justify-between  w-full">
                    <label
                      htmlFor={`filtre-brand-${brand.id}`}
                      className="ml-3 text-sm tracking-wider text-gray-600 cursor-pointer group-hover:text-black group-hover:font-semibold hover:font-semibold transition-all"
                    >
                      {brand.name}
                    </label>
                    <span className=" text-gray-600 mr-3">
                      ({brand?.product?.length})
                    </span>
                  </div>
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
