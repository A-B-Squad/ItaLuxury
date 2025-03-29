"use client";
import React, { useEffect, useState, useCallback, memo } from "react";
import { Carousel } from "@material-tailwind/react";
import Link from "next/link";
import Image from "next/image";
import { IoImageOutline } from "react-icons/io5";

interface Ad {
  images: string[];
  link: string;
}

interface AdsCarouselProps {
  centerCarouselAds: Ad[];
  loadingCenterAdsCarousel: boolean;
}

const AdsCarousel: React.FC<AdsCarouselProps> = ({
  centerCarouselAds,
  loadingCenterAdsCarousel,
}) => {
  const [images, setImages] = useState<string[]>([]);

  // Extract images only when centerCarouselAds changes
  useEffect(() => {
    if (centerCarouselAds?.length > 0) {
      const allImages = centerCarouselAds.flatMap((ad) => ad.images);
      setImages(allImages);
    }
  }, [centerCarouselAds]);

  // Enhanced loading state with better visual feedback
  if (images.length === 0 || loadingCenterAdsCarousel) {
    return (
      <div className="relative w-full">
        <div className="aspect-[16/9] w-full">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse flex flex-col justify-center items-center">
            <IoImageOutline className="h-10 w-10 sm:h-16 sm:w-16 text-gray-400" />
            <p className="text-gray-500 text-sm mt-2 font-medium">Chargement des images...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg group">
      <Carousel
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
        autoplay
        loop
        autoplayDelay={5000}
        transition={{ duration: 0.7 }}
        placeholder=""
        className="rounded-2xl overflow-hidden"
        prevArrow={({ handlePrev }) => (
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white p-2 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}
        nextArrow={({ handleNext }) => (
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white p-2 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        )}
        navigation={({ setActiveIndex, activeIndex, length }) => (
          <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-1.5 sm:gap-2">
            {new Array(length).fill("").map((_, i) => (
              <span
                key={i}
                className={`block h-1.5 cursor-pointer rounded-full transition-all ${
                  activeIndex === i 
                    ? "w-8 sm:w-10 bg-white" 
                    : "w-3 sm:w-4 bg-white/50 hover:bg-white/70"
                }`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        )}
      >
        {images.map((image, index) => (
          <Link
            key={index}
            href={centerCarouselAds[0]?.link || "#"}
            className="block w-full h-full relative overflow-hidden"
            aria-label={`Promotion banner ${index + 1}`}
          >
            <div className="relative w-full aspect-[16/9] transform transition-transform duration-700 hover:scale-105">
              <Image
                src={image}
                alt={`Promotion banner ${index + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw"
                priority={index === 0}
                className="object-cover transition-opacity duration-300"
                loading={index === 0 ? "eager" : "lazy"}
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </Link>
        ))}
      </Carousel>
    </div>
  );
};

export default memo(AdsCarousel);