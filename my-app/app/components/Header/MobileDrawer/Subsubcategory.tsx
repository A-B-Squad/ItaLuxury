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
      {subsubcategories && subsubcategories.length > 0 ? (
        subsubcategories.map((subsubcategory, subIndex) => (
          <Link
            href={`/Collections/tunisie/${prepRoute(subsubcategory.name)}/?category=${subsubcategory.name}&categories=${[parentCategoryName, parentSubCategoryName, subsubcategory.name]}`}
            className="py-1 pl-5 group text-sm cursor-pointer transition-all relative left-2 flex hover:font-bold"
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
