"use client";
import { MAIN_CATEGORY_QUERY } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import Image from "next/image";

import Link from "next/link";
import { useState, useEffect } from "react";

const MainCategoriesSlide = () => {
  const { data: mainCategories } = useQuery(MAIN_CATEGORY_QUERY);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (mainCategories?.fetchMainCategories?.length) {
      const interval = setInterval(() => {
        setActiveIndex((prev) =>
          prev === mainCategories.fetchMainCategories.length - 1 ? 0 : prev + 1
        );
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [mainCategories]);

  if (!mainCategories?.fetchMainCategories?.length) {
    return null;
  }

  return (
    <div className="py-12 bg-gradient-to-r from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-light text-gray-800 mb-10 text-center">
          <span className="relative inline-block">
            COLLECTIONS
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-primaryColor"></span>
          </span>
        </h2>

        <div className="relative h-[350px] md:h-[400px] overflow-hidden px-4">
          <div className="absolute inset-0 flex items-center justify-center">
            {mainCategories.fetchMainCategories.map((category: any, index: number) => (
              <div
                key={category.id || category.name}
                className={`absolute inset-0 flex flex-col md:flex-row transition-all duration-1000 ease-in-out ${index === activeIndex
                  ? "opacity-100 transform scale-100 z-10"
                  : "opacity-0 transform scale-95 z-0"
                  }`}
              >
                <div className="w-full md:w-1/2 pr-0 md:pr-8 flex flex-col justify-center relative">
                  {/* Mobile background image with overlay */}
                  <div className="absolute inset-0 md:hidden rounded-xl overflow-hidden">
                    {category.smallImage && (
                      <div className="relative w-full h-full">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 z-10"></div>
                        <Image
                          src={category.smallImage}
                          layout="fill"
                          alt={category.name}
                          objectFit="cover"
                          className="opacity-90"
                        />
                      </div>
                    )}
                  </div>

                  {/* Content with z-index to appear above the background on mobile */}
                  <div className="relative z-20 p-4 md:p-0 flex flex-col items-center md:items-start text-center md:text-left">
                    <h3 className="text-2xl md:text-4xl font-light md:text-gray-800 text-white mb-3 md:mb-4">{category.name}</h3>
                    <p className="md:text-gray-600 text-white/90 text-sm md:text-base mb-6 md:mb-8 max-w-xs">Découvrez notre collection exclusive de produits {category.name.toLowerCase()}</p>
                    <Link
                      href={`/Collections/tunisie?${new URLSearchParams(
                        {
                          category: category.name,
                        }
                      )}`}
                      className="inline-block bg-white/90 md:bg-white border border-gray-300 hover:border-primaryColor text-gray-800 px-5 py-2 md:px-6 md:py-3 rounded-md md:rounded-none w-max transition-all duration-300 hover:bg-primaryColor hover:text-white"
                    >
                      Découvrir
                    </Link>
                  </div>
                </div>

                {/* Desktop image - hidden on mobile */}
                <div className="w-full md:w-1/2 relative hidden md:block">
                  <div className="absolute -inset-8 bg-gradient-to-tr from-primaryColor/5 to-transparent rounded-xl"></div>
                  <div className="relative h-full w-full flex items-center justify-center">
                    {category.smallImage && (
                      <div className="relative w-full h-full max-w-[400px] max-h-[400px] transform hover:scale-105 transition-transform duration-500">
                        <Image
                          src={category.smallImage}
                          layout="fill"
                          alt={category.name}
                          objectFit="contain"
                          priority={index === activeIndex}
                          className="drop-shadow-2xl"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {mainCategories.fetchMainCategories.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${index === activeIndex ? "bg-primaryColor w-6" : "bg-gray-300"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex min-w-max py-4">
              {mainCategories.fetchMainCategories.map((category: any, index: number) => (
                <button
                  key={category.id || category.name}
                  onClick={() => setActiveIndex(index)}
                  className={`px-6 py-2 text-sm whitespace-nowrap transition-all duration-300 ${index === activeIndex
                    ? "text-primaryColor font-medium border-b-2 border-primaryColor"
                    : "text-gray-500 hover:text-gray-800 border-b-2 border-transparent"
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainCategoriesSlide;
