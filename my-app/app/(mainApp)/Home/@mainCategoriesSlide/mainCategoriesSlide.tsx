"use client";
import { MAIN_CATEGORY_QUERY } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// Types
interface Subcategory {
  id: string;
}

interface Category {
  id: string;
  name: string;
  bigImage: string;
  smallImage: string;
  subcategories: Subcategory[];
}

interface MainCategoriesData {
  fetchMainCategories: Category[];
}

const MainCategoriesSlide = (): JSX.Element | null => {
  const { data: mainCategories, loading, error } = useQuery<MainCategoriesData>(MAIN_CATEGORY_QUERY);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<number | null>(null);

  const categories: Category[] = mainCategories?.fetchMainCategories || [];

  // Auto-play functionality with pause on hover
  useEffect(() => {
    if (isPlaying && categories.length > 1) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev: number) => (prev + 1) % categories.length);
      }, 4000); // Slightly longer for better UX
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, categories.length]);



  const goToSlide = (index: number): void => {
    setActiveIndex(index);
    setIsPlaying(false);
    // Resume autoplay after user interaction
    setTimeout(() => setIsPlaying(true), 3000);
  };

  const nextSlide = (): void => {
    setActiveIndex((prev: number) => (prev + 1) % categories.length);
  };

  const prevSlide = (): void => {
    setActiveIndex((prev: number) => (prev - 1 + categories.length) % categories.length);
  };

  // Touch/swipe handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>): void => {
    touchStartRef.current = e.touches[0].clientX;
    setIsPlaying(false);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>): void => {
    if (!touchStartRef.current) return;
    
    const currentTouch: number = e.touches[0].clientX;
    const diff: number = touchStartRef.current - currentTouch;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      touchStartRef.current = null;
    }
  };

  const handleTouchEnd = (): void => {
    touchStartRef.current = null;
    setTimeout(() => setIsPlaying(true), 3000);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>): void => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-32 h-6 bg-gray-200 animate-pulse rounded mx-auto mb-4"></div>
            <div className="w-64 h-8 bg-gray-200 animate-pulse rounded mx-auto mb-4"></div>
            <div className="w-24 h-1 bg-gray-200 animate-pulse rounded-full mx-auto"></div>
          </div>
          <div className="h-[450px] md:h-[500px] bg-gray-200 animate-pulse rounded-2xl"></div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-gray-600">Erreur lors du chargement des collections</p>
          </div>
        </div>
      </section>
    );
  }

  if (!categories?.length) {
    return null;
  }

  return (
    <section 
      className="py-10 bg-gradient-to-br from-slate-50 via-white to-blue-50/30"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            Nos Collections
          </span>
          <h2 className="mt-2 text-4xl md:text-5xl font-light text-gray-900 mb-4">
            Découvrez l'Excellence
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primaryColor to-purple-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Explorez nos collections soigneusement sélectionnées pour vous offrir le meilleur
          </p>
        </div>

        {/* Main Carousel */}
        <div 
          className="relative h-[450px] md:h-[500px] overflow-hidden rounded-2xl shadow-2xl"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 group"
            aria-label="Slide précédent"
            type="button"
          >
            <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 group"
            aria-label="Slide suivant"
            type="button"
          >
            <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Slides */}
          {categories.map((category: Category, index: number) => (
            <div
              key={category.id}
              className={`absolute inset-0 transition-all duration-700 ease-out ${
                index === activeIndex
                  ? "opacity-100 transform translate-x-0"
                  : index < activeIndex
                  ? "opacity-0 transform -translate-x-full"
                  : "opacity-0 transform translate-x-full"
              }`}
            >
              {/* Mobile Layout */}
              <div className="md:hidden relative w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                <Image
                  src={category.smallImage}
                  fill
                  sizes="100vw"
                  alt={category.name}
                  style={{ objectFit: "cover" }}
                  className="scale-105"
                  priority={index <= 1}
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 text-white">
                  <h3 className="text-3xl font-light mb-3">{category.name}</h3>
                  <p className="text-white/90 mb-6 text-sm leading-relaxed">
                    Découvrez notre collection exclusive de produits {category.name.toLowerCase()}
                  </p>
                  <Link
                    href={`/Collections/tunisie?category=${encodeURIComponent(category.name)}`}
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-full w-fit transition-all duration-300 hover:bg-white hover:text-gray-900 group"
                  >
                    Découvrir
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex h-full">
                <div className="w-1/2 flex flex-col justify-center px-12 bg-gradient-to-r from-white to-gray-50/50">
                  <span className="text-blue-600 font-medium text-sm uppercase tracking-wide mb-2">
                    Collection
                  </span>
                  <h3 className="text-5xl font-light text-gray-900 mb-6 leading-tight">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-md">
                    Découvrez notre collection exclusive de produits {category.name.toLowerCase()}
                  </p>
                  <Link
                    href={`/Collections/tunisie?category=${encodeURIComponent(category.name)}`}
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full w-fit transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                  >
                    Découvrir la Collection
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                <div className="w-1/2 relative bg-gradient-to-bl from-blue-50 to-purple-50/30">
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="relative w-full h-full max-w-[450px] max-h-[450px] group">
                      {/* Decorative elements */}
                      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700"></div>
                      <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700"></div>
                      
                      <Image
                        src={category.smallImage}
                        fill
                        sizes="50vw"
                        alt={category.name}
                        style={{ objectFit: "contain" }}
                        className="drop-shadow-2xl group-hover:scale-105 transition-all duration-700"
                        priority={index <= 1}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-30">
            <div 
              className="h-full bg-gradient-to-r from-primaryColor to-purple-600 transition-all duration-300 ease-linear"
              style={{ 
                width: isPlaying ? '100%' : `${((activeIndex + 1) / categories.length) * 100}%`,
                transition: isPlaying ? 'width 4s linear' : 'width 0.3s ease'
              }}
            ></div>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
            {categories.map((_: Category, index: number) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 ${
                  index === activeIndex 
                    ? "w-8 h-2 bg-white rounded-full shadow-lg" 
                    : "w-2 h-2 bg-white/50 rounded-full hover:bg-white/75"
                }`}
                aria-label={`Aller au slide ${index + 1}`}
                type="button"
              />
            ))}
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-2">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-1 pb-1">
              {categories.map((category: Category, index: number) => (
                <button
                  key={category.id}
                  onClick={() => goToSlide(index)}
                  className={`px-4 py-2 text-xs md:text-sm font-medium whitespace-nowrap rounded-lg transition-all duration-300 flex-shrink-0 ${
                    index === activeIndex
                      ? "bg-gradient-to-r from-primaryColor to-purple-600 text-white shadow-md transform scale-105"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  type="button"
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainCategoriesSlide;