"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import { IoImageOutline } from "react-icons/io5";
import Link from "next/link";
import Image from "next/legacy/image";

interface Ad {
  images: string[];
  link: string;
}

interface LeftAdsCarouselProps {
  AdsNextToCarousel: Ad[];
  loadingLeftAdsCarousel: boolean;
}

const LeftAdsCarousel: React.FC<LeftAdsCarouselProps> = ({
  AdsNextToCarousel,
  loadingLeftAdsCarousel,
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (AdsNextToCarousel?.length > 0) {
      const allImages = AdsNextToCarousel.flatMap((ad) => ad.images);
      setImages(allImages);
      
      // Initialize loading state for new images
      const initialLoadState: Record<number, boolean> = {};
      allImages.forEach((_, index) => {
        initialLoadState[index] = false;
      });
      setImagesLoaded(initialLoadState);
    }
  }, [AdsNextToCarousel]);

  const handleImageLoad = useCallback((index: number) => {
    setImagesLoaded(prev => ({
      ...prev,
      [index]: true
    }));
  }, []);

  // Loading state with improved skeleton
  if (images.length === 0 || loadingLeftAdsCarousel) {
    return (
      <div className="left-Img flex xl:flex-col xl:max-w-[455px] w-full items-center justify-center gap-5 md:gap-12">
        <div className="relative w-full max-w-[455px] h-[230px] rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
            <IoImageOutline className="h-12 w-12 text-gray-500" />
          </div>
        </div>
        <div className="relative w-full max-w-[455px] h-[230px] rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
            <IoImageOutline className="h-12 w-12 text-gray-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="left-Img flex xl:flex-col xl:max-w-[455px] w-full h-full gap-5 md:gap-12">
      {images.map((image, index) => (
        index < 2 && (
          <Link
            key={index}
            className="relative group rounded-lg border bg-white overflow-hidden w-full max-w-[455px] max-h-[230px] h-full shadow-sm hover:shadow-md transition-all duration-300"
            href={AdsNextToCarousel[index]?.link || "#"}
            aria-label={`Promotion banner ${index + 1}`}
          >
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
            <span
              className="hidden opacity-55 -rotate-45 top-[70px] shadow-2xl group-hover:block z-20 absolute bg-red-600 left-0 w-80 h-6 transition-all duration-500"
              style={{ animation: "slide-diagonal 1s forwards" }}
            ></span>
            <Image
              layout="responsive"
              width={455}
              height={230}
              src={image}
              loading={index === 0 ? "eager" : "lazy"}
              priority={index === 0}
              alt={`Promotion banner ${index + 1}`}
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
              onLoadingComplete={() => handleImageLoad(index)}
            />
          </Link>
        )
      ))}
    </div>
  );
};

export default memo(LeftAdsCarousel);
