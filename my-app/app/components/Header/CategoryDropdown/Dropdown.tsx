import { useQuery } from "@apollo/client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import Category from "./MainCategory";
import { MAIN_CATEGORY_QUERY } from "../../../../graphql/queries";

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
  const { error, data: categoriesData, loading } = useQuery(MAIN_CATEGORY_QUERY, {
    fetchPolicy: 'cache-first'
  });
  const categories = categoriesData?.fetchMainCategories || [];

  const [activeCategory, setActiveCategory] = useState<string>("");

  // Set initial active category when data loads
  useEffect(() => {
    if (categories?.length > 0) {
      setActiveCategory(categories[0].name);
    }
  }, [categories]);

  // Handle keyboard navigation for dropdown
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setShowDropdown(false);
    }
  }, [setShowDropdown]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setShowDropdown(false);
  }, [setShowDropdown]);

  // Improved dropdown position classes for better scroll behavior
  const positionClasses = useMemo(() => {
    // if (isFixed) {
    //   return "fixed top-[185px] left-0 right-0";
    // }
    // return "absolute top-full left-0 right-0";
    return "top-[185px] left-0 right-0";
  }, [isFixed]);

  if (error) {
    console.error("Error loading categories:", error);
    return (
      <div className="container mx-auto p-4 text-red-500 bg-red-50 rounded-md border border-red-100">
        Une erreur s'est produite lors du chargement des catégories.
      </div>
    );
  }

  return (
    <>
      {showCategoryDropdown && (
        <div
          role="menu"
          aria-label="Menu des catégories"
          onMouseLeave={handleMouseLeave}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
          className={`${positionClasses} z-[60] w-full hidden md:block transition-opacity duration-300 opacity-100 transform translate-y-0`}
        >
          <div className="container mx-auto">
            <div className="bg-white rounded-b-lg shadow-xl border-t border-gray-100 overflow-hidden">
              {loading ? (
                <div className="p-8 w-full flex justify-center" role="status" aria-live="polite">
                  <div className="animate-pulse space-y-6 w-full max-w-3xl">
                    <div className="flex gap-8">
                      <div className="w-1/4">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                        </div>
                      </div>
                      <div className="w-3/4">
                        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="grid grid-cols-3 gap-4">
                          {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-4 bg-gray-200 rounded"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="sr-only">Chargement des catégories...</span>
                </div>
              ) : categories?.length > 0 ? (
                <div className="py-6 px-4">
                  <Category
                    mainCategories={categories}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    setShowDropdown={setShowDropdown}
                  />
                </div>
              ) : (
                <div className="py-12 px-4 text-center" role="status">
                  <div className="mx-auto w-16 h-16 mb-4 text-gray-300" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-light tracking-wide">
                    Aucune catégorie disponible pour le moment. Veuillez revenir plus tard!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(Dropdown);