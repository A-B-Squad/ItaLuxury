import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IoImageOutline } from "react-icons/io5";

const SideAds = ({ image, link, adsLoaded, adsPositon }: any) => {
  return (
    <div className="relative hidden   hover:opacity-85 transition-opacity md:flex h-[374px] w-[235px] min-h-[390px] min-w-[230px] overflow-hidden">
      {adsLoaded && (
        <div className="grid  h-[374px] w-[320px] animate-pulse place-items-center rounded-lg bg-gray-300">
          <IoImageOutline className="h-12 w-12 text-gray-500" />
        </div>
      )}

      {!image && !adsLoaded && (
        <div className="relative flex items-center flex-col justify-center h-[390px] w-[235px]   rounded-lg bg-gray-300">
          {/* <IoImageOutline className="h-12 w-12 text-gray-500" /> */}
          <p>{adsPositon}</p>
          <p>390px x 235px</p>
        </div>
      )}

      {adsLoaded && image && (
        <Link
          className="relative flex items-center flex-col justify-center h-[374px] w-[320px] min-w-[290px] min-h-[374px] rounded-lg "
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
    </div>
  );
};

export default SideAds;
