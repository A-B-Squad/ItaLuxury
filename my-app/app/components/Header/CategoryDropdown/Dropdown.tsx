import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import Category from "./MainCategory";
import { CATEGORY_QUERY } from "../../../../graphql/queries";
interface Subcategory {
  name: string;
  subcategories?: Subcategory[];
}



const Dropdown = ({ setShowDropdown, showCategoryDropdown }: any) => {
  const { loading, error, data } = useQuery(CATEGORY_QUERY);
  const [activeCategory, setActiveCategory] = useState<string>("");

  useEffect(() => {
    if (data && data.categories && data.categories.length > 0) {
      setActiveCategory(data.categories[0].name);
    }
  }, [data]);

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div
      onMouseLeave={() => setShowDropdown(false)}
      className={` md:border md:pl-5 hidden  md:flex md:py-5  md:gap-2 absolute md:h-fit md:w-3/4 md:shadow-md md:rounded-md h-fit  bg-white transition-all duration-700 ${
        showCategoryDropdown
          ? " mt-0 opacity-100 z-20"
          : "mt-56 opacity-0 -z-20"
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
        <p className="px-10 text-center tracking-wider ">
          Aucune catégorie disponible pour le moment. Veuillez revenir plus tard
          !
        </p>
      )}
    </div>
  );
};

export default Dropdown;
