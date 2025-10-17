"use client";

import React, { useState, memo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoImageOutline } from "react-icons/io5";

interface SideAdsProps {
  image: string;
  link: string;
  adsLoaded: boolean;
  adsPositon: string;
}

// Constants for better maintainability
const DIMENSIONS = {
  height: 390,
  width: 240,
} as const;

const BLUR_DATA_URL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

// Styled Components
const loadingClasses = "relative h-[374px] w-[320px] rounded-lg overflow-hidden";
const loadingInnerClasses = "absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse flex flex-col items-center justify-center";
const placeholderClasses = "relative flex items-center flex-col justify-center h-[390px] w-[240px] rounded-lg bg-gray-100 border border-gray-200";
const linkClasses = "relative group flex items-center border border-gray-200 rounded-lg overflow-hidden flex-col justify-center w-[240px] h-[390px] min-w-[240px] min-h-[390px] shadow-sm hover:shadow-md transition-all duration-300";
const overlayClasses = "absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10";
const shimmerClasses = "hidden opacity-55 -rotate-45 top-[100px] shadow-xl group-hover:block z-20 absolute left-0 w-[2000px] h-6 transition-all duration-500";
const imagePlaceholderClasses = "absolute inset-0 flex items-center justify-center bg-gray-100";
const imageClasses = "transition-transform duration-300 group-hover:scale-105";
const containerClasses = "side_img relative z-20 transition-all duration-300 flex h-[374px] w-[235px] min-h-[390px] min-w-[230px] overflow-hidden";

// Components
const LoadingState = memo(() => (
  <div className={loadingClasses}>
    <div className={loadingInnerClasses}>
      <IoImageOutline className="h-12 w-12 text-gray-500" />
      <p className="text-gray-500 text-sm mt-2">Chargement...</p>
    </div>
  </div>
));

const PlaceholderState = memo<{ adsPositon: string }>(({ adsPositon }) => (
  <div className={placeholderClasses}>
    <p className="font-medium text-gray-600">{adsPositon}</p>
    <p className="text-sm text-gray-500">240px x 390px</p>
  </div>
));

const ImageAdContent = memo<{
  image: string;
  link: string;
  adsPositon: string;
  imageLoaded: boolean;
  onImageLoad: () => void;
}>(({ image, link, adsPositon, imageLoaded, onImageLoad }) => (
  <Link
    className={linkClasses}
    href={link || "#"}
    aria-label={`${adsPositon} promotion`}
  >
    <div className={overlayClasses} />
    <span className={shimmerClasses} />

    {!imageLoaded && (
      <div className={imagePlaceholderClasses}>
        <IoImageOutline className="h-8 w-8 text-gray-400" />
      </div>
    )}

    <Image
      src={image}
      alt={`${adsPositon} promotion`}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      style={{ objectFit: "contain" }}
      priority={false}
      className={imageClasses}
      placeholder="blur"
      blurDataURL={BLUR_DATA_URL}
      quality={75}
      onLoad={onImageLoad}
    />
  </Link>
));

// Main Component
const SideAds: React.FC<SideAdsProps> = ({
  image,
  link,
  adsLoaded,
  adsPositon
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const renderContent = () => {
    // Loading state
    if (adsLoaded) {
      return <LoadingState />;
    }

    // No image placeholder state
    if (!image) {
      return <PlaceholderState adsPositon={adsPositon} />;
    }

    // Image with link state
    return (
      <ImageAdContent
        image={image}
        link={link}
        adsPositon={adsPositon}
        imageLoaded={imageLoaded}
        onImageLoad={handleImageLoad}
      />
    );
  };

  return (
    <div className={containerClasses}>
      {renderContent()}
    </div>
  );
};

// Display names for debugging
LoadingState.displayName = 'LoadingState';
PlaceholderState.displayName = 'PlaceholderState';
ImageAdContent.displayName = 'ImageAdContent';

export default memo(SideAds);
