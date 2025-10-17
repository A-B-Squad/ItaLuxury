"use client";
import React, { useState, useMemo, useCallback } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";
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
  const [activeSubcategory, setActiveSubcategory] = useState<string>("");

  // Get the currently active category object
  const activeCategoryObj = useMemo(
    () => fetchMainCategories.find((c) => c.name === activeCategory),
    [activeCategory, fetchMainCategories]
  );

  // Handle clicking a main category
  const handleCategoryClick = useCallback(
    (cat: Category) => {
      if (!cat.subcategories?.length) {
        // Navigate directly if no subcategories
        closeCategoryDrawer();
        window.location.href = `/Collections/tunisie?${new URLSearchParams({
          category: cat.name,
        })}`;
        return;
      }
      setActiveCategory(cat.name);
      setActiveSubcategory(""); // Reset active subcategory when switching main category
    },
    [closeCategoryDrawer]
  );

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Main Categories */}
      <div
        className={`absolute inset-0 transition-transform duration-300 ${activeCategory ? "-translate-x-full" : "translate-x-0"
          }`}
      >
        <h2 className="text-lg font-medium uppercase px-7 pt-4 mb-2">
          Choisir une catégorie :
        </h2>

        {fetchMainCategories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleCategoryClick(cat)}
            className="flex justify-between items-center px-7 py-3 border-b-2 cursor-pointer hover:bg-gray-50"
          >
            <div className="flex items-center gap-1">
              <Image loading="lazy" src={cat?.smallImage} alt="image category" width={40} height={40} />
              <span className="capitalize font-medium">{cat.name}</span>
            </div>

            {cat.subcategories?.length ? (
              activeCategory === cat.name ? (
                <MdKeyboardArrowDown size={20} />
              ) : (
                <MdKeyboardArrowRight size={20} />
              )
            ) : null}
          </div>
        ))}
      </div>

      {/* Subcategories */}
      {activeCategoryObj && (
        <Subcategory
          subcategories={activeCategoryObj.subcategories}
          parentCategoryName={activeCategoryObj.name}
          backToMainCategory={() => setActiveCategory("")}
          activeSubcategory={activeSubcategory}
          setActiveSubcategory={setActiveSubcategory}
          closeCategoryDrawer={closeCategoryDrawer}
        />
      )}
    </div>
  );
};

export default MainCategory;
