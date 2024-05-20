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

      {!FullAdsLoaded && FullImageAds?.length <= 0 && (
        <div className="rounded-xl relative w-full h-52 mt-12 bg-mediumBeige flex flex-col justify-center items-center ">
          <p>{"Full Ads"}</p>
          <p>334px x 790px</p>
        </div>
      )}

      {FullImageAds?.length > 0 && !FullAdsLoaded && (
        <div className="md:py-32 py-12  h-[334px] w-[790px] relative  ">
          <Image
            src={FullImageAds}
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

export default FullWidthAds;
