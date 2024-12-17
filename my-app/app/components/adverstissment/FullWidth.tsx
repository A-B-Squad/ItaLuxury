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
    <>
      {FullAdsLoaded && (
        <div className="grid relative animate-pulse w-full h-52 mt-12 place-items-center rounded-lg bg-secondaryColor">
          <IoImageOutline className="h-12 w-12 text-gray-500" />
        </div>
      )}

      {!FullAdsLoaded && !FullImageAds && (
        <div className="rounded-xl relative w-full h-52 mt-12 bg-secondaryColor flex flex-col justify-center items-center">
          <p>Full screen</p>
        </div>
      )}

      {FullImageAds && !FullAdsLoaded && (
        <Link href={LinkTo}>
          <div className="w-full relative aspect-[16/3] md:my-8 mt-8">
            <Image
              src={FullImageAds}
              fill
              sizes="(max-width: 768px) 100vw, 960px"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              loading="eager"
              alt="Full screen"
              quality={100}
            />
          </div>
        </Link>
      )}
    </>
  );
};

export default FullWidthAds;