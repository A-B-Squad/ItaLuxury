"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import React from "react";
import { IoImageOutline } from "react-icons/io5";

const NoProductYet = () => {
  return (
    <div className="flex overflow-hidden w-full ">
      <Carousel className="carousel w-full flex items-center transition-all duration-500 ease-in-out">
        <CarouselContent className="h-full gap-5 px-3 ">
          {[0, 1, 2, 3, 4].map((product: any, index: any) => (
            <CarouselItem
              key={index}
              className="carousel-item  transition-all relative pb-3 flex overflow-hidden flex-col justify-between items-center border shadow-xl basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <div className="mt-6 w-96 ">
                <div className="relative grid h-56 rounded-lg  place-items-center bg-secondaryColor">
                  <IoImageOutline className="h-12 w-12 text-gray-500" />
                </div>

                <div className="mt-5 relative ">
                  <p className="mb-4 h-3 w-56 rounded-full bg-secondaryColor">
                    &nbsp;
                  </p>
                  <p className="mb-2 h-2 w-60 rounded-full bg-secondaryColor">
                    &nbsp;
                  </p>
                  <p className="mb-2 h-2 w-64 rounded-full bg-secondaryColor">
                    &nbsp;
                  </p>
                  <p className="mb-2 h-2 w-72 rounded-full bg-secondaryColor">
                    &nbsp;
                  </p>
                  <p className="mb-2 h-2 w-80 rounded-full bg-secondaryColor">
                    &nbsp;
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default NoProductYet;
