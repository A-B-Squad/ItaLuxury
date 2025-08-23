"use client";

import { ADVERTISSMENT_QUERY } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import Image from "next/image";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RiCloseLine } from "react-icons/ri";

interface Advertisement {
  link: string[];
  images: string[];
}

const CenterAds: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { data: centerAdsData } = useQuery<{ advertismentByPosition: Advertisement[] }>(
    ADVERTISSMENT_QUERY,
    {
      variables: { position: "BigAds" },
      fetchPolicy: "cache-and-network",
    }
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const advertisement = centerAdsData?.advertismentByPosition[0];

  return (
    <div
      className={`
        fixed inset-0 hidden lg:flex rounded-md items-center justify-center 
        transition-all duration-500 
        ${isVisible
          ? "opacity-100 z-[1000]"
          : "opacity-0 translate-y-6 pointer-events-none"
        }
      `}
    >
      {/* Overlay */}
      <div className="bg-black absolute z-[100] left-0 top-0 w-full h-full opacity-80"></div>

      <div
        className={`
          bg-white shadow-2xl flex items-center justify-center text-center 
          w-[300px] h-[200px] md:w-[700px] md:h-[450px] 
          fixed rounded-md z-[110] 
          transition-transform transform 
          ${isVisible ? "scale-100" : "scale-90"}
        `}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="
            absolute right-2/4 -bottom-12 translate-x-2/4 
            rounded-full w-9 h-9 border-4 border-gray-300 
            z-50 flex items-center justify-center 
            cursor-pointer hover:bg-gray-100 transition-colors
          "
          aria-label="Close advertisement"
        >
          <RiCloseLine size={24} color="#6B7280" />
        </button>

        {/* Advertisement Content */}
        {!advertisement ? (
          <p className="hidden md:block text-gray-500">
            700px × 450px Placeholder
          </p>
        ) : (
          <Link
            href={advertisement.link[0] || '#'}
            className="cursor-pointer rounded-md block w-full h-full relative"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              layout="fill"
              style={{ objectFit: "contain" }}
              quality={100}
              priority
              src={advertisement.images[0]}
              alt="Advertisement"
            />
          </Link>
        )}
      </div>
    </div>
  );
};

export default CenterAds;