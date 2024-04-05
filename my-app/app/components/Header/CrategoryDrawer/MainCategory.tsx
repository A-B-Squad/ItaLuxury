import React from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";

import Subcategory from "./Subcategory";

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
    <div className=" categories flex flex-col-reverse overflow-hidden">
      <div
        className={`parentCategory flex flex-col transition-all duration-300 ${
          activeCategory !== "" ? "-translate-x-full" : ""
        }`}
      >
        <h1 className="to-blue-300 text-xl font-bold text-center pr-7 py-2 ">
          Choisir une catégorie
        </h1>

        {data?.categories?.map((category: Category, index: number) => (
          <div
            key={index}
            onClick={() => setActiveCategory(category.name)}
            className={`flex mt-4 cursor-pointer focus:text-red-200 items-center justify-between py-2 px-7 w-full border-b-2 ${
              category.name === activeCategory
                ? "translate-x-0"
                : "translate-x-[full]"
            }`}
          >
            <p className="capitalize">{category.name}</p>
            {category.name === activeCategory ? (
              <MdKeyboardArrowDown size={20} />
            ) : (
              <MdKeyboardArrowRight size={20} />
            )}
          </div>
        ))}
      </div>

      <div
        className={`subCategories-Container transition-all duration-300 ${
          activeCategory !== "" ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {data?.categories
          ?.filter((category: Category) => category.name === activeCategory)
          .map((filteredCategory: Category, index: number) => (
            <Subcategory
              key={index}
              subcategories={filteredCategory.subcategories}
              backToMainCategory={setActiveCategory}
            />
          ))}
      </div>
    </div>
  );
};

export default Category;
