import React from "react";
import Marquee from "react-fast-marquee";
import Image from "next/image";
import { useQuery } from "@apollo/client";
import { GET_BRANDS } from "@/graphql/queries";

export const BrandsCarousel = () => {
  const { loading: loadingBrand, data } = useQuery(GET_BRANDS);

  return (
    <div className="h-40 flex items-center mt-10 relative w-full overflow-hidden z-20 bg-[#ffffffcc] shadow-md">
      <Marquee
        gradient
        gradientColor="hsl(var(--widget))"
        className="text-muted-foreground overflow-hidden"
      >
        {loadingBrand ? (
          [...Array(10)].map((_, index) => (
            <div key={index} className="mx-20">
              <div className="w-24 h-24 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-300 rounded" />
              </div>
            </div>
          ))
        ) : (
          data?.fetchBrands?.map((brand: any, index: number) => (
            <div
              key={index}
              className="mx-20 transition-transform duration-300 overflow-hidden cursor-pointer hover:scale-110"
            >
              <div className=" bg-white rounded-lg shadow-sm  flex items-center justify-center p-2">
                {brand.logo ? (
                  <Image
                    width={150}
                    height={150}
                    src={brand.logo}
                    alt={`${brand.name || 'Brand'} ${index}`}
                    className="object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No Logo</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </Marquee>
    </div>
  );
};