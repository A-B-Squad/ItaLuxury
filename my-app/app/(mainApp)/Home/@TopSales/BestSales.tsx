"use client";
import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { BEST_SALES_QUERY } from "@/graphql/queries";

import { MdArrowLeft, MdArrowRight } from "react-icons/md";
import ProductBox from "./Components/ProductBox";

const BestSales = () => {
  const [allProducts, setAllProducts] = useState<SellsData[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [getBestSales] = useLazyQuery(BEST_SALES_QUERY);

  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const productsPerPage = 3;

  useEffect(() => {
    const fetchBestSales = async () => {
      try {
        const { data } = await getBestSales();
        if (data) {
          setAllProducts(data.getBestSells.map((item: any) => item.Product));

          // Extract unique categories and get only the first subcategory
          const uniqueCategories = Array.from(
            new Set(
              data.getBestSells.flatMap((item: any) => item.Category.name),
            ),
          );
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchBestSales();
  }, []);

  const handleNext = () => {
    setTransitioning(true);
    setCurrentCategoryIndex((prevIndex) =>
      prevIndex + productsPerPage < allProducts.length
        ? prevIndex + productsPerPage
        : prevIndex,
    );
    setTimeout(() => setTransitioning(false), 500);
  };

  const handlePrevious = () => {
    setTransitioning(true);
    setCurrentCategoryIndex((prevIndex) =>
      prevIndex - productsPerPage >= 0
        ? prevIndex - productsPerPage
        : prevIndex,
    );
    setTimeout(() => setTransitioning(false), 500);
  };

  return (
    <div className="w-full grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 min-h-96 max-h-96 gap-3">
      {categories.map((category: string, index: number) => (
        <div key={index} className="mb-8">
          <div className="flex justify-between items-center bg-primaryColor font-semibold tracking-wider text-white p-3 uppercase">
            <p>{category}</p>
            <div className="flex items-center">
              <MdArrowLeft
                size={28}
                className="cursor-pointer"
                onClick={handlePrevious}
              />
              <MdArrowRight
                size={28}
                className="cursor-pointer"
                onClick={handleNext}
              />
            </div>
          </div>
          <div
            className={`flex flex-col divide-y-2 bg-white h-full gap-2 p-4 transition-transform duration-500 ${transitioning ? "transition-all" : ""}`}
          >
            {allProducts
              .filter(
                (product: any) => product?.categories[0].name === category,
              )
              .slice(
                currentCategoryIndex,
                currentCategoryIndex + productsPerPage,
              )
              .map((product: any) => (
                <div
                  key={product.id}
                  className="w-full relative py-1 hover:opacity-90 transition-all group"
                >
                  <ProductBox product={product} />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BestSales;
