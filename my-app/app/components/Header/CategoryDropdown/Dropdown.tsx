import { useQuery } from "@apollo/client";
import React, { useEffect, useState, useMemo } from "react";
import Category from "./MainCategory";
import { CATEGORY_QUERY } from "../../../../graphql/queries";

interface DropdownProps {
  setShowDropdown: (show: boolean) => void;
  showCategoryDropdown: boolean;
  isFixed: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ 
  setShowDropdown, 
  showCategoryDropdown, 
  isFixed 
}) => {
  const { error, data, loading } = useQuery(CATEGORY_QUERY, {
    fetchPolicy: 'cache-first'
  });
  
  const [activeCategory, setActiveCategory] = useState<string>("");

  // Set initial active category when data loads
  useEffect(() => {
    if (data?.categories?.length > 0) {
      setActiveCategory(data.categories[0].name);
    }
  }, [data]);

  // Improved dropdown position classes for better scroll behavior
  const positionClasses = useMemo(() => {
    if (isFixed) {
      return "fixed top-[185px] left-10 ";
    }
    return "absolute top-full left-10 ";
  }, [isFixed]);

  // Memoize visibility classes
  const visibilityClasses = useMemo(() => 
    showCategoryDropdown ? "opacity-100 visible" : "opacity-0 invisible", 
  [showCategoryDropdown]);

  if (error) {
    console.error("Error loading categories:", error);
    return (
      <div className="container p-4 text-red-500">
        Une erreur s'est produite lors du chargement des catégories.
      </div>
    );
  }

  return (
    <div
      onMouseLeave={() => setShowDropdown(false)}
      className={`container md:border hidden z-[60] bg-white md:flex md:gap-2 ${positionClasses} w-full max-w-[900px] md:shadow-md h-fit transition-all duration-300 ${visibilityClasses}`}
      aria-hidden={!showCategoryDropdown}
    >
      {loading ? (
        <div className="p-4 w-full flex justify-center">
          <div className="animate-pulse space-y-4 w-full">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      ) : data?.categories?.length > 0 ? (
        <Category
          data={data}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      ) : (
        <p className="px-5 w-full py-3 text-center tracking-wider text-gray-600">
          Aucune catégorie disponible pour le moment. Veuillez revenir plus tard!
        </p>
      )}
    </div>
  );
};

export default React.memo(Dropdown);