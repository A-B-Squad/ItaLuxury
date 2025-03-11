"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLazyQuery } from "@apollo/client";
import { BEST_SALES_QUERY } from "@/graphql/queries";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";
import TopSalesProductBox from "./Components/TopSalesProductBox";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Product {
  id: string;
  name: string;
  images: string[];
  price: number;
  description: string;
  categories: Category[];
  inventory: number;
  productDiscounts: Array<{
    price: number;
    newPrice: number;
  }>;
}

const TopSales = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryProductIndices, setCategoryProductIndices] = useState<Record<string, number>>({});
  const productsPerPage = 3;

  const [getBestSales, { loading, error }] = useLazyQuery(BEST_SALES_QUERY);

  useEffect(() => {
    const fetchBestSales = async () => {
      try {
        const { data } = await getBestSales();
        if (data?.getBestSells) {
          const products = data.getBestSells.map((item: any) => item.Product);
          setAllProducts(products);

          // Extract unique categories
          const categoryMap = new Map<string, Category>();
          products.forEach((product: Product) => {
            if (product.categories && product.categories[0]) {
              categoryMap.set(product.categories[0].id, product.categories[0]);
            }
          });

          const uniqueCategories = Array.from(categoryMap.values());
          setCategories(uniqueCategories);

          // Initialize indices for each category
          const initialIndices: Record<string, number> = {};
          uniqueCategories.forEach(category => {
            initialIndices[category.id] = 0;
          });
          setCategoryProductIndices(initialIndices);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchBestSales();
  }, [getBestSales]);

  // Memoize filtered products by category to avoid recalculation on each render
  const productsByCategory = useMemo(() => {
    const result: Record<string, Product[]> = {};
    categories.forEach(category => {
      result[category.id] = allProducts.filter(
        product => product.categories[0]?.id === category.id
      );
    });
    return result;
  }, [allProducts, categories]);

  const handleNext = useCallback((categoryId: string) => {
    setCategoryProductIndices(prev => {
      const productsInCategory = productsByCategory[categoryId] || [];
      const currentIndex = prev[categoryId] || 0;
      const newIndex = currentIndex + productsPerPage < productsInCategory.length
        ? currentIndex + productsPerPage
        : currentIndex;
      return { ...prev, [categoryId]: newIndex };
    });
  }, [productsByCategory, productsPerPage]);

  const handlePrevious = useCallback((categoryId: string) => {
    setCategoryProductIndices(prev => ({
      ...prev,
      [categoryId]: Math.max(0, (prev[categoryId] || 0) - productsPerPage)
    }));
  }, [productsPerPage]);

  if (loading) {
    return (
      <div className="w-full container grid min-h-96 place-items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-primaryColor/30"></div>
          <div className="mt-4 h-4 w-36 bg-primaryColor/30 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full container grid min-h-96 place-items-center">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">Une erreur est survenue</p>
          <p className="text-sm">Veuillez réessayer ultérieurement</p>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="w-full container">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category: Category) => {
          const categoryProducts = productsByCategory[category.id] || [];
          const startIndex = categoryProductIndices[category.id] || 0;
          const visibleProducts = categoryProducts.slice(startIndex, startIndex + productsPerPage);
          const hasNext = startIndex + productsPerPage < categoryProducts.length;
          const hasPrevious = startIndex > 0;
        
          return (
            <div key={category.id} className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden flex flex-col h-full">
              <div className="flex justify-between items-center bg-[#1e2a4a] text-white p-3">
                <h3 className="font-semibold tracking-wide uppercase text-sm">{category.name}</h3>
                <div className="flex items-center space-x-1">
                  <button
                    className={`p-1.5 rounded-full transition-colors ${hasPrevious ? 'hover:bg-white/20 active:bg-white/30' : 'opacity-50 cursor-not-allowed'}`}
                    onClick={() => hasPrevious && handlePrevious(category.id)}
                    disabled={!hasPrevious}
                    aria-label="Page précédente"
                  >
                    <MdArrowLeft size={18} />
                  </button>
                  <button
                    className={`p-1.5 rounded-full transition-colors ${hasNext ? 'hover:bg-white/20 active:bg-white/30' : 'opacity-50 cursor-not-allowed'}`}
                    onClick={() => hasNext && handleNext(category.id)}
                    disabled={!hasNext}
                    aria-label="Page suivante"
                  >
                    <MdArrowRight size={18} />
                  </button>
                </div>
              </div>
              
              <div className="flex-grow">
                <AnimatePresence>
                  <motion.div
                    key={startIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col h-full"
                  >
                    {visibleProducts.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {visibleProducts.map((product: Product) => (
                          <div
                            key={product.id}
                            className="p-3 hover:bg-gray-50 transition-colors duration-200"
                          >
                            <TopSalesProductBox product={product} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center text-gray-500 flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                        <p>Aucun produit disponible dans cette catégorie</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {visibleProducts.length > 0 && categoryProducts.length > productsPerPage && (
                <div className="bg-gray-50 px-3 py-2 text-xs text-gray-500 border-t border-gray-100 flex justify-between items-center">
                  <span>
                    {startIndex + 1}-{Math.min(startIndex + productsPerPage, categoryProducts.length)} sur {categoryProducts.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => hasPrevious && handlePrevious(category.id)}
                      disabled={!hasPrevious}
                      className={`text-xs ${hasPrevious ? 'text-blue-600 hover:underline' : 'text-gray-400'}`}
                    >
                      Précédent
                    </button>
                    <span>|</span>
                    <button 
                      onClick={() => hasNext && handleNext(category.id)}
                      disabled={!hasNext}
                      className={`text-xs ${hasNext ? 'text-blue-600 hover:underline' : 'text-gray-400'}`}
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopSales;