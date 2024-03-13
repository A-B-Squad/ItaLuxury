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
          className="py-1 group text-sm cursor-pointer transition-all relative  left-[-20px] flex hover:font-bold  "
          key={subIndex}
        >
          <MdOutlineArrowRight className="text-xl invisible  group-hover:visible  transition-all" />
          {subsubcategory.name}
        </Link>
      ))}
    </>
  );
};

export default Subsubcategory;
