import Link from "next/link";
import React from "react";
import { MdOutlineArrowRight } from "react-icons/md";
import prepRoute from "../../../Helpers/_prepRoute";

interface Subcategory {
  id: string;
  name: string;
}

interface SubsubcategoryProps {
  subsubcategories: Subcategory[];
  parentSubCategoryName: string;
  parentCategoryName: string;
}

const Subsubcategory: React.FC<SubsubcategoryProps> = ({
  subsubcategories,
  parentSubCategoryName,
  parentCategoryName,
}) => {
  return (
    <>
      {subsubcategories?.map((subsubcategory, subIndex) => (
        <Link
          href={`/Collections/tunisie/?${new URLSearchParams({
            category: subsubcategory.name,

          })}
          `}
          className="py-1 group text-sm cursor-pointer transition-all relative  left-[-20px] flex hover:font-bold  "
          key={subIndex}
        >
          <MdOutlineArrowRight className="text-xl invisible group-hover:visible transition-all" />
          {subsubcategory.name}
        </Link>
      ))}
    </>
  );
};

export default Subsubcategory;
