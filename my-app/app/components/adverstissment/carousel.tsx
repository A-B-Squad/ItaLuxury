"use client";
import React, { useEffect, useState } from "react";
import { Carousel } from "@material-tailwind/react";
import Link from "next/link";
import Image from "next/legacy/image";
import { IoImageOutline } from "react-icons/io5";

const AdsCarousel = ({ centerCarouselAds, loadingCenterAdsCarousel }: any) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (centerCarouselAds) {
      const allImages = centerCarouselAds.flatMap(
        (ad: { images: string[] }) => ad.images,
      );

      setImages(allImages);
    }
  }, [loadingCenterAdsCarousel]);
  return (
    <>
      {(images.length === 0 || loadingCenterAdsCarousel) && (
        <div className="rounded-xl animate-pulse lg:w-3/4 w-full h-[150px] md:h-[280px] lg:h-[350px] bg-secondaryColor flex flex-col justify-center items-center ">
          <IoImageOutline className="h-12 w-12 text-gray-500" />
        </div>
      )}

      {images.length > 0 && (
        <Carousel
          autoplay
          className="rounded-md border relative lg:min-w-4/5 group w-full h-60 md:h-72 lg:min-h-[400px]  "
          placeholder={""}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          {images.map((image, index) => (
            <Link key={index} rel="preload" href={centerCarouselAds[0]?.link}>
              <Image
                layout="fill"
                src={image}
                objectFit="cover"
                loading="eager"
                property="true"
                alt={`image ${index + 1}`}
                className="  transition-all relative h-full w-full "
              />
            </Link>
          ))}
        </Carousel>
      )}
    </>
  );
};

export default AdsCarousel;
