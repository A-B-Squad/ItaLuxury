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
  if (images.length === 0 || loadingCenterAdsCarousel ) {
    return (
      <div className="relative w-full">
        <div className="aspect-[16/9] w-full">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse flex flex-col justify-center items-center">
            <IoImageOutline className="h-8 w-8 sm:h-12 sm:w-12 text-gray-500" />
            <p className="text-gray-500 text-sm mt-2">Chargement des images...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-md">
      <Carousel
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
        autoplay
        loop
        autoplayDelay={5000}
        transition={{ duration: 0.5 }}
        placeholder=""
        className="rounded-lg overflow-hidden"
        navigation={({ setActiveIndex, activeIndex, length }) => (
          <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-1.5 sm:gap-2">
            {new Array(length).fill("").map((_, i) => (
              <span
                key={i}
                className={`block h-1 cursor-pointer rounded-2xl transition-all ${
                  activeIndex === i 
                    ? "w-6 sm:w-8 bg-white" 
                    : "w-3 sm:w-4 bg-white/50"
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
            className="block w-full h-full"
            aria-label={`Promotion banner ${index + 1}`}
          >
            <div className="relative w-full aspect-[16/9]">
              <Image
                src={image}
                alt={`Promotion banner ${index + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw"
                priority={index === 0}
                className="object-cover transition-opacity duration-300"
                loading={index === 0 ? "eager" : "lazy"}
                quality={85}
              />
            </div>
          </Link>
        ))}
      </Carousel>
    </div>
  );
};

export default memo(AdsCarousel);