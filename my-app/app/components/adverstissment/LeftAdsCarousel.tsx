"use client";

import React, { useEffect, useState } from "react";
import { IoImageOutline } from "react-icons/io5";
import Link from "next/link";
import Image from "next/legacy/image";

const LeftAdsCarousel = ({
  AdsNextToCarousel,
  loadingRightAdsCarousel,
}: any) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (AdsNextToCarousel) {
      const allImages = AdsNextToCarousel.flatMap(
        (ad: { images: string[] }) => ad.images,
      );
      setImages(allImages);
    }
  }, [loadingRightAdsCarousel]);

  return (
    <>
      {(images.length === 0 || loadingRightAdsCarousel) && (
        <div className="left-ads flex lg:flex-col  items-center justify-center  gap-5 md:gap-12">
          <div className="grid animate-pulse w-[10rem] md:w-[22rem] h-36 place-items-center rounded-lg bg-secondaryColor ">
            <IoImageOutline className="h-12 w-12 text-gray-500" />
          </div>
          <div className="grid animate-pulse w-[10rem] md:w-[22rem] h-36 place-items-center rounded-lg bg-secondaryColor ">
            <IoImageOutline className="h-12 w-12 text-gray-500" />
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="left-ads flex lg:flex-col  gap-5 md:gap-12">
          <Link
            className="relative group w-[12rem] rounded-md border bg-white overflow-hidden md:w-[15rem] hover:opacity-90 transition-all xl:w-[20rem]"
            href={AdsNextToCarousel[0]?.link}
          >
            <span
              className=" HoverBackgroundSlide hidden opacity-55  -rotate-45 top-[70px] shadow-2xl   group-hover:block z-50 absolute bg-red-600 left-0 w-96 h-6 transition-all duration-500"
              style={{ animation: "slide-diagonal 1.2s forwards" }}
            ></span>
            <Image
              layout="responsive"
              width={360}
              height={208}
              objectFit="contain"
              src={images[0]}
              loading="eager"
              property="true"
              alt="left-ads 0"
              className="rounded-xl  transition-all"
            />
          </Link>
          <Link
            className="relative group w-[12rem] rounded-md bg-white border md:w-[15rem] overflow-hidden  xl:w-[20rem]"
            href={AdsNextToCarousel[1]?.link}
          >
            <span
              className=" HoverBackgroundSlide hidden opacity-55  -rotate-45 top-[70px] shadow-2xl   group-hover:block z-50 absolute bg-red-600 left-0 w-96 h-6 transition-all duration-500"
              style={{ animation: "slide-diagonal 1.2s forwards" }}
            ></span>
            <Image
              layout="responsive"
              width={360}
              height={208}
              src={images[1]}
              objectFit="contain"
              loading="eager"
              alt="left-ads 2"
              className="rounded-xl hover:opacity-50 transition-all"
            />
          </Link>
        </div>
      )}
    </>
  );
};

export default LeftAdsCarousel;
