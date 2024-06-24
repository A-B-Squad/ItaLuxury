"use client";

import React from "react";
import Link from "next/link";
import Image from "next/legacy/image";
import { IoImageOutline } from "react-icons/io5";

const SideAds = ({ image, link, adsLoaded, adsPositon }: any) => {

  return (
    <div className="side_ads relative hidden   hover:opacity-85 transition-opacity md:flex h-[374px] w-[235px] min-h-[390px] min-w-[230px] overflow-hidden">
      {adsLoaded && (
        <div className="grid  h-[374px] w-[320px] animate-pulse place-items-center rounded-lg bg-secondaryColor">
          <IoImageOutline className="h-12 w-12 text-gray-500" />
        </div>
      )}

      {!image && !adsLoaded && (
        <div className="relative flex items-center flex-col justify-center h-[390px] w-[240px]   rounded-lg bg-secondaryColor">
          <p>{adsPositon}</p>
          <p> 240px x 390px </p>
        </div>
      )}

      {image && (
        <Link
          className="relative group flex items-center border-2  flex-col justify-center w-[240px] h-[390px]  min-w-[240px] min-h-[390px] rounded-lg "
          href={link}
        >
          <span
            className=" HoverBackgroundSlide hidden opacity-55  -rotate-45 top-[100px] shadow-xl   group-hover:block z-50 absolute  left-0 w-[2000px] h-6 transition-all duration-500"
            style={{ animation: "slide-diagonal 1.2s forwards" }}
          ></span>
          <Image src={image} layout="fill" alt="MaisonNg" objectFit="cover" />
        </Link>
      )}
    </div>
  );
};

export default SideAds;
