"use client";
import React, { useEffect, useState } from "react";
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (centerCarouselAds) {
      const allImages = centerCarouselAds.flatMap((ad) => ad.images);
      setImages(allImages);
      setIsLoading(false);
    }
  }, [centerCarouselAds]);

  // Loading state with proper aspect ratio
  if (images.length === 0 || loadingCenterAdsCarousel || isLoading) {
    return (
      <div className="relative w-full">
        <div className="aspect-[16/9] w-full">
          <div className="absolute inset-0 rounded-xl animate-pulse bg-gray-300 flex flex-col justify-center items-center">
            <IoImageOutline className="h-8 w-8 sm:h-12 sm:w-12 text-gray-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <Carousel
        autoplay
        loop
        placeholder=""
        className="rounded-lg overflow-hidden"
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
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
            href={centerCarouselAds[0]?.link}
            className="block w-full"
          >
            <div className="relative w-full aspect-[16/9]">
              <Image
                src={image}
                alt={`Carousel image ${index + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw"
                priority={index === 0}
                className="object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                quality={85}
                onLoadingComplete={() => setIsLoading(false)}
              />
            </div>
          </Link>
        ))}
      </Carousel>
    </div>
  );
};

export default AdsCarousel;