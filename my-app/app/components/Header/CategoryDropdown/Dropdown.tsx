import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import Category from "./MainCategory";
import { CATEGORY_QUERY } from "../../../../graphql/queries";
interface Subcategory {
  name: string;
  subcategories?: Subcategory[];
}

const Dropdown = ({ setShowDropdown, showCategoryDropdown, isFixed }: any) => {
  const { error, data } = useQuery(CATEGORY_QUERY);
  const [activeCategory, setActiveCategory] = useState<string>("  ");

  useEffect(() => {
    if (data && data.categories && data.categories.length > 0) {
      setActiveCategory(data.categories[0].name);
    }
  }, [data]);

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div
      onMouseLeave={() => setShowDropdown(false)}
      className={`md:border  hidden z-[60] bg-white md:flex  left-24  md:gap-2 ${isFixed ? "fixed top-[90px]" : "absolute top-[155px]"} w-full max-w-[900px] md:shadow-md h-fit transition-all  ${
        showCategoryDropdown ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {data?.categories.length > 0 && (
        <Category
          data={data}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      )}

      {data?.categories.length <= 0 && (
        <p className="px-5 w-fit py-3  text-center tracking-wider ">
          Aucune catégorie disponible pour le moment. Veuillez revenir plus tard
          !
        </p>
      )}
    </div>
  );
};

export default Dropdown;
