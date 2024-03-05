import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";

import Category from "./Category";
interface Subcategory {
  name: string;
  subcategories?: Subcategory[]; // Make subcategories optional
}

const CATEGORY_QUERY = gql`
  query Categories {
    categories {
      id
      name
      subcategories {
        name
        parentId
        subcategories {
          name
          parentId
        }
      }
    }
  }
`;

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
      className={`  md:border md:p-5 md:flex md:gap-2 absolute md:h-fit md:w-3/4 md:shadow-md md:rounded-md  bg-white transition-all duration-700 z-30 ${
        showCategoryDropdown
          ? " mt-0 opacity-100  z-20"
          : "mt-64 opacity-0 -z-20"
      }`}
    >
      <Category
        data={data}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
    </div>
  );
};

export default Dropdown;
