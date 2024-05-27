import Link from "next/link";
import React from "react";
import prepRoute from "../../../Helpers/_prepRoute";
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
    <div className="flex relative flex-grow gap-3 flex-auto">
      {subcategories.map((subcategory: Subcategory, subIndex: number) => (
        <div key={subIndex} className="w-full relative gap-4  h-fit">
          <Link
            className="py-1 capitalize text-strongBeige block hover:font-bold transition-colors w-full group border-b-2 cursor-pointer "
            data-parentcategory={subcategory.parentId}
            href={`/Collections/tunisie/${prepRoute(subcategory.name)}/?category=${subcategory.id}`}
          >
            {subcategory.name}
          </Link>

          {subcategory.subcategories &&
            subcategory.subcategories.length > 0 && (
              <Subsubcategory subsubcategories={subcategory.subcategories} />
            )}
        </div>
      ))}
    </div>
  );
};

export default Subcategory;
