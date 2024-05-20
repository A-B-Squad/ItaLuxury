"use client";
import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { IoImageOutline } from "react-icons/io5";
import Image from "next/image";
const FullWidthAds = ({
  FullAdsLoaded,
  FullImageAds,
}: {
  FullAdsLoaded: Boolean;
  FullImageAds: string;
}) => {
  return (
    <>
      {FullAdsLoaded && (
        <div className="grid relative animate-pulse w-full h-52 mt-12  place-items-center rounded-lg bg-mediumBeige ">
          <IoImageOutline className="h-12 w-12 text-gray-500" />
        </div>
      )}

      {!FullAdsLoaded && !FullImageAds && (
        <div className="rounded-xl relative w-full h-52 mt-12 bg-mediumBeige flex flex-col justify-center items-center ">
          <p>{"Full Ads"}</p>
          <p>180px x 960px</p>
        </div>
      )}

      {FullImageAds&& !FullAdsLoaded && (
        <div className=" my-5 h-[180px] w-full relative  ">
          <Image
            src={FullImageAds}
            className="w-full h-[180px]"
            width={960}
            height={180}
            objectFit="contain"
            loading="eager"
            alt="adsFullWidth"
          />
        </div>
      )}
    </>
  );
};

export default FullWidthAds;
