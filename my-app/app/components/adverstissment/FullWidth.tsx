import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import Link from "next/link";
import { IoImageOutline } from "react-icons/io5";
import Image from "next/image";
import { ADVERTISSMENT_QUERY } from "@/graphql/queries";
const FullWidth = () => {
  const [images, setImages] = useState([]);


  const {
    data,
    loading: adsLoaded,
    error,
  } = useQuery(ADVERTISSMENT_QUERY, {
    variables: { position: "left" },
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
      {adsLoaded && (
        <div className="grid relative animate-pulse w-full h-52 mt-12  place-items-center rounded-lg bg-mediumBeige ">
          <IoImageOutline className="h-12 w-12 text-gray-500" />
        </div>
      )}

      {!adsLoaded && images.length <= 0 && (
        <div className="rounded-xl relative w-full h-full bg-mediumBeige flex flex-col justify-center items-center ">
          <p>{"Carousel Ads"}</p>
          <p>334px x 790px</p>
        </div>
      )}
      {images.length > 0 && !adsLoaded && (
        <div className="md:py-32 py-12  h-full w-full relative  ">
          <Image
            src={
              "https://res.cloudinary.com/dc1cdbirz/image/upload/v1711937168/gdgjwty4swrew5vyna74.jpg"
            }
            className="w-full h-full"
            layout="fill"
            objectFit="contain"
            loading="eager"
            alt="adsFullWidth"
          />
        </div>
      )}
    </>
  );
};

export default FullWidth;
