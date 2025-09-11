import Link from "next/link";
import React, { memo } from "react";
import { IoIosArrowForward } from "react-icons/io";

interface Subcategory {
  id: string;
  name: string;
}

interface SubsubcategoryProps {
  subsubcategories: Subcategory[];
  parentSubCategoryName: string;
  parentCategoryName: string;
  setShowDropdown: (show: boolean) => void;

}

const Subsubcategory: React.FC<SubsubcategoryProps> = ({
  subsubcategories,
  setShowDropdown

}) => {
  return (
    <div className="mt-1 space-y-1 pl-2 opacity-100 transform-none">
      {subsubcategories?.map((subsubcategory, subIndex) => (
        <div
          key={subIndex}
          className="transition-opacity duration-200 ease-in-out"
        >
          <Link
            href={`/Collections/tunisie?${new URLSearchParams({
              category: subsubcategory.name,
            })}`}
            onClick={() => setShowDropdown(false)}
            className="py-1.5 px-2 group text-sm text-gray-600 hover:text-primaryColor flex items-center gap-1.5 transition-all rounded-md hover:bg-gray-50"
          >
            <IoIosArrowForward className="text-xs opacity-0 group-hover:opacity-100 transition-opacity text-primaryColor" />
            <span className="group-hover:translate-x-0.5 transition-transform duration-200">
              {subsubcategory.name}
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default memo(Subsubcategory);
