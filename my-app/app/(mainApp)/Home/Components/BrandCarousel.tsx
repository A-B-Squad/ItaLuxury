import React from "react";
import { Slot } from "@radix-ui/react-slot";
import Marquee from "react-fast-marquee";
import Image from "next/legacy/image";
import { useQuery } from "@apollo/client";
import { GET_BRANDS } from "@/graphql/queries";
import { IoImageOutline } from "react-icons/io5";

export const BrandsCarousel = () => {
  const { loading: loadingBrand, data } = useQuery(GET_BRANDS);

  return (
    <>
      <div className="h-40 flex items-center mt-10 relative w-full overflow-hidden z-20 bg-[#ffffffcc] shadow-md">
        <Marquee
          gradient
          gradientColor="hsl(var(--widget))"
          className="text-muted-foreground overflow-hidden"
        >
          {data?.fetchBrands.map((brand: any, index: number) => (
            <div
              key={index}
              className="mx-20 transition-al overflow-hiddenl cursor-pointer hover:scale-125"
            >
              <Slot className="w-24 bg-red-500 h-24">
                <>
                  {brand.logo && (
                    <img
                      width={400}
                      height={400}
                      src={brand.logo}
                      alt=""
                      className="object-contain w-24 h-24"
                    />
                  )}

                  {loadingBrand && (
                    <div className="flex">
                      {[...Array(5)].map((_, index) => (
                        <div
                          key={index}
                          className="h-28 w-28 rounded-lg bg-secondaryColor"
                        >
                          <IoImageOutline className="h-12 w-12 text-gray-500" />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              </Slot>
            </div>
          ))}
        </Marquee>
      </div>
    </>
  );
};
