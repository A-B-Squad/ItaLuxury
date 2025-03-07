"use client";

import { convertStringToQueriesObject } from "@/app/Helpers/_convertStringToQueriesObject";
import prepRoute from "@/app/Helpers/_prepRoute";
import { useSidebarStore } from "@/app/store/zustand";
import { useToast } from "@/components/ui/use-toast";
import { Drawer, IconButton, Typography } from "@material-tailwind/react";
import { debounce } from "lodash";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IoIosClose } from "react-icons/io";

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
  Product: any[];
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
const SideBar: React.FC<SideBarProps> = ({ colors, brands, categories }) => {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isOpenSideBard, toggleOpenSidebar } = useSidebarStore();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [selectedFilterQueries, setSelectedFilterQueries] =
    useState<FilterQueries>({});
  const [localPrice, setLocalPrice] = useState<number>(500);

  const urlParams = useMemo(() => {
    return convertStringToQueriesObject(searchParams);
  }, [searchParams]);

  // Initialize filters and price from URL parameters
  useEffect(() => {
    setSelectedFilterQueries(urlParams);
    const priceFromParams = searchParams?.get("price");
    if (priceFromParams) {
      setLocalPrice(+priceFromParams);
    }
  }, [urlParams, searchParams]);


  // Handle window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Helper function to build query string
  // This function handles different formatting for color, choice, and brand vs other filters
  const buildQueryString = useMemo(() => {
    return (queries: FilterQueries): string => {
      return Object.entries(queries)
        .filter(([_, values]) => values.length > 0)
        .map(
          ([key, values]) =>
            key === "color" || key === "choice" || key === "brand"
              ? values
                .map((value) => `${key}=${encodeURIComponent(value)}`)
                .join("&")
              : `${key}=${values.map(encodeURIComponent).join(",")}`
        )
        .join("&");
    };
  }, []);

  // Handle brand filter selection
  const handleSelectBrandFilterOptions = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, checked } = e.target;
      const updatedQueries = { ...selectedFilterQueries };

      if (name === "brand") {
        updatedQueries["brand"] = checked ? [value] : [];
      } else {
        updatedQueries[name] = checked
          ? [...(updatedQueries[name] || []), value]
          : (updatedQueries[name] || []).filter((query) => query !== value);

        if (updatedQueries[name]?.length === 0) {
          delete updatedQueries[name];
        }
      }

      setSelectedFilterQueries(updatedQueries);
      router.push(`/Collections/tunisie?${buildQueryString(updatedQueries)}`, {
        scroll: true,
      });
    },
    [selectedFilterQueries, router]
  );

  const handleChoiceFilterOptions = useCallback(
    (value: string) => {
      const updatedQueries: { [key: string]: string[] } = {
        ...selectedFilterQueries,
      };

      // Update the 'choice' parameter as an array
      updatedQueries["choice"] = [value];

      // Remove unnecessary parameters
      delete updatedQueries["page"];

      setSelectedFilterQueries(updatedQueries);

      // Build the query string
      const queryString = buildQueryString(updatedQueries);
      const newUrl = `/Collections/tunisie?${queryString}`;

      router.push(newUrl, { scroll: true });
      toggleOpenSidebar();
    },
    [selectedFilterQueries, router, toggleOpenSidebar, buildQueryString]
  );
  const handleColorSelection = useCallback(
    (colorName: string) => {
      const updatedQueries = { ...selectedFilterQueries, color: [colorName] };
      setSelectedFilterQueries(updatedQueries);
      router.push(`/Collections/tunisie?${buildQueryString(updatedQueries)}`, {
        scroll: true,
      });
      toggleOpenSidebar();
    },
    [selectedFilterQueries, router, toggleOpenSidebar]
  );

  // Debounced price update
  const debouncedUpdateUrl = useRef(
    debounce((price: number) => {
      router.push(`/Collections/tunisie?price=${price}`, { scroll: false });
    }, 300)
  ).current;

  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPrice = Number(e.target.value);
      setLocalPrice(newPrice);
    },
    []
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
      router.push(`/Collections/tunisie?${buildQueryString(updatedQueries)}`, {
        scroll: false,
      });
      toggleOpenSidebar();
    },
    [selectedFilterQueries, router, toggleOpenSidebar]
  );

  const isChecked = useMemo(() => {
    return (name: string, option: string) => {
      return Boolean(
        selectedFilterQueries[name] &&
        selectedFilterQueries[name].includes(option)
      );
    };
  }, [selectedFilterQueries]);

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
              style={{
                WebkitAppearance: "none",
                appearance: "none",
              }}
              id={`filtre-choix-${choice.id}`}
              name="choice"
              type="radio"
              value={choice.id}
              checked={isChecked("choice", choice.id)}
              className={`h-3 w-3  outline-none ${isChecked("choice", choice.id)
                ? "bg-secondaryColor"
                : "bg-white"
                } rounded-sm h-5 w-5 border-gray-300 border hover:bg-lightBeige transition-all hover:shadow-primaryColor hover:shadow-lg cursor-pointer group text-primaryColor`}
              onChange={() => handleChoiceFilterOptions(choice.id)}
            />
            <label
              htmlFor={`filtre-choix-${choice.id}`}
              className={`ml-3 text-sm tracking-widest cursor-pointer ${isChecked("choice", choice.id)
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
            className={`${searchParams?.get("category") === category?.id ? "font-bold" : ""
              } hover:text-black hover:font-bold relative cursor-pointer h-full w-full group transition-all flex items-center justify-between py-2`}
          >
            <Link
              href={`/Collections/tunisie/?${new URLSearchParams({
                category: category.name,
              })}
              `}
              className="w-full h-full"
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </Link>
            <span
              className={`${searchParams?.get("category") === category?.id
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
            style={{
              WebkitAppearance: "none",
              appearance: "none",
            }}
            id="price-range-input"
            type="range"
            min="1"
            max="3000"
            value={localPrice}
            className="w-full h-full max-h-6 bg-gray-200 rounded-lg  cursor-pointer"
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
          <div className="w-20 max-h-20 h-full border flex justify-center border-gray-200 text-gray-400">
            1
          </div>
          <span className="text-gray-400">à :</span>
          <input
            type="number"
            className={`w-20  border max-h-6 text-center outline-1 focus:text-black outline-gray-300 border-gray-200 ${localPrice !== 500 ? "text-black" : "text-gray-400"
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
      <div className="overflow-y-auto max-h-60">
        <div className="flex items-center flex-wrap px-3 w-full gap-3">
          {colors
            ?.filter((color) => color.Product?.length > 0)
            .map((color) => (
              <div key={color.id} className="flex items-center">
                <input
                  id={`filtre-color-${color.color}`}
                  name="color"
                  type="checkbox"
                  value={color.id}
                  checked={isChecked("color", color.color)}
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    appearance: "none",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    outline: "none",
                    background: color.Hex,
                    border: isChecked("color", color.color)
                      ? "2px solid black"
                      : "2px solid gray",
                    transition: "border-color 0.3s",
                  }}
                  title={color.color}
                  className="color-checkbox cursor-pointer shadow-md shadow-white"
                  onChange={() => handleColorSelection(color.color)}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const filteredBrands = useMemo(() => {
    return selectedFilterQueries.category?.length
      ? brands.filter((brand) =>
        brand.product.some((product) =>
          product.categories.some((category: { name: string }) =>
            selectedFilterQueries.category.includes(category.name)
          )
        )
      )
      : brands;
  }, [brands, selectedFilterQueries.category]);
  const BrandFilters = memo(() => {
    return (
      <div className="border-b pl-5 border-gray-200 py-6">
        <h3 className="font-normal tracking-widest text-sm mb-6">MARKES</h3>
        <div className="overflow-y-auto max-h-60" id="filter-section-1">
          <div className="space-y-4">
            {filteredBrands?.map(
              (brand: {
                id: React.Key;
                name: string;
                product: string | any[];
              }) => {
                return (
                  <div key={brand.id} className="flex items-center">
                    <input
                      id={`filtre-brand-${brand.id}`}
                      name="brand"
                      type="radio"
                      value={brand.name}
                      checked={isChecked("brand", brand.name)}
                      className={`h-3 w-3 outline-none ${isChecked("brand", brand.name) ? "bg-secondaryColor" : "bg-white"} rounded-sm h-5 w-5 border-gray-300 border hover:bg-lightBeige transition-all  hover:shadow-lg cursor-pointer group text-primaryColor`}
                      onChange={handleSelectBrandFilterOptions}
                      aria-label={`Filter by ${brand.name}`}
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
                );
              }
            )}
          </div>
        </div>
      </div>
    );
  });

  const renderBrandFilters = () => {
    return <BrandFilters />;
  };

  // Main render
  const renderDrawerContent = () => (
    <>
      {renderChoiceFilters()}
      {renderCategories()}
      {renderPriceFilter()}
      {renderColorFilters()}
      {renderBrandFilters()}
    </>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          placeholder={""}
          onPointerEnterCapture={""}
          onPointerLeaveCapture={""}
          open={isOpenSideBard}
          onClose={toggleOpenSidebar}
          size={300}
          className="p-4 flex flex-col h-full z-[9999]"
          overlayProps={{ className: "bg-black/50" }}
        >
          <div className="mb-6 flex items-center justify-between">
            <Typography
              placeholder={""}
              onPointerEnterCapture={""}
              onPointerLeaveCapture={""}
              variant="h5"
              color="blue-gray"
            >
              FILTRER
            </Typography>
            <IconButton
              placeholder={""}
              onPointerEnterCapture={""}
              onPointerLeaveCapture={""}
              variant="text"
              color="blue-gray"
              onClick={toggleOpenSidebar}
            >
              <IoIosClose size={24} />
            </IconButton>
          </div>
          <div className=" pb-16  flex-grow overflow-y-auto ">
            <form className="relative">
              {Object.keys(selectedFilterQueries).length > 0 && (
                <div
                  onClick={handleClearFilters}
                  className="flex items-center justify-center transition-all overflow-y-auto hover:text-red-700 cursor-pointer mb-4"
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

              {renderDrawerContent()}
            </form>
          </div>
        </Drawer>
      ) : (
        <section
          aria-labelledby="products-heading"
          className="overflow-y-auto z-50 w-80 h-fit py-5 transition-all bg-white shadow-md relative top-16"
        >
          <form className="relative pt-5">
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

            {renderDrawerContent()}
          </form>
        </section>
      )}
    </>
  );
};

export default React.memo(SideBar, (prevProps, nextProps) => {
  // Only re-render if the data has actually changed
  return (
    prevProps.colors === nextProps.colors &&
    prevProps.brands === nextProps.brands &&
    prevProps.categories === nextProps.categories
  );
});