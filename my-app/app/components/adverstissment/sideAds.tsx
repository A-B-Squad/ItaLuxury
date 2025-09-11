"use client";

import React, { useState, memo } from "react";
import Link from "next/link";
import Image from "next/image";

import { IoImageOutline } from "react-icons/io5";
import styles from "./index.module.css";

interface SideAdsProps {
  image: string;
  link: string;
  adsLoaded: boolean;
  adsPositon: string;
}

const SideAds: React.FC<SideAdsProps> = ({ image, link, adsLoaded, adsPositon }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const renderContent = () => {
    // Loading state
    if (adsLoaded) {
      return (
        <div className="relative h-[374px] w-[320px] rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse flex flex-col items-center justify-center">
            <IoImageOutline className="h-12 w-12 text-gray-500" />
            <p className="text-gray-500 text-sm mt-2">Chargement...</p>
          </div>
        </div>
      );
    }

    // No image placeholder state
    if (!image) {
      return (
        <div className="relative flex items-center flex-col justify-center h-[390px] w-[240px] rounded-lg bg-gray-100 border border-gray-200">
          <p className="font-medium text-gray-600">{adsPositon}</p>
          <p className="text-sm text-gray-500">240px x 390px</p>
        </div>
      );
    }

    // Image with link state
    return (
      <Link
        className="relative group flex items-center border border-gray-200 rounded-lg overflow-hidden flex-col justify-center w-[240px] h-[390px] min-w-[240px] min-h-[390px] shadow-sm hover:shadow-md transition-all duration-300"
        href={link || "#"}
        aria-label={`${adsPositon} promotion`}
      >
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
        <span
          className={`${styles.HoverBackgroundSlide} hidden opacity-55 -rotate-45 top-[100px] shadow-xl group-hover:block z-20 absolute left-0 w-[2000px] h-6 transition-all duration-500`}
          style={{ animation: "slide-diagonal 1.2s forwards" }}
        ></span>
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <IoImageOutline className="h-8 w-8 text-gray-400" />
          </div>
        )}
        <Image
          priority={true}
          style={{ objectFit: "contain" }}
          src={image}
          fill={true}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt={`${adsPositon} promotion`}
          className="transition-transform duration-300 group-hover:scale-105"
          onLoad={() => setImageLoaded(true)}
        />
      </Link>
    );
  };

  return (
    <div className="side_img relative z-20 transition-all duration-300 flex h-[374px] w-[235px] min-h-[390px] min-w-[230px] overflow-hidden">
      {renderContent()}
    </div>
  );
};

export default memo(SideAds);