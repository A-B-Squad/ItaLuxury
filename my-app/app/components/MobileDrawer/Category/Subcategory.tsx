import React, { memo, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
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
  closeCategoryDrawer: () => void;
}

const Subcategory: React.FC<SubcategoryProps> = ({
  subcategories,
  parentCategoryName,
  backToMainCategory,
  closeCategoryDrawer,
}) => {
  const [expandedSubcategory, setExpandedSubcategory] = useState<string>("");

  if (!subcategories?.length) {
    return (
      <div className="absolute inset-0 flex flex-col bg-white">
        <button
          onClick={backToMainCategory}
          className="flex items-center gap-3 px-6 py-4 font-semibold text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-200"
        >
          <IoArrowBack size={20} />
          <span>Retour</span>
        </button>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-sm">Aucune sous-catégorie disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-white overflow-y-auto">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
          Sous-catégories
        </h2>
      </div>

      {/* Back button */}
      <button
        onClick={backToMainCategory}
        className="flex items-center gap-3 px-6 py-4 font-semibold text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-200 w-full"
      >
        <IoArrowBack size={20} />
        <span>Menu principal</span>
      </button>

      <div className="py-2">
        {subcategories.map((sub) => (
          <div key={sub.id}>
            <div className="flex justify-between items-center px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
              <button
                onClick={() => {
                  closeCategoryDrawer();
                  globalThis.location.href = `/Collections?${new URLSearchParams({
                    category: sub.name,
                  })}`;
                }}
                className="flex items-center gap-3 flex-1 cursor-pointer group bg-transparent border-none text-left p-0"
                aria-label={`View ${sub.name} category`}
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    loading="lazy"
                    src={sub?.smallImage}
                    alt={sub.name}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
                <span className="font-medium text-gray-800 capitalize group-hover:text-gray-900">
                  {sub.name}
                </span>
              </button>

              {sub.subcategories && sub.subcategories.length > 0 && (
                <button
                  onClick={() => setExpandedSubcategory(
                    expandedSubcategory === sub.name ? "" : sub.name
                  )}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                  aria-label={`${expandedSubcategory === sub.name ? 'Collapse' : 'Expand'} ${sub.name} subcategories`}
                >
                  {expandedSubcategory === sub.name ? (
                    <MdKeyboardArrowDown size={22} className="text-gray-600" />
                  ) : (
                    <MdKeyboardArrowRight size={22} className="text-gray-400" />
                  )}
                </button>
              )}
            </div>

            {/* Expanded subsubcategories */}
            {expandedSubcategory === sub.name && sub.subcategories && (
              <Subsubcategory
                subsubcategories={sub.subcategories}
                closeCategoryDrawer={closeCategoryDrawer}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(Subcategory);