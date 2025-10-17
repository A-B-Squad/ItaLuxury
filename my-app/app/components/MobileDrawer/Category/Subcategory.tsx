import React, { memo, useMemo } from "react";
import { IoArrowBack } from "react-icons/io5";
import { MdKeyboardArrowRight } from "react-icons/md";
import Subsubcategory from "./Subsubcategory";
import Image from "next/image";

interface SubcategoryType {
  id: string;
  name: string;
  smallImage: string;
  parentId: string;
  subcategories?: SubcategoryType[];
}

interface SubcategoryProps {
  subcategories: SubcategoryType[];
  parentCategoryName: string;
  backToMainCategory: () => void;
  activeSubcategory: string;
  setActiveSubcategory: (name: string) => void;
  closeCategoryDrawer: () => void;
}

const Subcategory: React.FC<SubcategoryProps> = ({
  subcategories,
  parentCategoryName,
  backToMainCategory,
  activeSubcategory,
  setActiveSubcategory,
  closeCategoryDrawer,
}) => {
  // Get the active subcategory object
  const activeSubcategoryObj = useMemo(
    () => subcategories.find((sub) => sub.name === activeSubcategory),
    [activeSubcategory, subcategories]
  );

  if (!subcategories?.length) {
    return (
      <div className="absolute inset-0 flex flex-col justify-center items-center text-gray-500 bg-white">
        <button
          onClick={backToMainCategory}
          className="flex items-center gap-3 px-7 py-3 font-bold uppercase hover:bg-gray-50"
        >
          <IoArrowBack size={22} />
          Menu principal
        </button>
        <p className="py-5">Aucune sous-catégorie disponible.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Subcategories List */}
      <div
        className={`absolute inset-0 transition-transform duration-300 bg-white ${activeSubcategory ? "-translate-x-full" : "translate-x-0"
          }`}
      >
        <h2 className="text-lg font-medium uppercase px-7 pt-4 mb-2">
          Choisir une sous-catégorie :
        </h2>

        {/* Back button */}
        <button
          onClick={backToMainCategory}
          className="flex items-center gap-3 px-7 py-3 font-bold uppercase hover:bg-gray-50 w-full transition-all border-b-2"
        >
          <IoArrowBack size={22} />
          Menu principal
        </button>

        <div className="mt-2">
          {subcategories.map((sub) => (
            <div
              key={sub.id}
              onClick={() => {
                if (!sub.subcategories?.length) {
                  // Navigate directly if no sub-subcategories
                  closeCategoryDrawer();
                  window.location.href = `/Collections/tunisie?${new URLSearchParams({
                    category: sub.name,
                  })}`;
                } else {
                  setActiveSubcategory(sub.name);
                }
              }}
              className="flex justify-between items-center px-7 py-3 border-b cursor-pointer hover:bg-gray-50"
            >
              <div className="flex items-center">
                <Image loading="lazy" src={sub?.smallImage} alt="imageSubcategory" width={40} height={40} />
                <span className="font-semibold text-primaryColor capitalize">
                  {sub.name}
                </span>
              </div>
              {sub.subcategories?.length ? (
                <MdKeyboardArrowRight size={20} />
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* Sub-subcategories Panel */}
      {activeSubcategoryObj && activeSubcategoryObj.subcategories?.length && (
        <Subsubcategory
          subsubcategories={activeSubcategoryObj.subcategories}
          parentSubcategoryName={activeSubcategoryObj.name}
          backToSubcategory={() => setActiveSubcategory("")}
          closeCategoryDrawer={closeCategoryDrawer}
        />
      )}
    </div>
  );
};

export default memo(Subcategory);