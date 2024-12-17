"use client";

import React from "react";
import Link from "next/link";
import Image from "next/legacy/image";
import { IoImageOutline } from "react-icons/io5";

const SideAds = ({ image, link, adsLoaded, adsPositon }: any) => {
  const renderContent = () => {
    // Loading state
    if (adsLoaded) {
      return (
        <div className="grid h-[374px] w-[320px] animate-pulse place-items-center rounded-lg bg-gray-300">
          <IoImageOutline className="h-12 w-12 text-gray-500" />
        </div>
      );
    }

    // No image placeholder state
    if (!image) {
      return (
        <div className="relative flex items-center flex-col justify-center h-[390px] w-[240px] rounded-lg bg-gray-300">
          <p>{adsPositon}</p>
          <p>240px x 390px</p>
        </div>
      );
    }

    // Image with link state
    return (
      <Link
        className="relative group flex items-center border-2 flex-col justify-center w-[240px] h-[390px] min-w-[240px] min-h-[390px]"
        href={link}
      >
        <span
          className="HoverBackgroundSlide hidden opacity-55 -rotate-45 top-[100px] shadow-xl group-hover:block z-20 absolute left-0 w-[2000px] h-6 transition-all duration-500"
          style={{ animation: "slide-diagonal 1.2s forwards" }}
        ></span>
        <Image 
          priority={true} 
          objectFit="contain" 
          src={image} 
          layout="fill" 
          alt="ita-luxury" 
        />
      </Link>
    );
  };

  return (
    <div className="side_img relative z-20 hover:opacity-85 transition-opacity flex h-[374px] w-[235px] min-h-[390px] min-w-[230px] overflow-hidden">
      {renderContent()}
    </div>
  );
};

export default SideAds;