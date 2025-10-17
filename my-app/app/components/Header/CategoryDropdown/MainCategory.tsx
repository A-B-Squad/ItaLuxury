import React, { memo } from "react";
import Subcategory from "./Subcategory";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";

interface CategoryProps {
  mainCategories: Category[]; 
  setActiveCategory: (category: string) => void;
  activeCategory: string;
  setShowDropdown: (show: boolean) => void;
}

interface Category {
  id: string;
  name: string;
  bigImage?: string; 
  smallImage?: string;
  subcategories: SubcategoryType[];
}

interface SubcategoryType {
  id: string;
  name: string;
  parentId: string;
  smallImage?: string; 
  subcategories?: SubcategoryType[];
}

const Category: React.FC<CategoryProps> = ({
  mainCategories,
  setActiveCategory,
  activeCategory,
  setShowDropdown
}) => {

  console.log("Main Categories:", mainCategories);
  return (
    <div className="flex w-full">
      <div className="parentCategory min-w-[220px] py-2 border-r border-gray-100">
        <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3 px-3 font-medium">Collections</h3>
        <div className="space-y-1">
          {mainCategories?.map((category: Category, index: number) => (
            <div data-parentcategory={category.name} key={category.id}>
              <Link
                href={`/Collections/tunisie?${new URLSearchParams({
                  category: category.name,
                })}`}
                onMouseEnter={() => setActiveCategory(category.name)}
                onClick={() => setShowDropdown(false)}
                className={`group py-2.5 px-4 w-full cursor-pointer hover:bg-gray-50 flex items-center justify-between transition-all rounded-md ${category.name === activeCategory
                    ? "bg-gray-50 text-primaryColor font-medium"
                    : "text-gray-700 font-normal"
                  }`}
                data-category={category.name}
              >
                <span className="truncate">{category.name}</span>
                <IoIosArrowForward
                  className={`transition-all ${category.name === activeCategory
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
          {mainCategories
            ?.filter((category: Category) => category.name === activeCategory)
            .map((filteredCategory: Category) => (
              <Subcategory
                key={filteredCategory.id}
                parentCategoryName={activeCategory}
                subcategories={filteredCategory.subcategories}
                setShowDropdown={setShowDropdown}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default memo(Category);