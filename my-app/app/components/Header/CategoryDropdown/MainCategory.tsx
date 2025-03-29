import React, { memo } from "react";
import Subcategory from "./Subcategory";
import Link from "next/link";
import prepRoute from "../../../Helpers/_prepRoute";
import { IoIosArrowForward } from "react-icons/io";

interface CategoryProps {
  data: {
    categories: Category[];
  };
  setActiveCategory: (category: string) => void;
  activeCategory: string;
}

interface Category {
  id: string;
  name: string;
  subcategories: SubcategoryType[];
}

// Define the SubcategoryType interface to fix the type error
interface SubcategoryType {
  id: string;
  name: string;
  parentId: string;
  subcategories?: SubcategoryType[];
}

const Category: React.FC<CategoryProps> = ({
  data,
  setActiveCategory,
  activeCategory,
}) => {
  return (
    <div className="flex w-full">
      <div className="parentCategory min-w-[220px] py-2 border-r border-gray-100">
        <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3 px-3 font-medium">Collections</h3>
        <div className="space-y-1">
          {data?.categories?.map((category: Category, index: number) => (
            <div data-parentcategory={category.name} key={index}>
              <Link
                href={`/Collections/tunisie/${prepRoute(category.name)}/?${new URLSearchParams(
                  {
                    category: category.name,
                  }
                )}`}
                onMouseEnter={() => setActiveCategory(category.name)}
                className={`group py-2.5 px-4 w-full cursor-pointer hover:bg-gray-50 flex items-center justify-between transition-all rounded-md ${
                  category.name === activeCategory
                    ? "bg-gray-50 text-primaryColor font-medium"
                    : "text-gray-700 font-normal"
                }`}
                data-category={category.name}
              >
                <span className="truncate">{category.name}</span>
                <IoIosArrowForward
                  className={`transition-all ${
                    category.name === activeCategory
                      ? "text-primaryColor"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                  size={14}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div 
        className="categories flex-grow p-4 transition-opacity duration-200 opacity-100 transform-none"
        key={activeCategory}
      >
        <div className="w-full">
          {data?.categories
            ?.filter((category: Category) => category.name === activeCategory)
            .map((filteredCategory: Category, index: number) => (
              <Subcategory
                key={index}
                parentCategoryName={activeCategory}
                subcategories={filteredCategory.subcategories}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default memo(Category);
