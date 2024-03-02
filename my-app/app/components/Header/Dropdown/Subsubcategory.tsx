import React from "react";
import { MdOutlineArrowRight } from "react-icons/md";
import Link from "next/link";

interface Subcategory {
  name: string;
}

interface SubsubcategoryProps {
  subsubcategories: Subcategory[];
}

const Subsubcategory: React.FC<SubsubcategoryProps> = ({
  subsubcategories,
}) => {
  return (
    <>
      {subsubcategories?.map((subsubcategory, subIndex) => (
        <Link
          href={`/${subsubcategory.name}-Touslesproduits`}
          className="py-1 group cursor-pointer text-red-800 flex items-center "
          key={subIndex}
        >
          <MdOutlineArrowRight className="text-xl group-hover:opacity-100 opacity-0 transition-all" />
          {subsubcategory.name}
        </Link>
      ))}
    </>
  );
};

export default Subsubcategory;
