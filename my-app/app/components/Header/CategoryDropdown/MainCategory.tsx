import React from "react";
import Subcategory from "./Subcategory";
import Link from "next/link";
import prepRoute from "../../Helpers/_prepRoute";

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
    <div className="categories flex  gap-3">
      <div className="parentCategory space-y-1">
        {data?.categories?.map((category: Category, index: number) => (
          <div data-parentcategory={category.name} key={index}>
            <Link
              href={`/Collections/${prepRoute(category.name)}/tunisie?category=${category.id}`}
              onMouseEnter={() => setActiveCategory(category.name)}
              className={` h-fit rounded-md py-1 px-2 w-fit cursor-pointer hover:bg-lightBeige hover:text-white transition-all ${
                category.name === activeCategory
                  ? "bg-strongBeige text-white"
                  : ""
              }`}
              data-category={category.name}
            >
              {category.name}
            </Link>
          </div>
        ))}
      </div>

      <div className="subCategories-Container   grid grid-cols-3 auto-cols-max	justify-center	">
        {data?.categories
          ?.filter((category: Category) => category.name === activeCategory)
          .map((filteredCategory: Category, index: number) => (
            <Subcategory
              key={index}
              subcategories={filteredCategory.subcategories}
            />
          ))}
      </div>
    </div>
  );
};

export default Category;
