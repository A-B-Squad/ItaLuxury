import React, { useState } from "react";
import { Carousel } from "@material-tailwind/react";
import { useQuery, gql } from "@apollo/client";
import Link from "next/link";
import Image from "next/image";
import { ADVERTISSMENT_QUERY } from "@/graphql/queries";
import type { DrawerProps } from "@material-tailwind/react";

const AdsCarousel = () => {
  const [images, setImages] = useState([]);

  const {
    data,
    loading: adsLoaded,
    error,
  } = useQuery(ADVERTISSMENT_QUERY, {
    variables: { position: "slider" },
    onCompleted: (data) => {
      if (data && data.advertismentByPosition) {
        const allImages = data.advertismentByPosition.flatMap(
          (ad: { images: string[] }) => ad.images
        );
        setImages(allImages);
      }
    },
  });

  return (
    <>
      {!adsLoaded && images.length <= 0 && (
        <div className="rounded-xl lg:w-3/4 w-full h-[150px] md:h-[280px] lg:h-[350px] bg-mediumBeige flex flex-col justify-center items-center ">
          <p>{"Carousel Ads"}</p>
          <p>864px x 350px</p>
        </div>
      )}
      {!adsLoaded && images.length > 0 && (
        <Carousel
          autoplay
          className="rounded-xl relative lg:w-3/4 w-full h-[150px] md:h-[280px] lg:h-[350px]  "
          placeholder={""}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          {images.map((image, index) => (
            <Link key={index} 
            rel="preload"
            href={data.advertismentByPosition[index]?.link}>
              <Image
                layout="fill"
                src={image}
                loading="eager"
                property="true"
                alt={`image ${index + 1}`}
                className=" hover:opacity-70 transition-all h-full w-full object-fill"
              />
            </Link>
          ))} 
        </Carousel>
      )}
    </>
  );
};

export default AdsCarousel;
