"use client";
import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { BEST_SALES_QUERY } from "@/graphql/queries";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";
import TopSalesProductBox from "./Components/TopSalesProductBox";

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
}

const BestSales = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryProductIndices, setCategoryProductIndices] = useState<Record<string, number>>({});
  const [transitioning, setTransitioning] = useState(false);
  const productsPerPage = 3;

  const [getBestSales] = useLazyQuery(BEST_SALES_QUERY);

  useEffect(() => {
    const fetchBestSales = async () => {
      try {
        const { data } = await getBestSales();
        if (data?.getBestSells) {
          const products = data.getBestSells.map((item: any) => item.Product);
          setAllProducts(products);

          // Get unique main categories using only the first category of each product
          const categoryMap = new Map<string, Category>();
          products.forEach((product: Product) => {
            if (product.categories[0]) {
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

  const handleNext = (categoryId: string) => {
    setTransitioning(true);
    setCategoryProductIndices(prev => {
      const productsInCategory = allProducts.filter(product =>
        product.categories[0]?.id === categoryId
      );
      const currentIndex = prev[categoryId] || 0;
      const newIndex = currentIndex + productsPerPage < productsInCategory.length
        ? currentIndex + productsPerPage
        : currentIndex;
      return { ...prev, [categoryId]: newIndex };
    });
    setTimeout(() => setTransitioning(false), 500);
  };

  const handlePrevious = (categoryId: string) => {
    setTransitioning(true);
    setCategoryProductIndices(prev => ({
      ...prev,
      [categoryId]: Math.max(0, (prev[categoryId] || 0) - productsPerPage)
    }));
    setTimeout(() => setTransitioning(false), 500);
  };

  return (
    <div className="w-full container grid grid-cols-1 grid-rows-3 gap-4 md:grid-cols-2 md:grid-rows-2 lg:grid-rows-1 lg:grid-cols-3 min-h-96 md:max-h-[450px] h-fit">
      {categories.map((category: Category) => {
        const categoryProducts = allProducts.filter(product =>
          product.categories[0]?.id === category.id
        );
        const startIndex = categoryProductIndices[category.id] || 0;

        return (
          <div key={category.id} className="mb-8">
            <div className="flex justify-between items-center bg-primaryColor font-semibold tracking-wider text-white p-3 uppercase">
              <p>{category.name}</p>
              <div className="flex items-center">
                <MdArrowLeft
                  size={28}
                  className="cursor-pointer"
                  onClick={() => handlePrevious(category.id)}
                />
                <MdArrowRight
                  size={28}
                  className="cursor-pointer"
                  onClick={() => handleNext(category.id)}
                />
              </div>
            </div>
            <div
              className={`flex flex-col divide-y-2 bg-white h-full gap-2 p-4 transition-transform duration-500 ${transitioning ? "transition-all" : ""
                }`}
            >
              {categoryProducts
                .slice(startIndex, startIndex + productsPerPage)
                .map((product: Product) => (
                  <div
                    key={product.id}
                    className="w-full relative py-1 hover:opacity-90 transition-all group"
                  >
                    <TopSalesProductBox product={product} />
                  </div>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BestSales;