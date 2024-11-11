import React from "react";
import Subcategory from "./Subcategory";
import Link from "next/link";
import prepRoute from "../../../Helpers/_prepRoute";
import { IoIosArrowForward } from "react-icons/io";

interface CategoryProps {
  data: {
    categories: Category[];
  };
  setActiveCategory: (category: string) => void;
  activeCategory: string;
}

interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

const Category: React.FC<CategoryProps> = ({
  data,
  setActiveCategory,
  activeCategory,
}) => {
  return (
    <>
      <div className="parentCategory min-w-56 space-y-3  border-r">
        {data?.categories?.map((category: Category, index: number) => (
          <div data-parentcategory={category.name} key={index}>
            <Link
              href={`/Collections/tunisie/${prepRoute(category.name)}/?${new URLSearchParams(
                {
                  category: category.name,
                }
              )}`}
              onMouseEnter={() => setActiveCategory(category.name)}
              className={`  group h-fit  py-2 px-3 w-full cursor-pointer hover:bg-gray-100  justify-between flex items-center gap-1  hover:font-semibold font-light transition-all ${category.name === activeCategory
                  ? "bg-gray-100 font-semibold  "
                  : ""
                }`}
              data-category={category.name}
            >
              {category.name}
              <IoIosArrowForward
                className={` group-hover:text-black  transition-all ${category.name === activeCategory
                    ? "text-black  "
                    : "text-gray-700"
                  }`}
                size={13}
              />
            </Link>
          </div>
        ))}
      </div>

      <div className="categories flex px-3 flex-grow flex-wrap flex-auto gap-2">
        <div className="subCategories-Container  p-2   w-full		">
          {data?.categories
            ?.filter((category: Category) => category.name === activeCategory)
            .map((filteredCategory: Category, index: number) => (
              <Subcategory
                key={index}
                parentCategoryName={activeCategory}
                subcategories={filteredCategory.subcategories}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default Category;
