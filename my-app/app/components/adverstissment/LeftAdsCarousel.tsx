"use client";

import React, { useEffect, useState } from "react";
import { IoImageOutline } from "react-icons/io5";
import Link from "next/link";
import Image from "next/legacy/image";

const LeftAdsCarousel = ({
  AdsNextToCarousel,
  loadingLeftAdsCarousel,
}: any) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (AdsNextToCarousel) {
      const allImages = AdsNextToCarousel.flatMap(
        (ad: { images: string[] }) => ad.images
      );

      setImages(allImages);
    }
  }, [loadingLeftAdsCarousel]);

  return (
    <>
      {(images.length === 0 || loadingLeftAdsCarousel) && (
        <div className="left-ads flex xl:flex-col xl:max-w-[455px] w-full items-center justify-center  gap-5 md:gap-12">
          <div className="grid animate-pulse max-w-full w-[455px] h-[230px] place-items-center rounded-lg bg-gray-300 ">
            <IoImageOutline className="h-12 w-12 text-gray-500" />
          </div>
          <div className="grid animate-pulse max-w-full w-[455px] h-[230px] place-items-center rounded-lg bg-gray-300 ">
            <IoImageOutline className="h-12 w-12 text-gray-500" />
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="left-ads flex xl:flex-col xl:max-w-[455px]  w-full h-full  gap-5 md:gap-12">
          <Link
            className="relative group  rounded-sm border bg-white overflow-hidden w-[455px] max-h-[230px] h-full max-w-full hover:opacity-90 transition-all "
            href={AdsNextToCarousel[0]?.link}
          >
            <span
              className=" HoverBackgroundSlide hidden opacity-55  -rotate-45 top-[70px] shadow-2xl   group-hover:block z-50 absolute bg-red-600 left-0 w-80 h-6 transition-all duration-500"
              style={{ animation: "slide-diagonal 1s forwards" }}
            ></span>
            <Image
              layout="responsive"
              width={360}
              height={208}
              src={images[0]}
              loading="eager"
              priority={true} 

              property="true"
              objectFit="cover"
              alt="left-ads 0"
              className="  transition-all"
            />
          </Link>
          <Link
            className="relative group  rounded-sm bg-white border w-[455px] max-h-[230px] h-full overflow-hidden  "
            href={AdsNextToCarousel[1]?.link}
          >
            <span
              className=" HoverBackgroundSlide hidden opacity-55  -rotate-45 top-[70px] shadow-2xl   group-hover:block z-50 absolute bg-red-600 left-0 w-80 h-6 transition-all duration-500"
              style={{ animation: "slide-diagonal 1s forwards" }}
            ></span>
            <Image
              layout="responsive"
              width={360}
              height={208}
              src={images[1]}
              loading="eager"
              alt="left-ads 2"
              priority={true} 
              objectFit="cover"
              className=" hover:opacity-50 transition-all"
            />
          </Link>
        </div>
      )}
    </>
  );
};

export default LeftAdsCarousel;
