import React from "react";
import Link from "next/link";
import Subsubcategory from "./Subsubcategory";

interface SubcategoryProps {
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  parentId: string;
  subcategories?: Subcategory[];
}

const Subcategory: React.FC<SubcategoryProps> = ({ subcategories }) => {
  return (
    <>
      {subcategories.map((subcategory: Subcategory, subIndex: number) => (
        <div key={subIndex} className="px-5">
          <Link
            href={`/${subcategory.name}-Touslesproduits`}
            className="py-2 group text-blue-800 cursor-pointer "
            data-parentcategory={subcategory.parentId}
          >
            {subcategory.name}
          </Link>
          {subcategory.subcategories &&
            subcategory.subcategories.length > 0 && (
              <Subsubcategory subsubcategories={subcategory.subcategories} />
            )}
        </div>
      ))}
    </>
  );
};

export default Subcategory;
