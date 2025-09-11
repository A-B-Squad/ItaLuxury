"use client";

import React, { useEffect, useState } from "react";
import { IoImageOutline } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";


const RightAdsCarousel = ({
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
        <div className="right-Img flex lg:flex-col  items-center justify-center  gap-5 md:gap-12">
          <div className="grid animate-pulse w-[10rem] md:w-[22rem] h-36 place-items-center rounded-lg bg-secondaryColor ">
            <IoImageOutline className="h-12 w-12 text-gray-500" />
          </div>
          <div className="grid animate-pulse w-[10rem] md:w-[22rem] h-36 place-items-center rounded-lg bg-secondaryColor ">
            <IoImageOutline className="h-12 w-12 text-gray-500" />
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="right-Img flex lg:flex-col  gap-5 md:gap-12">
          <Link
            className="relative w-[12rem] md:w-[15rem]  xl:w-[20rem]"
            href={AdsNextToCarousel[0]?.link}
          >
            <Image
              width={360}
              height={208}
              style={{ objectFit: "contain" }}
              src={images[0]}
              loading="eager"
              property="true"
              alt="right-Img 0"
              className="rounded-xl hover:opacity-50 transition-all"
            />
          </Link>
          <Link
            className="relative w-[12rem] md:w-[15rem]  xl:w-[20rem]"
            href={AdsNextToCarousel[1]?.link}
          >
            <Image
              width={360}
              height={208}
              src={images[1]}
              style={{ objectFit: "contain" }}
              loading="eager"
              alt="right-Img 2"
              className="rounded-xl hover:opacity-50 transition-all"
            />
          </Link>
        </div>
      )}
    </>
  );
};

export default RightAdsCarousel;
