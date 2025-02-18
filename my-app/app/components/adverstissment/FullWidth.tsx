import React from "react";
import { IoImageOutline } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";

const FullWidthAds = ({
  FullAdsLoaded,
  FullImageAds,
  LinkTo,
}: {
  FullAdsLoaded: boolean;
  FullImageAds: string;
  LinkTo: string;
}) => {
  return (
    <div className="max-w-screen-2xl mx-auto my-2 px-4">
      {FullAdsLoaded && (
        <div className="w-full h-14 md:h-48 animate-pulse bg-secondaryColor rounded-lg flex items-center justify-center">
          <IoImageOutline className="h-8 w-8 md:h-12 md:w-12 text-gray-500" />
        </div>
      )}

      {!FullAdsLoaded && !FullImageAds && (
        <div className="w-full h-14 md:h-48 bg-secondaryColor rounded-lg flex items-center justify-center">
          <p>Full screen</p>
        </div>
      )}

      {FullImageAds && !FullAdsLoaded && (
        <Link href={LinkTo} className="block">
          <div className="max-w-[1536px] mx-auto">
            <div className="relative h-14 md:h-48 w-full">
              <Image
                src={FullImageAds}
                alt="Advertisement"
                fill
                priority
                className="rounded-lg"
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%'
                }}
              />
            </div>
          </div>
        </Link>
      )}
    </div>
  );
};

export default FullWidthAds;