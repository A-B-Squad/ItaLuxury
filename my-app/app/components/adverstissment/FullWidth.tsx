import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import Link from "next/link";
import { IoImageOutline } from "react-icons/io5";
import Image from "next/image";
const FullWidth = () => {
  const [images, setImages] = useState([]);
  const ADVERTISSMENT_QUERY = gql`
    query AdvertismentByPosition($position: String!) {
      advertismentByPosition(position: $position) {
        images
      }
    }
  `;

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
        <div className="grid relative animate-pulse w-full h-full place-items-center rounded-lg bg-gray-300 ">
          <IoImageOutline className="h-12 w-12 text-gray-500" />
        </div>
      )}

      {!adsLoaded && images.length <= 0 && (
        <div className="rounded-xl relative w-full h-full bg-gray-300 flex flex-col justify-center items-center ">
          <p>{"Carousel Ads"}</p>
          <p>334px x 790px</p>
        </div>
      )}
      {images.length > 0 && !adsLoaded && (
        <div className="md:py-32 py-12  h-full w-full relative ">
          <Image
            src={
              "https://res.cloudinary.com/dc1cdbirz/image/upload/v1711937168/gdgjwty4swrew5vyna74.jpg"
            }
            className="w-full h-full"
            
            layout="fill"
            objectFit="contain"
            alt="adsFullWidth"
          />
        </div>
      )}
    </>
  );
};

export default FullWidth;
