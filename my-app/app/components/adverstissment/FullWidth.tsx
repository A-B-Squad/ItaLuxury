"use client";
import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { IoImageOutline } from "react-icons/io5";
import Image from "next/legacy/image";
import Link from "next/link";
const FullWidthAds = ({
  FullAdsLoaded,
  FullImageAds,
  LinkTo,
}: {
  FullAdsLoaded: Boolean;
  FullImageAds: string;
  LinkTo: string;
}) => {
  return (
    <>
      {FullAdsLoaded && (
        <div className="grid relative animate-pulse w-full h-52 mt-12  place-items-center rounded-lg bg-secondaryColor ">
          <IoImageOutline className="h-12 w-12 text-gray-500" />
        </div>
      )}

      {!FullAdsLoaded && !FullImageAds && (
        <div className="rounded-xl relative w-full h-52 mt-12 bg-secondaryColor flex flex-col justify-center items-center ">
          <p>{"Full Ads"}</p>
          <p>180px x 960px</p>
        </div>
      )}

      {FullImageAds && !FullAdsLoaded && (
        <Link href={LinkTo}>
          <div className=" md:my-8  w-full relative h-[85px] md:h-[200px]   ">
            <Image
              className=" h-[85px] md:h-[200px]"
              src={FullImageAds}
              layout="fill"
              objectFit="fill"
              loading="eager"
              alt="adsFullWidth"
            />
          </div>
        </Link>
      )}
    </>
  );
};

export default FullWidthAds;
