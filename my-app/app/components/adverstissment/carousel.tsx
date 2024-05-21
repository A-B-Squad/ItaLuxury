"use client";
import React, { useEffect, useState } from "react";
import { Carousel } from "@material-tailwind/react";
import { useQuery, gql } from "@apollo/client";
import Link from "next/link";
import Image from "next/legacy/image";
import { ADVERTISSMENT_QUERY } from "@/graphql/queries";
import { IoImageOutline } from "react-icons/io5";

const AdsCarousel = ({ centerCarouselAds }: any) => {
  const [images, setImages] = useState([]);

  
  useEffect(() => {
    if (centerCarouselAds && centerCarouselAds.advertismentByPosition) {
      const allImages = centerCarouselAds.advertismentByPosition.flatMap(
        (ad: { images: string[] }) => ad.images
      );
      setImages(allImages);
    }
  }, []);
  return (
    <>
      {images.length === 0 && (
        <div className="rounded-xl animate-pulse lg:w-3/4 w-full h-[150px] md:h-[280px] lg:h-[350px] bg-mediumBeige flex flex-col justify-center items-center ">
          <IoImageOutline className="h-12 w-12 text-gray-500" />
        </div>
      )}

      
      {images.length > 0 && (
        <Carousel
          autoplay
          className="rounded-xl relative lg:w-3/4 w-full h-60 md:h-72 lg:h-[350px]  "
          placeholder={""}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          {images.map((image, index) => (
            <Link
              key={index}
              rel="preload"
              href={centerCarouselAds?.advertismentByPosition[0]?.link}
            >
              <Image
                layout="fill"
                src={image}
                objectFit="contain"
                loading="eager"
                property="true"
                alt={`image ${index + 1}`}
                className=" hover:opacity-70 transition-all h-full w-full "
              />
            </Link>
          ))}
        </Carousel>
      )}
    </>
  );
};

export default AdsCarousel;
