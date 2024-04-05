import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IoImageOutline } from "react-icons/io5";

const SideAds = ({ image, link, adsLoaded }: any) => {
  return (
    <div className="relative hidden  hover:opacity-85 transition-opacity md:block md:w-full lg:w-2/6 overflow-hidden">
      {adsLoaded && (
        <div className="grid h-full max-h-[150] min-h-[150] w-full max-w-xs animate-pulse place-items-center rounded-lg bg-gray-300">
          <IoImageOutline className="h-12 w-12 text-gray-500" />
        </div>
      )}
      {!adsLoaded && (
        <Link href={link}>
          <Image
            src={image}
            width={300} // Set the desired width
            height={300} // Set the desired height
            layout="responsive" // Ensure responsive behavior
            alt="MaisonNg"
            loading="eager" // Load the image immediately
          />
        </Link>
      )}
    </div>
  );
};

export default SideAds;
