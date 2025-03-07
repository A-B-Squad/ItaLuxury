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

const BestSales = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryProductIndices, setCategoryProductIndices] = useState<Record<string, number>>({});
  const [transitioning, setTransitioning] = useState(false);
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
    setTransitioning(true);
    setCategoryProductIndices(prev => {
      const productsInCategory = productsByCategory[categoryId] || [];
      const currentIndex = prev[categoryId] || 0;
      const newIndex = currentIndex + productsPerPage < productsInCategory.length
        ? currentIndex + productsPerPage
        : currentIndex;
      return { ...prev, [categoryId]: newIndex };
    });
    setTimeout(() => setTransitioning(false), 300);
  }, [productsByCategory, productsPerPage]);

  const handlePrevious = useCallback((categoryId: string) => {
    setTransitioning(true);
    setCategoryProductIndices(prev => ({
      ...prev,
      [categoryId]: Math.max(0, (prev[categoryId] || 0) - productsPerPage)
    }));
    setTimeout(() => setTransitioning(false), 300);
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
    <div className="w-full container grid grid-cols-1 grid-rows-3 gap-4 md:grid-cols-2 md:grid-rows-2 lg:grid-rows-1 lg:grid-cols-3 min-h-96 md:max-h-[450px] h-fit">
      {categories.map((category: Category) => {
        const categoryProducts = productsByCategory[category.id] || [];
        const startIndex = categoryProductIndices[category.id] || 0;
        const visibleProducts = categoryProducts.slice(startIndex, startIndex + productsPerPage);
        const hasNext = startIndex + productsPerPage < categoryProducts.length;
        const hasPrevious = startIndex > 0;

        return (
          <div key={category.id} className=" shadow-md rounded-md overflow-hidden">
            <div className="flex justify-between items-center bg-primaryColor font-semibold tracking-wider text-white p-3 uppercase">
              <p>{category.name}</p>
              <div className="flex items-center">
                <button
                  className={`p-1 rounded-full transition-colors ${hasPrevious ? 'hover:bg-white/20' : 'opacity-50 cursor-not-allowed'}`}
                  onClick={() => hasPrevious && handlePrevious(category.id)}
                  disabled={!hasPrevious}
                  aria-label="Page précédente"
                >
                  <MdArrowLeft size={24} />
                </button>
                <button
                  className={`p-1 rounded-full transition-colors ${hasNext ? 'hover:bg-white/20' : 'opacity-50 cursor-not-allowed'}`}
                  onClick={() => hasNext && handleNext(category.id)}
                  disabled={!hasNext}
                  aria-label="Page suivante"
                >
                  <MdArrowRight size={24} />
                </button>
              </div>
            </div>
            <AnimatePresence >
              <motion.div
                key={startIndex}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col divide-y bg-white h-full gap-2 p-4"
              >
                {visibleProducts.length > 0 ? (
                  visibleProducts.map((product: Product) => (
                    <div
                      key={product.id}
                      className="w-full relative py-2 hover:opacity-90 transition-all group"
                    >
                      <TopSalesProductBox product={product} />
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    Aucun produit disponible dans cette catégorie
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default BestSales;