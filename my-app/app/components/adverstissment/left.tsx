"use client";

import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { IoImageOutline } from "react-icons/io5";
import Link from "next/link";
import Image from "next/legacy/image";
import { ADVERTISSMENT_QUERY } from "@/graphql/queries";

const Left = ({ leftCarouselAds }: any) => {
  const [images, setImages] = useState([]);


  useEffect(() => {
    if (leftCarouselAds && leftCarouselAds.advertismentByPosition) {
      const allImages = leftCarouselAds.advertismentByPosition.flatMap(
        (ad: { images: string[] }) => ad.images
      );
      setImages(allImages);
    }
  }, []);

  return (
    <>
      {images.length === 0 && (
        <div className="left flex lg:flex-col flex-row items-center justify-center  gap-5 md:gap-12">
          <div className="grid animate-pulse w-[10rem] md:w-[22rem] h-36 place-items-center rounded-lg bg-mediumBeige ">
            <IoImageOutline className="h-12 w-12 text-gray-500" />
          </div>
          <div className="grid animate-pulse w-[10rem] md:w-[22rem] h-36 place-items-center rounded-lg bg-mediumBeige ">
            <IoImageOutline className="h-12 w-12 text-gray-500" />
          </div>
        </div>
      )}


      {images.length > 0 && (
        <div className="left flex lg:flex-col  gap-5 md:gap-12">
          <Link
            className="relative w-[12rem] md:w-[15rem]  xl:w-[20rem]"
            href={leftCarouselAds?.advertismentByPosition[0]?.link}
          >
            <Image
              src={images[0]}
              layout="responsive"
              width={360}
              height={208}
              objectFit="contain"
              alt="image 1"
              property="true"
              className="rounded-xl hover:opacity-50 transition-all "
            />
          </Link>
          <Link
            className="relative w-[12rem] md:w-[15rem]  xl:w-[20rem]"
            href={leftCarouselAds?.advertismentByPosition[1]?.link}
          >
            <Image
              layout="responsive"
              width={360}
              height={208}
              objectFit="contain"
              src={images[1]}
              alt="image 2"
              className="rounded-xl hover:opacity-50 transition-all"
            />
          </Link>
        </div>
      )}
    </>
  );
};

export default Left;
