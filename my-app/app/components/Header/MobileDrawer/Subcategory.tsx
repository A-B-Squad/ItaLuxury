import Link from "next/link";
import React from "react";
import { IoArrowBack } from "react-icons/io5";
import prepRoute from "../../../Helpers/_prepRoute";
import Subsubcategory from "./Subsubcategory";

interface SubcategoryProps {
  subcategories: Subcategory[];
  backToMainCategory: (category: string) => void;
  parentCategoryName: string;
  closeCategoryDrawer: any
}

interface Subcategory {
  id: string;
  name: string;
  parentId: string;
  subcategories?: Subcategory[];
}

const Subcategory: React.FC<SubcategoryProps> = ({
  subcategories,
  backToMainCategory,
  parentCategoryName, closeCategoryDrawer
}) => {
  return (
    <>
      <div
        onClick={() => backToMainCategory("")}
        className="flex gap-3 hover:bg-[#f7f7f7] transition-all cursor-pointer justify-around font-bold uppercase items-center py-3"
      >
        <IoArrowBack size={25} />
        <p>Menu Principal</p>
      </div>

      {subcategories.length > 0 ? (
        subcategories.map((subcategory: Subcategory, subIndex: number) => (
          <div key={subIndex} className="h-fit cursor-pointer">
            <Link
              onClick={closeCategoryDrawer}
              href={`/Collections/tunisie/?${new URLSearchParams({
                category: subcategory.name,
              })}
  `} className="py-1 pl-5 font-bold text-primaryColor hover:font-bold w-full block transition-colors group border-b-2 cursor-pointer"
              data-parentcategory={subcategory.parentId}
            >
              {subcategory.name}
            </Link>

            {subcategory.subcategories &&
              subcategory.subcategories.length > 0 && (
                <Subsubcategory
                  subsubcategories={subcategory.subcategories}
                  parentCategoryName={parentCategoryName}
                  closeCategoryDrawer={closeCategoryDrawer}
                  parentSubCategoryName={subcategory.name}
                />
              )}
          </div>
        ))
      ) : (
        <div className="text-center py-5 text-gray-500">
          Aucun sous-catégorie disponible.
        </div>
      )}
    </>
  );
};

export default Subcategory;
