import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";

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
  categories.forEach((category: any) => {
    traverse(category);
  });

  return flattenedCategories;
};

const checkValidQuery = (queries: string[]) => {
  return queries.filter((query) => query !== "").length > 0;
};

export const convertStringToQueriesObject = (
  searchParams: ReadonlyURLSearchParams
) => {
  let selectedQueries: Record<string, string[]> = {};
  searchParams.forEach((values, key) => {
    const queries = values.split(",");
    if (selectedQueries[key]) {
      selectedQueries[key].push(...queries);
    } else {
      selectedQueries[key] = queries;
    }
  });
  return selectedQueries;
};

const convertValidStringQueries = (queries: Record<string, string[]>) => {
  let q = "";
  for (let [key, value] of Object.entries(queries)) {
    q = q + `${q === "" ? "" : "&"}${key}=${value}`;
  }

  return q;
};

const SideBar = ({ categories, colors }: any) => {
  const flattenedCategories = flattenCategories(categories);
  const [price, setPrice] = useState(500);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedFilterQueries, setSelectedFilterQueries] = useState<
    Record<string, string[]>
  >({});

  useEffect(() => {
    const paramsObj = convertStringToQueriesObject(searchParams);
    setSelectedFilterQueries(paramsObj);
  }, [searchParams]);

  const handleSelectFilterOptions = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    let selectedQueries = selectedFilterQueries;

    if (selectedQueries[name]) {
      if (type === "radio" || type === "range") {
        selectedQueries[name] = [value];
      } else if (selectedQueries[name].includes(value)) {
        selectedQueries[name] = selectedQueries[name].filter(
          (query) => query !== value
        );
        if (!checkValidQuery(selectedQueries[name])) {
          delete selectedQueries[name];
        }
      } else {
        selectedQueries[name].push(value);
      }
    } else if (selectedQueries) {
      selectedQueries[name] = [value];
    }

    router.push(`/Collections?${convertValidStringQueries(selectedQueries)}`,
  {scroll:false});
  };

  const isChecked = (name: string, option: string) => {
    return Boolean(
      selectedFilterQueries[name] &&
        selectedFilterQueries[name].includes(option.toLowerCase())
    );
  };

  return (
    <section
      aria-labelledby="products-heading"
      className="pb-24 pt-6 w-64 sticky top-0"
    >
      <h2 id="products-heading" className="sr-only">
        Products
      </h2>
      <form className="">
        <h3 className="sr-only">Categories</h3>
        <ul
          role="list"
          className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900"
        >
          {categories.map((category: any) => (
            <li>
              <a href="#">{category.name}</a>
            </li>
          ))}
        </ul>

        <div className="border-b border-gray-200 py-6">
          <h3 className="-my-3 flow-root">
            <button
              type="button"
              className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
              aria-controls="filter-section-0"
              aria-expanded="false"
            >
              <span className="font-medium text-gray-900">Price</span>
              <IoIosArrowForward />
            </button>
          </h3>
          <div className="pt-6" id="filter-section-0">
            <div className="relative mb-6">
              <label htmlFor="labels-range-input" className="sr-only">
                Labels range
              </label>
              <input
                id={price.toString()}
                type="range"
                min="1"
                max="3000"
                defaultValue="500"
                name="price"
                value={price}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer "
                onChange={(e: ChangeEvent<HTMLInputElement>)=>{
                  handleSelectFilterOptions(e)
                  setPrice(+e.target.value)
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
              <div className="w-20 max-h-20 flex justify-center border border-gray-200 text-gray-400">
                {" "}
                {price} TND
              </div>
            </div>
          </div>
        </div>
        <div className="border-b border-gray-200 py-6">
          <h3 className="-my-3 flow-root">
            <button
              type="button"
              className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
              aria-controls="filter-section-0"
              aria-expanded="false"
            >
              <span className="font-medium text-gray-900">Color</span>
              <IoIosArrowForward />
            </button>
          </h3>
          <div className="pt-6" id="filter-section-0">
            <div className="space-y-4">
              {colors.map((color: any) => (
                <div key={color.id} className="flex items-center">
                  <input
                    id={`filtre-color-${color.id}`}
                    name="color"
                    type="radio"
                    value={color.id}
                    checked={isChecked("color",color.id)}
                    className="h-4 w-4 rounded border-gray-300 text-strongBeige focus:ring-strongBeige"
                    onChange={handleSelectFilterOptions}
                  />
                  <label
                    htmlFor={`filtre-color-${color.id}`}
                    className="ml-3 text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    {color.color}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-b border-gray-200 py-6">
          <h3 className="-my-3 flow-root">
            <button
              type="button"
              className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
              aria-controls="filter-section-1"
              aria-expanded="false"
            >
              <span className="font-medium text-gray-900">Category</span>
              <IoIosArrowForward />
            </button>
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
                    type="radio"
                    value={category.id}
                    checked={isChecked("category",category.id)}
                    className="h-4 w-4 rounded border-gray-300  text-strongBeige focus:ring-strongBeige"
                    onChange={handleSelectFilterOptions}
                  />
                  <label
                    htmlFor={`filtre-color-${category.id}`}
                    className="ml-3 text-sm text-gray-600 hover:text-black transition-colors"
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
