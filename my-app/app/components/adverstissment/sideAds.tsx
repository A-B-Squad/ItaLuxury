"use client";

import React from "react";
import Link from "next/link";
import Image from "next/legacy/image";
import { IoImageOutline } from "react-icons/io5";

const SideAds = ({ image, link, adsLoaded, adsPositon }: any) => {
  return (
    <div className="side_ads relative hidden   hover:opacity-85 transition-opacity md:flex h-[374px] w-[235px] min-h-[390px] min-w-[230px] overflow-hidden">
      {adsLoaded && (
        <div className="grid  h-[374px] w-[320px] animate-pulse place-items-center rounded-lg bg-mediumBeige">
          <IoImageOutline className="h-12 w-12 text-gray-500" />
        </div>
      )}

      {/* {!image && !adsLoaded && (
        <div className="relative flex items-center flex-col justify-center h-[390px] w-[235px]   rounded-lg bg-mediumBeige">
          <p>{adsPositon}</p>
          <p> 230px x 390px </p>
        </div>
      )} */}

      { image && (
        <Link
          className="relative flex items-center flex-col justify-center h-[374px] w-[320px] min-w-[290px] min-h-[374px] rounded-lg "
          href={link}
        >
          <Image
            src={image}
            width={300} 
            height={300} 
            layout="fill" 
            alt="MaisonNg"
            objectFit="contain"
            objectPosition={0}
          />
        </Link>
      )}
    </div>
  );
};

export default SideAds;
