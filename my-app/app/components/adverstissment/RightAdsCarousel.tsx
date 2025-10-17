"use client";

import Link from "next/link";
import Image from "next/image";

interface Ad {
  images: string[];
  link: string;
}

interface RightAdsCarouselProps {
  AdsNextToCarousel: Ad[];
  loadingRightAdsCarousel: boolean;
}

const RightAdsCarousel = ({ AdsNextToCarousel, loadingRightAdsCarousel }: RightAdsCarouselProps) => {
  if (loadingRightAdsCarousel) {
    return (
      <div className="flex flex-col gap-4">
        <div className="w-[12rem] md:w-[22rem] h-36 bg-gray-200 animate-pulse rounded-lg" />
        <div className="w-[12rem] md:w-[22rem] h-36 bg-gray-200 animate-pulse rounded-lg" />
      </div>
    );
  }

  const ads = AdsNextToCarousel?.filter(ad => ad.images?.[0]).slice(0, 2) || [];

  if (ads.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {ads.map((ad, index) => (
        <Link
          key={`${index}-${ad.images[0]}`}
          href={ad.link || "#"}
          className="block w-[12rem] md:w-[15rem] xl:w-[20rem] h-36 rounded-xl overflow-hidden group"
        >
          <Image
            src={ad.images[0]}
            alt={`Ad ${index + 1}`}
            fill
            className="object-contain transition-transform group-hover:scale-105"
            quality={75}
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
          />
        </Link>
      ))}
    </div>
  );
};

export default RightAdsCarousel;