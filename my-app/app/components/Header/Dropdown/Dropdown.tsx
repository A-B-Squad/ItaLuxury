import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { MdOutlineArrowRight } from "react-icons/md";
import Link from "next/link";
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
      className={`  lg:border lg:p-5 lg:flex lg:gap-2 absolute lg:h-fit lg:w-3/4 lg:shadow-md lg:rounded-md  bg-white transition-all duration-700 z-30 ${
        showCategoryDropdown ? " mt-0 opacity-100" : " mt-0 opacity-100"
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
