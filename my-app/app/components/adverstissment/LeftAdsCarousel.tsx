"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import { IoImageOutline } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";


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
        <div className="relative w-full max-w-[455px] h-[230px] rounded-2xl overflow-hidden shadow-md">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse flex items-center justify-center">
            <IoImageOutline className="h-12 w-12 text-gray-400" />
          </div>
        </div>
        <div className="relative w-full max-w-[455px] h-[230px] rounded-2xl overflow-hidden shadow-md">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse flex items-center justify-center">
            <IoImageOutline className="h-12 w-12 text-gray-400" />
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
            className="relative group rounded-2xl overflow-hidden w-full max-w-[455px] max-h-[230px] h-full shadow-md hover:shadow-xl transition-all duration-500"
            href={AdsNextToCarousel[index]?.link || "#"}
            aria-label={`Promotion banner ${index + 1}`}
          >
            {/* Overlay effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

            {/* Shine effect on hover */}
            <div
              className="absolute -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine"
              aria-hidden="true"
            ></div>

            <Image
              layout="responsive"
              width={455}
              height={230}
              src={image}
              loading={index === 0 ? "eager" : "lazy"}
              priority={index === 0}
              alt={`Promotion banner ${index + 1}`}
              objectFit="cover"
              className="transition-transform duration-700 group-hover:scale-110"
              onLoadingComplete={() => handleImageLoad(index)}
            />

            {/* Optional: Add a subtle call to action on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20">
              <p className="text-white text-sm font-medium">Découvrir</p>
            </div>
          </Link>
        )
      ))}
    </div>
  );
};

export default memo(LeftAdsCarousel);
