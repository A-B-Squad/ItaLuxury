import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { IoImageOutline } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";

const Left = () => {
  const [images, setImages] = useState([]);
  const ADVERTISSMENT_QUERY = gql`
    query AdvertismentByPosition($position: String!) {
      advertismentByPosition(position: $position) {
        images
        link
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
        <div className="left flex lg:flex-col flex-row items-center justify-center  gap-5 md:gap-12">
          <div className="grid animate-pulse w-[10rem] md:w-[22rem] h-36 place-items-center rounded-lg bg-mediumBeige ">
            <IoImageOutline className="h-12 w-12 text-gray-500" />
          </div>
          <div className="grid animate-pulse w-[10rem] md:w-[22rem] h-36 place-items-center rounded-lg bg-mediumBeige ">
            <IoImageOutline className="h-12 w-12 text-gray-500" />
          </div>
        </div>
      )}

      {!adsLoaded && images.length <= 0 && (
        <div className="left flex lg:flex-col  items-center justify-center  gap-5 md:gap-12">
          <div className="rounded-xl w-[10rem] md:w-[22rem] h-52 bg-mediumBeige flex flex-col justify-center items-center ">
            <p>{"Left Ads"}</p>
            <p>352px x 207px</p>
          </div>
          <div className="rounded-xl w-[10rem] md:w-[22rem] h-52 bg-mediumBeige flex flex-col justify-center items-center ">
            <p>{"Left Ads"}</p>
            <p>320px x 374px</p>
          </div>
        </div>
      )}

      {images.length > 0 && !adsLoaded && (
        <div className="left flex lg:flex-col  gap-5 md:gap-12">
          <Link className="static" href={data.advertismentByPosition[0].link}>
            <Image
              src={images[0]}
              layout="fill"
              objectFit="contain"
              alt="image 1"
              className="rounded-xl cursor-pointer hover:opacity-50 transition-all w-[10rem] md:w-[22rem]"
            />
          </Link>
          <Link className="static" href={data.advertismentByPosition[1].link}>
            <Image
              src={images[1]}
              layout="fill"
              objectFit="contain"
              alt="image 2"
              className="rounded-xl w-[10rem] hover:opacity-50 transition-all cursor-pointer md:w-[22rem]"
            />
          </Link>
        </div>
      )}
    </>
  );
};

export default Left;
