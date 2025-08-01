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
  closeCategoryDrawer:any
}

const Subsubcategory: React.FC<SubsubcategoryProps> = ({
  subsubcategories,
  parentSubCategoryName,
  parentCategoryName,closeCategoryDrawer
}) => {
  return (
    <>
      {subsubcategories && subsubcategories.length > 0 ? (
        subsubcategories.map((subsubcategory, subIndex) => (
          <Link
          onClick={closeCategoryDrawer}
            href={`/Collections/tunisie/?${new URLSearchParams({
              category: subsubcategory.name,
           
            })}
          `} className="py-1 pl-5 group text-sm cursor-pointer transition-all relative left-2 flex hover:font-bold"
            key={subIndex}
          >
            <MdOutlineArrowRight className="text-xl transition-all" />
            {subsubcategory.name}
          </Link>
        ))
      ) : (
        <div className="text-center py-3 text-gray-500">
          Aucun sous-sous-catégorie disponible.
        </div>
      )}
    </>
  );
};

export default Subsubcategory;
