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

  useEffect(() => {
    if (centerCarouselAds) {
      const allImages = centerCarouselAds.flatMap((ad) => ad.images);
      setImages(allImages);
    }
  }, [centerCarouselAds]);

  if (images.length === 0 || loadingCenterAdsCarousel) {
    return (
      <div className="rounded-xl animate-pulse lg:w-3/4 w-full h-[150px] md:h-[280px] lg:h-[350px] bg-secondaryColor flex flex-col justify-center items-center">
        <IoImageOutline className="h-12 w-12 text-gray-500" />
      </div>
    );
  }

  return (
    <Carousel
      autoplay
      loop
      placeholder={""}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
      className="rounded-md border relative max-w-[1140px] group w-full  h-[300px] lg:h-[500px]"
      navigation={({ setActiveIndex, activeIndex, length }) => (
        <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
          {new Array(length).fill("").map((_, i) => (
            <span
              key={i}
              className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
              }`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}
    >
      {images.map((image, index) => (
        <Link key={index} href={centerCarouselAds[0]?.link}>
          <div className="relative w-full h-full">
            <Image
              src={image}
              alt={`image ${index + 1}`}
              layout="fill"
              // objectFit="cover"
              priority={index === 0}
              className="transition-all"
            />
          </div>
        </Link>
      ))}
    </Carousel>
  );
};

export default AdsCarousel;
