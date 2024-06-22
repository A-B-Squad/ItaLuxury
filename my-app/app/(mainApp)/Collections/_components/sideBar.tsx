"use client";
import Link from "next/link";

import React, { useCallback, useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";

import { useSidebarStore } from "../../../store/zustand";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import prepRoute from "@/app/Helpers/_prepRoute";

// / ------------------!--------------------

import { convertValidStringQueries } from "@/app/Helpers/_convertValidStringQueries";
import { convertStringToQueriesObject } from "../../../Helpers/_convertStringToQueriesObject";
const SideBar = ({ colors, brands, categories }: any) => {
  const { toast } = useToast();

  const [priceChanged, setPriceChanged] = useState(false);
  const [localPrice, setLocalPrice] = useState(500);
  const router = useRouter();

  const searchParams: URLSearchParams | null = useSearchParams();
  const [selectedFilterQueries, setSelectedFilterQueries] = useState<
    Record<string, string[]>
  >({});
  const { isOpenSideBard, toggleOpenSidebar } = useSidebarStore();

  useEffect(() => {
    const paramsObj = convertStringToQueriesObject(searchParams);
    setSelectedFilterQueries(paramsObj);
  }, [searchParams]);

  const handleSelectFilterOptions = useCallback(
    (e: any) => {
      const { name, value, checked } = e.target;
      const updatedQueries = { ...selectedFilterQueries };
      delete updatedQueries["query"];
      if (name === "brand") {
        updatedQueries["brand"] = checked ? [value] : [];
      } else {
        if (checked) {
          updatedQueries[name] = updatedQueries[name]
            ? [...updatedQueries[name], value]
            : [value];
        } else {
          updatedQueries[name] = updatedQueries[name].filter(
            (query) => query !== value
          );
          if (updatedQueries[name].length === 0) {
            delete updatedQueries[name];
          }
        }
      }
      setSelectedFilterQueries(updatedQueries);
      router.push(
        `/Collections/tunisie?${convertValidStringQueries(updatedQueries)}&page=1`,
        { scroll: true }
      );
    },
    [selectedFilterQueries, router]
  );

  const handleChoiceFilterOptions = useCallback(
    (value: any) => {
      const updatedQueries = { ...selectedFilterQueries };
      if (value === "in-discount") {
        delete updatedQueries["new_product"];
        updatedQueries["choice"] = [value];
      } else if (value === "new-product") {
        delete updatedQueries["en_promo"];
        updatedQueries["choice"] = [value];
      }
      setSelectedFilterQueries(updatedQueries);
      router.push(
        `/Collections/tunisie?${convertValidStringQueries(updatedQueries)}`,
        { scroll: true }
      );
      toggleOpenSidebar();
    },
    [selectedFilterQueries, router, toggleOpenSidebar]
  );

  const handleColorSelection = useCallback(
    (colorId: string) => {
      const updatedQueries = { ...selectedFilterQueries, color: [colorId] };
      setSelectedFilterQueries(updatedQueries);
      router.push(
        `/Collections/tunisie?${convertValidStringQueries(updatedQueries)}`,
        { scroll: true }
      );
      toggleOpenSidebar();
    },
    [selectedFilterQueries, router, toggleOpenSidebar]
  );

  useEffect(() => {
    const paramsObj = convertStringToQueriesObject(searchParams);
    setSelectedFilterQueries(paramsObj);
    const priceFromParams = searchParams?.get("price");
    if (priceFromParams) {
      setLocalPrice(+priceFromParams);
    }
  }, [searchParams]);

  const handlePriceChange = useCallback((e: any) => {
    setPriceChanged(true);
    setLocalPrice(+e.target.value);
  }, []);

  const handlePriceChangeEnd = useCallback(() => {
    setLocalPrice(localPrice);
    router.push(`/Collections/tunisie?price=${localPrice}`, { scroll: false });
  }, [localPrice, router]);

  const handleClearFilters = useCallback(() => {
    setSelectedFilterQueries({});
    router.replace("/Collections/tunisie?page=1", { scroll: true });
    toggleOpenSidebar();
    toast({
      title: "Filtres réinitialisés",
      description: "Les filtres ont été réinitialisés avec succès.",
      className: "bg-primaryColor text-white",
    });
  }, [router, toggleOpenSidebar, toast]);

  const updateSearchParams = useCallback(
    (updatedQueries: any) => {
      router.push(
        `/Collections/tunisie?${convertValidStringQueries(updatedQueries)}`,
        { scroll: false }
      );
    },
    [router]
  );

  const handleCategoryClick = useCallback(
    (categoryId: string) => {
      const updatedQueries = {
        ...selectedFilterQueries,
        category: [categoryId],
      };
      setSelectedFilterQueries(updatedQueries);
      updateSearchParams(updatedQueries);
      toggleOpenSidebar();
    },
    [selectedFilterQueries, updateSearchParams, toggleOpenSidebar]
  );
  const isChecked = useCallback(
    (name: string, option: string) => {
      return Boolean(
        selectedFilterQueries[name] &&
          selectedFilterQueries[name].includes(option.toLowerCase())
      );
    },
    [selectedFilterQueries]
  );
  return (
    <section
      aria-labelledby="products-heading "
      className={`w-96  z-30  top-0 h-full transition-all bg-white shadow-md sticky ${isOpenSideBard ? "sticky" : "hidden md:block"} `}
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
                className: "bg-primaryColor text-white",
              });
            }}
            className="flex  items-center justify-center transition-all hover:text-red-700   cursor-pointer"
          >
            <button
              type="button"
              className="flex border rounded-md gap-2 items-center  py-1 shadow px-2"
            >
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
                className={` h-3 w-3 appearance-none outline-none ${isChecked("choice", "in-discount") ? "bg-secondaryColor" : "bg-white"} rounded-sm h-5 w-5 border-gray-300 border hover:bg-lightBeige transition-all hover:shadow-primaryColor hover:shadow-lg cursor-pointer group   text-primaryColor `}
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
                className={` h-3 w-3 appearance-none outline-none ${isChecked("choice", "new-product") ? "bg-secondaryColor" : "bg-white"} rounded-sm h-5 w-5 border-gray-300 border hover:bg-lightBeige transition-all hover:shadow-lightBeige hover:shadow-lg cursor-pointer group    text-primaryColor `}
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
            {categories?.map((category: any) => (
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
                  className={`  ${searchParams?.get("category") === category?.id ? "bg-primaryColor" : "bg-secondaryColor"} h-full w-[5px]  absolute right-0 group-hover:bg-primaryColor  rounded-lg border transition-all`}
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
                id={localPrice.toString()}
                type="range"
                min="1"
                max="3000"
                defaultValue={searchParams?.get("price") || "500"}
                name="price"
                value={localPrice}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer "
                onChange={handlePriceChange}
                onMouseUp={handlePriceChangeEnd}
                onTouchEnd={handlePriceChangeEnd}
              />
              <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6">
                Min (1 TND)
              </span>

              <span className="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6">
                Max (3000)
              </span>
            </div>
            <div className="flex justify-between mt-10">
              <span className="text-gray-400">de :</span>{" "}
              <div className="w-20 maw-h-20 border flex justify-center border-gray-200 text-gray-400">
                1
              </div>
              <span className="text-gray-400">à :</span>{" "}
              <input
                type="text"
                className={`w-20 max-h-20 border text-center outline-1 focus:text-black outline-gray-300 border-gray-200 ${priceChanged ? "text-black" : "text-gray-400"}`}
                value={localPrice || searchParams?.get("price") || 0}
                onChange={(e: any) => setLocalPrice(e.target.value)}
              />
              <span className="text-gray-400">TND</span>
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
              {brands?.map((brand: any) => (
                <div key={brand.id} className="flex items-center">
                  <input
                    id={`filtre-brand-${brand.id}`}
                    name="brand"
                    type="radio"
                    value={brand.id}
                    checked={isChecked("brand", brand.id)}
                    className={` h-3 w-3 appearance-none outline-none ${isChecked("brand", brand.id) ? "bg-secondaryColor" : "bg-white"} rounded-sm h-5 w-5 border-gray-300 border hover:bg-lightBeige transition-all hover:shadow-primaryColor hover:shadow-lg cursor-pointer group   text-primaryColor `}
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

export default React.memo(SideBar);
