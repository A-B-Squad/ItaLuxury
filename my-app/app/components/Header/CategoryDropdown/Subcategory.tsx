import Link from "next/link";
import React from "react";
import prepRoute from "../../_prepRoute";
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
        <div key={subIndex} className="ml-10 h-fit">
          <Link
            href={{
              pathname: `/${prepRoute(subcategory.name)}-tunisie`,
              query: {
                category: subcategory.name,
              },
            }}
            className="py-1  text-strongBeige hover:font-bold transition-colors  group border-b-2 cursor-pointer "
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
