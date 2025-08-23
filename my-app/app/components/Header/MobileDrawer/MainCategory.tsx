import React, { useCallback, useMemo } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";

import Subcategory from "./Subcategory";
import Link from "next/link";

interface CategoryProps {
  data: {
    categories: Category[];
  };
  closeCategoryDrawer: any
  setActiveCategory: (category: string) => void;
  activeCategory: string;
}

interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}


const Category: React.FC<CategoryProps> = ({
  data,
  setActiveCategory,
  activeCategory,
  closeCategoryDrawer
}) => {
  // Memoize the transition classes to prevent recalculation
  const parentCategoryClasses = useMemo(() =>
    `parentCategory flex flex-col transition-all duration-300 ${activeCategory !== "" ? "-translate-x-full" : ""
    }`,
    [activeCategory]
  );

  const subCategoriesClasses = useMemo(() =>
    `subCategories-Container transition-all duration-300 ${activeCategory !== "" ? "translate-x-0" : "translate-x-full"
    }`,
    [activeCategory]
  );

  // Handle category selection with useCallback
  const handleCategoryClick = useCallback((categoryName: string) => {
    setActiveCategory(categoryName);
  }, [setActiveCategory]);

  // Filter active category once
  const activeSubcategories = useMemo(() =>
    data?.categories?.filter(
      (category: Category) => category.name === activeCategory
    ),
    [data, activeCategory]
  );

  return (
    <div className="categories flex flex-col-reverse overflow-hidden">
      <div className={parentCategoryClasses}>
        <h1 className="text-lg font-medium uppercase px-7 pt-4 mb-2">
          Choisir une catégorie :
        </h1>

        {data?.categories?.map((category: Category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.name)}
            className={`flex py-3 cursor-pointer hover:bg-gray-50 items-center justify-between px-7 w-full border-b-2 ${category.name === activeCategory ? "bg-gray-50" : ""
              }`}
          >
            <Link
              className="capitalize font-medium w-full"
              onClick={closeCategoryDrawer}
              href={`/Collections/tunisie?${new URLSearchParams({
                category: category.name,
              })}`}
              aria-label={`Catégorie ${category.name}`}
            >
              {category.name}
            </Link>
            {category.name === activeCategory ? (
              <MdKeyboardArrowDown size={20} aria-hidden="true" />
            ) : (
              <MdKeyboardArrowRight size={20} aria-hidden="true" />
            )}
          </div>
        ))}
      </div>

      <div className={subCategoriesClasses}>
        {activeSubcategories.map((filteredCategory: Category) => (
          <Subcategory
            key={filteredCategory.id}
            closeCategoryDrawer={closeCategoryDrawer}
            subcategories={filteredCategory.subcategories}
            parentCategoryName={activeCategory}
            backToMainCategory={setActiveCategory}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(Category);
