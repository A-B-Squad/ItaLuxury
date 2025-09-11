import Link from "next/link";
import React, { memo } from "react";
import Subsubcategory from "./Subsubcategory";

interface SubcategoryProps {
  subcategories: Subcategory[];
  parentCategoryName: string;
  setShowDropdown: (show: boolean) => void;

}

interface Subcategory {
  id: string;
  name: string;
  parentId: string;
  subcategories?: Subcategory[];
}

const Subcategory: React.FC<SubcategoryProps> = ({
  subcategories,
  parentCategoryName,
  setShowDropdown
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-100 transform-none">
      {subcategories.map((subcategory: Subcategory, subIndex: number) => (
        <div
          key={subIndex}
          className="w-full transition-opacity duration-300 ease-in-out"
        >
          <Link
            className="py-2 block text-primaryColor font-medium hover:text-primaryColor/80 transition-all border-b border-gray-100 mb-2"
            data-parentcategory={subcategory.parentId}
            onClick={() => setShowDropdown(false)}
            href={`/Collections/tunisie?${new URLSearchParams({
              category: subcategory.name,
            })}`}
          >
            {subcategory.name}
          </Link>

          {subcategory.subcategories && subcategory.subcategories.length > 0 && (
            <Subsubcategory
              parentCategoryName={parentCategoryName}
              parentSubCategoryName={subcategory.name}
              subsubcategories={subcategory.subcategories}
              setShowDropdown={setShowDropdown}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default memo(Subcategory);
