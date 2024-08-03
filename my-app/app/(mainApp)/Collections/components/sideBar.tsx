"use client";
import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { IoIosClose } from "react-icons/io";
import { useToast } from "@/components/ui/use-toast";
import { useSidebarStore } from "@/app/store/zustand";
import { convertStringToQueriesObject } from "@/app/Helpers/_convertStringToQueriesObject";
import { debounce } from "lodash";
import prepRoute from "@/app/Helpers/_prepRoute";
import { convertValidStringQueries } from "@/app/Helpers/_convertValidStringQueries";

// Types
interface SideBarProps {
  colors: Color[];
  brands: Brand[];
  categories: Category[];
}

interface Color {
  id: string;
  Hex: string;
  color: string;
}

interface Brand {
  id: string;
  name: string;
  product: any[];
}

interface Category {
  id: string;
  name: string;
}

interface FilterQueries {
  [key: string]: string[];
}

// Component
const SideBar = ({ colors, brands, categories }: SideBarProps) => {
  // Hooks
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isOpenSideBard, toggleOpenSidebar } = useSidebarStore();

  // State
  const [selectedFilterQueries, setSelectedFilterQueries] =
    useState<FilterQueries>({});
  const [localPrice, setLocalPrice] = useState(500);

  // Effects
  useEffect(() => {
    const paramsObj = convertStringToQueriesObject(searchParams);
    setSelectedFilterQueries(paramsObj);
    const priceFromParams = searchParams?.get("price");
    if (priceFromParams) {
      setLocalPrice(+priceFromParams);
    }
  }, [searchParams]);

  // Callbacks
  const handleSelectFilterOptions = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
            (query) => query !== value,
          );
          if (updatedQueries[name].length === 0) {
            delete updatedQueries[name];
          }
        }
      }

      setSelectedFilterQueries(updatedQueries);
      router.push(
        `/Collections/tunisie?${convertValidStringQueries(updatedQueries)}&page=1`,
        {
          scroll: true,
        },
      );
    },
    [selectedFilterQueries, router],
  );

  const handleChoiceFilterOptions = useCallback(
    (value: string) => {
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
        {
          scroll: true,
        },
      );
      toggleOpenSidebar();
    },
    [selectedFilterQueries, router, toggleOpenSidebar],
  );

  const handleColorSelection = useCallback(
    (colorId: string) => {
      const updatedQueries = { ...selectedFilterQueries, color: [colorId] };
      setSelectedFilterQueries(updatedQueries);
      router.push(
        `/Collections/tunisie?${convertValidStringQueries(updatedQueries)}`,
        {
          scroll: true,
        },
      );
      toggleOpenSidebar();
    },
    [selectedFilterQueries, router, toggleOpenSidebar],
  );

  const debouncedUpdateUrl = useRef(
    debounce((price: number) => {
      router.push(`/Collections/tunisie?price=${price}`, { scroll: false });
    }, 300),
  ).current;

  useEffect(() => {
    // Initialize localPrice from URL on component mount
    const priceFromParams = searchParams?.get("price");
    if (priceFromParams) {
      setLocalPrice(+priceFromParams);
    }
  }, []);

  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPrice = Number(e.target.value);
      setLocalPrice(newPrice);
    },
    [],
  );

  const handlePriceChangeEnd = useCallback(() => {
    debouncedUpdateUrl(localPrice);
  }, [localPrice, debouncedUpdateUrl]);

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

  const handleCategoryClick = useCallback(
    (categoryId: string) => {
      const updatedQueries = {
        ...selectedFilterQueries,
        category: [categoryId],
      };
      setSelectedFilterQueries(updatedQueries);
      router.push(
        `/Collections/tunisie?${convertValidStringQueries(updatedQueries)}`,
        {
          scroll: false,
        },
      );
      toggleOpenSidebar();
    },
    [selectedFilterQueries, router, toggleOpenSidebar],
  );

  const isChecked = useCallback(
    (name: string, option: string) => {
      return Boolean(
        selectedFilterQueries[name] &&
          selectedFilterQueries[name].includes(option.toLowerCase()),
      );
    },
    [selectedFilterQueries],
  );

  // Render helpers
  const renderChoiceFilters = () => (
    <div className="border-b pl-5 border-gray-200 py-6">
      <h3 className="font-normal tracking-widest text-sm pb-6">CHOIX</h3>
      <div className="space-y-3 max-h-60" id="filter-section-1">
        {[
          { id: "in-discount", label: "En Promo" },
          { id: "new-product", label: "Nouveau Produit" },
        ].map((choice) => (
          <div key={choice.id} className="flex items-center group">
            <input
              id={`filtre-choix-${choice.id}`}
              name="choice"
              type="radio"
              value={choice.id}
              checked={isChecked("choice", choice.id)}
              className={`h-3 w-3 appearance-none outline-none ${
                isChecked("choice", choice.id)
                  ? "bg-secondaryColor"
                  : "bg-white"
              } rounded-sm h-5 w-5 border-gray-300 border hover:bg-lightBeige transition-all hover:shadow-primaryColor hover:shadow-lg cursor-pointer group text-primaryColor`}
              onChange={() => handleChoiceFilterOptions(choice.id)}
            />
            <label
              htmlFor={`filtre-choix-${choice.id}`}
              className={`ml-3 text-sm tracking-widest cursor-pointer ${
                isChecked("choice", choice.id)
                  ? "text-black font-semibold"
                  : "text-gray-600"
              } group-hover:text-black group-hover:font-semibold transition-all`}
            >
              {choice.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="border-b pl-5 border-gray-200 py-3">
      <h3 className="font-normal tracking-widest text-sm mb-6">CATEGORIES</h3>
      <ul className="space-y-4 pl-5 border-gray-200 text-sm font-medium text-gray-900">
        {categories?.map((category) => (
          <li
            key={category.id}
            className={`${
              searchParams?.get("category") === category?.id ? "font-bold" : ""
            } hover:text-black hover:font-bold relative cursor-pointer h-full w-full group transition-all flex items-center justify-between py-2`}
          >
            <Link
              href={`/Collections/tunisie/${prepRoute(category.name)}/?category=${category.id}`}
              className="w-full h-full"
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </Link>
            <span
              className={`${
                searchParams?.get("category") === category?.id
                  ? "bg-primaryColor"
                  : "bg-secondaryColor"
              } h-full w-[5px] absolute right-0 group-hover:bg-primaryColor rounded-lg border transition-all`}
            ></span>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderPriceFilter = () => (
    <div className="border-b pl-5 border-gray-200 py-3">
      <h3 className="font-normal tracking-widest text-sm pb-2">PRIX</h3>
      <div className="w-11/12" id="filter-section-0">
        <div className="relative mb-6">
          <label htmlFor="price-range-input" className="sr-only">
            Prix range
          </label>
          <input
            id="price-range-input"
            type="range"
            min="1"
            max="3000"
            value={localPrice}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            onChange={handlePriceChange}
            onMouseUp={handlePriceChangeEnd}
            onTouchEnd={handlePriceChangeEnd}
          />
          <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6">
            Min (1 TND)
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6">
            Max (3000 TND)
          </span>
        </div>
        <div className="flex justify-between mt-10">
          <span className="text-gray-400">de :</span>
          <div className="w-20 max-h-20 border flex justify-center border-gray-200 text-gray-400">
            1
          </div>
          <span className="text-gray-400">à :</span>
          <input
            type="number"
            className={`w-20 max-h-20 border text-center outline-1 focus:text-black outline-gray-300 border-gray-200 ${
              localPrice !== 500 ? "text-black" : "text-gray-400"
            }`}
            value={localPrice}
            onChange={handlePriceChange}
            onBlur={handlePriceChangeEnd}
            min="1"
            max="3000"
          />
          <span className="text-gray-400">TND</span>
        </div>
      </div>
    </div>
  );

  const renderColorFilters = () => (
    <div className="border-b pl-5 border-gray-200 py-6">
      <h3 className="font-normal tracking-widest text-sm mb-6">COULEURS</h3>
      <div className="overflow-y-scroll max-h-60">
        <div className="flex items-center flex-wrap px-3 w-full gap-3">
          {colors?.map((color) => (
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
                className="color-checkbox cursor-pointer shadow-md shadow-white"
                onChange={() => handleColorSelection(color.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBrandFilters = () => (
    <div className="border-b pl-5 border-gray-200 py-6">
      <h3 className="font-normal tracking-widest text-sm mb-6">MARKES</h3>
      <div className="overflow-y-scroll max-h-60" id="filter-section-1">
        <div className="space-y-4">
          {brands?.map((brand) => (
            <div key={brand.id} className="flex items-center">
              <input
                id={`filtre-brand-${brand.id}`}
                name="brand"
                type="radio"
                value={brand.id}
                checked={isChecked("brand", brand.id)}
                className={`h-3 w-3 appearance-none outline-none ${
                  isChecked("brand", brand.id)
                    ? "bg-secondaryColor"
                    : "bg-white"
                } rounded-sm h-5 w-5 border-gray-300 border hover:bg-lightBeige transition-all hover:shadow-primaryColor hover:shadow-lg cursor-pointer group text-primaryColor`}
                onChange={handleSelectFilterOptions}
              />
              <div className="flex items-center justify-between w-full">
                <label
                  htmlFor={`filtre-brand-${brand.id}`}
                  className="ml-3 text-sm tracking-wider text-gray-600 cursor-pointer group-hover:text-black group-hover:font-semibold hover:font-semibold transition-all"
                >
                  {brand.name}
                </label>
                <span className="text-gray-600 mr-3">
                  ({brand?.product?.length})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Main render
  return (
    <section
      aria-labelledby="products-heading"
      className={`w-96 overflow-y-auto z-30 top-0 h-full  transition-all bg-white shadow-md  ${
        isOpenSideBard ? "sticky" : "hidden md:block"
      }`}
    >
      <form className="relative pt-5 shadow-lg">
        <h3 className="font-semibold tracking-widest pl-5 text-lg pb-2">
          FILTRER
        </h3>

        {Object.keys(selectedFilterQueries).length > 0 && (
          <div
            onClick={handleClearFilters}
            className="flex items-center justify-center transition-all hover:text-red-700 cursor-pointer"
          >
            <button
              type="button"
              className="flex border rounded-md gap-2 items-center py-1 shadow px-2"
            >
              <IoIosClose size={25} />
              Effacer Filters
            </button>
          </div>
        )}

        {renderChoiceFilters()}
        {renderCategories()}
        {renderPriceFilter()}
        {renderColorFilters()}
        {renderBrandFilters()}
      </form>
    </section>
  );
};

export default React.memo(SideBar);
