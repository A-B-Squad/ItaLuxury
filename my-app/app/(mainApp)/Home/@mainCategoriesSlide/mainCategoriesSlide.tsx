"use client";
import { MAIN_CATEGORY_QUERY } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";

const MainCategoriesSlide = () => {
  const { data: Categories, loading } = useQuery(MAIN_CATEGORY_QUERY);
  const [activeIndex, setActiveIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const isVisibleRef = useRef<boolean>(true);

  const categories = useMemo(() => Categories?.fetchMainCategories || [], [Categories]);
  const categoriesCount = categories.length;

  // Smooth transition handler
  const changeSlide = useCallback((newIndex: number) => {
    if (isTransitioning || newIndex === activeIndex) return;

    setIsTransitioning(true);
    setActiveIndex(newIndex);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  }, [activeIndex, isTransitioning]);

  // Auto-slide logic with pause/resume functionality
  useEffect(() => {
    if (!categoriesCount || isPaused || !isVisibleRef.current) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev === categoriesCount - 1 ? 0 : prev + 1));
    }, 4500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [categoriesCount, isPaused]);

  // Pause when tab hidden or component offscreen
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      isVisibleRef.current = entry.isIntersecting;
      if (!entry.isIntersecting) setIsPaused(true);
    }, { root: null, threshold: 0.1 });

    if (rootRef.current) observer.observe(rootRef.current);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
    };
  }, []);

  // Handle image load tracking
  const handleImageLoad = (index: number) => {
    setImagesLoaded(prev => new Set(prev).add(index));
  };

  // Pause auto-slide on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!Categories?.fetchMainCategories?.length) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const newIndex = activeIndex === 0
          ? Categories.fetchMainCategories.length - 1
          : activeIndex - 1;
        changeSlide(newIndex);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const newIndex = activeIndex === Categories.fetchMainCategories.length - 1
          ? 0
          : activeIndex + 1;
        changeSlide(newIndex);
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, changeSlide, Categories]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="py-12 bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 bg-gray-200 rounded-md w-48 mx-auto mb-10 animate-pulse"></div>
          <div className="relative h-[350px] md:h-[400px] bg-gray-200 rounded-xl animate-pulse mx-4"></div>
        </div>
      </div>
    );
  }

  if (!categoriesCount) {
    return null;
  }

  return (
    <div className=" bg-gradient-to-br from-slate-50 via-white to-blue-50/30" ref={rootRef}>
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-4">
            <span className="relative inline-block">
              COLLECTIONS
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                <div className="w-20 h-1 bg-gradient-to-r from-primaryColor to-blue-500 rounded-full"></div>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-primaryColor rounded-full mt-1 mx-auto"></div>
              </div>
            </span>
          </h2>
          <p className="text-gray-600 mt-6 text-lg max-w-2xl mx-auto">
            Découvrez nos collections soigneusement sélectionnées pour vous
          </p>
        </div>

        {/* Main Slider */}
        <div
          className="relative h-[400px] md:h-[500px] overflow-hidden px-4 rounded-2xl shadow-2xl bg-white"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          role="region"
          aria-label="Categories carousel"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white/80 z-0"></div>

          {/* Slide Container */}
          <div className="absolute inset-0 flex items-center justify-center">
            {categories.map((category: any, index: number) => {
              const isActive = index === activeIndex;
              const isPrev = index === (activeIndex === 0 ? categoriesCount - 1 : activeIndex - 1);
              const isNext = index === (activeIndex === categoriesCount - 1 ? 0 : activeIndex + 1);

              return (
                <div
                  key={category.id || category.name}
                  className={`absolute inset-0 flex flex-col md:flex-row transition-all duration-700 ease-out ${isActive
                    ? "opacity-100 transform translate-x-0 scale-100 z-20"
                    : isPrev
                      ? "opacity-30 transform -translate-x-full scale-95 z-10"
                      : isNext
                        ? "opacity-30 transform translate-x-full scale-95 z-10"
                        : "opacity-0 transform translate-x-full scale-90 z-0"
                    }`}
                  style={{
                    transitionDelay: isActive ? '0ms' : '100ms'
                  }}
                >
                  {/* Content Section */}
                  <div className="w-full md:w-1/2 pr-0 md:pr-12 flex flex-col justify-center relative p-6 md:p-12">
                    {/* Mobile background with better overlay */}
                    <div className="absolute inset-0 md:hidden rounded-xl overflow-hidden">
                      {category.smallImage && (
                        <div className="relative w-full h-full">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10"></div>
                          <Image
                            src={category.smallImage}
                            fill={true}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            alt={category.name}
                            style={{ objectFit: "cover" }}
                            className="opacity-80 scale-110 transition-transform duration-700"
                            priority={index === 0}
                            decoding="async"
                            loading={index === 0 ? "eager" : "lazy"}
                            onLoad={() => handleImageLoad(index)}
                          />
                        </div>
                      )}
                    </div>

                    {/* Enhanced Content */}
                    <div className={`relative z-20 flex flex-col items-center md:items-start text-center md:text-left transition-all duration-700 ${isActive ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
                      }`}>
                      <div className="mb-6">
                        <span className="text-sm font-medium text-primaryColor/80 md:text-primaryColor tracking-wider uppercase">
                          Collection
                        </span>
                      </div>

                      <h3 className="text-3xl md:text-5xl font-light md:text-gray-800 text-white mb-4 md:mb-6 leading-tight">
                        {category.name}
                      </h3>

                      <p className="md:text-gray-600 text-white/95 text-base md:text-lg mb-8 md:mb-10 max-w-md leading-relaxed">
                        Découvrez notre collection exclusive de produits {category.name.toLowerCase()}
                        sélectionnés avec soin pour vous offrir le meilleur
                      </p>

                      <Link
                        href={`/Collections/tunisie?${new URLSearchParams({
                          category: category.name,
                        })}`}
                        className="group inline-flex items-center gap-3 bg-white/95 md:bg-primaryColor hover:bg-primaryColor md:hover:bg-primaryColor/90 text-gray-800 md:text-white px-8 py-4 rounded-full transition-all duration-300 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primaryColor/30"
                      >
                        Découvrir la collection
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  {/* Enhanced Desktop Image */}
                  <div className="w-full md:w-1/2 relative hidden md:block p-6">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-primaryColor/10 via-blue-500/5 to-transparent rounded-2xl blur-sm"></div>
                    <div className="relative h-full w-full flex items-center justify-center">
                      {category.smallImage && (
                        <div className={`relative w-full h-full max-w-[450px] max-h-[450px] transition-all duration-700 ${isActive ? 'transform scale-100 rotate-0' : 'transform scale-95 rotate-1'
                          }`}>
                          <div className="absolute -inset-8 bg-gradient-to-br from-primaryColor/20 to-blue-500/20 rounded-full blur-2xl opacity-50"></div>
                          <Image
                            src={category.smallImage}
                            fill={true}
                            sizes="(max-width: 1024px) 50vw, 450px"
                            alt={category.name}
                            style={{ objectFit: "contain" }}
                            priority={index === 0}
                            decoding="async"
                            loading={index === 0 ? "eager" : "lazy"}
                            onLoad={() => handleImageLoad(index)}
                            className="drop-shadow-2xl hover:drop-shadow-3xl transition-all duration-500 relative z-10"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => changeSlide(activeIndex === 0 ? categoriesCount - 1 : activeIndex - 1)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white text-gray-600 hover:text-primaryColor rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-30 focus:outline-none focus:ring-4 focus:ring-primaryColor/30"
            aria-label="Previous slide"
            disabled={isTransitioning}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => changeSlide(activeIndex === categoriesCount - 1 ? 0 : activeIndex + 1)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white text-gray-600 hover:text-primaryColor rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-30 focus:outline-none focus:ring-4 focus:ring-primaryColor/30"
            aria-label="Next slide"
            disabled={isTransitioning}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Enhanced Dots Navigation */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 z-30">
            {categories.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => changeSlide(index)}
                className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-4 focus:ring-primaryColor/30 ${index === activeIndex
                  ? "w-8 h-3 bg-primaryColor shadow-lg"
                  : "w-3 h-3 bg-white/60 hover:bg-white/80 hover:scale-110"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200/50 z-20">
            <div
              className="h-full bg-gradient-to-r from-primaryColor to-blue-500 transition-all duration-300 ease-out"
              style={{
                width: `${((activeIndex + 1) / categoriesCount) * 100}%`
              }}
            ></div>
          </div>
        </div>

        {/* Enhanced Bottom Navigation */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex min-w-max">
              {categories.map((category: any, index: number) => (
                <button
                  key={category.id || category.name}
                  onClick={() => changeSlide(index)}
                  className={`px-8 py-6 text-sm font-medium whitespace-nowrap transition-all duration-300 border-b-3 flex-1 min-w-fit focus:outline-none focus:ring-4 focus:ring-primaryColor/20 ${index === activeIndex
                    ? "text-primaryColor bg-primaryColor/5 border-primaryColor shadow-sm"
                    : "text-gray-600 hover:text-primaryColor hover:bg-gray-50/80 border-transparent hover:border-primaryColor/30"
                    }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>{category.name}</span>
                    {index === activeIndex && (
                      <div className="w-2 h-2 bg-primaryColor rounded-full animate-pulse"></div>
                    )}
                  </div>
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