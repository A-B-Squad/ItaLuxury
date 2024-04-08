import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IoImageOutline } from "react-icons/io5";

const SideAds = ({ image, link, adsLoaded, adsPositon }: any) => {
  return (
    <div className="relative hidden  hover:opacity-85 transition-opacity md:block h-[374px] w-[300px] overflow-hidden">
      {adsLoaded && (
        <div className="grid  h-[374px] w-[320px] animate-pulse place-items-center rounded-lg bg-gray-300">
          <IoImageOutline className="h-12 w-12 text-gray-500" />
        </div>
      )}
      {!adsLoaded && image && (
        <Link
          className="relative flex items-center flex-col justify-center h-[374px] w-[300px]   rounded-lg "
          href={link}
        >
          <a>
            <Image
              src={image}
              width={300} // Set the desired width
              height={300} // Set the desired height
              layout="responsive" // Ensure responsive behavior
              alt="MaisonNg"
              loading="eager" // Load the image immediately
            />
          </a>
        </Link>
      )}
      {!image && !adsLoaded && (
        <div className="relative flex items-center flex-col justify-center h-[374px] w-[300px]   rounded-lg bg-gray-300">
          {/* <IoImageOutline className="h-12 w-12 text-gray-500" /> */}
          <p>{adsPositon}</p>
          <p>320px x 374px</p>
        </div>
      )}
    </div>
  );
};

export default SideAds;
