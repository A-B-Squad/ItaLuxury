"use client";
import React, { useState, useMemo, useCallback } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import Subcategory from "./Subcategory";
import Image from "next/image";

interface SubcategoryType {
  id: string;
  name: string;
  smallImage: string;
  parentId: string;
  subcategories?: SubcategoryType[];
}

interface Category {
  id: string;
  name: string;
  bigImage: string;
  smallImage: string;
  subcategories: SubcategoryType[];
}

interface MainCategoryProps {
  fetchMainCategories: Category[];
  closeCategoryDrawer: () => void;
}

const MainCategory: React.FC<MainCategoryProps> = ({
  fetchMainCategories,
  closeCategoryDrawer,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("");

  const activeCategoryObj = useMemo(
    () => fetchMainCategories.find((c) => c.name === activeCategory),
    [activeCategory, fetchMainCategories]
  );

  const handleCategoryNameClick = useCallback(
    (cat: Category) => {
      closeCategoryDrawer();
      globalThis.location.href = `/Collections?${new URLSearchParams({
        category: cat.name,
      })}`;
    },
    [closeCategoryDrawer]
  );

  const handleArrowClick = useCallback((cat: Category) => {
    if (cat.subcategories?.length) {
      setActiveCategory(cat.name);
    }
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Main Categories */}
      <div
        className={`absolute inset-0 transition-transform duration-300 ease-in-out overflow-y-auto custom-scrollbar ${activeCategory ? "-translate-x-full" : "translate-x-0"
          }`}
      >
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Choisir une catégorie
          </h2>
        </div>

        <div className="py-2">
          {fetchMainCategories.map((cat) => (
            <div
              key={cat.id}
              className="flex justify-between items-center px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              <button
                onClick={() => handleCategoryNameClick(cat)}
                className="flex items-center gap-3 flex-1 cursor-pointer group bg-transparent border-none text-left p-0"
                aria-label={`View ${cat.name} category`}
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    loading="lazy"
                    src={cat?.smallImage}
                    alt={cat.name}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
                <span className="capitalize font-medium text-gray-800 group-hover:text-gray-900">
                  {cat.name}
                </span>
              </button>

              {cat.subcategories?.length > 0 && (
                <button
                  onClick={() => handleArrowClick(cat)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                  aria-label={`View ${cat.name} subcategories`}
                >
                  <MdKeyboardArrowRight
                    size={22}
                    className="text-gray-400 hover:text-gray-600"
                  />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Subcategories */}
      {activeCategoryObj && (
        <Subcategory
          subcategories={activeCategoryObj.subcategories}
          parentCategoryName={activeCategoryObj.name}
          backToMainCategory={() => setActiveCategory("")}
          closeCategoryDrawer={closeCategoryDrawer}
        />
      )}
    </div>
  );
};

export default MainCategory;