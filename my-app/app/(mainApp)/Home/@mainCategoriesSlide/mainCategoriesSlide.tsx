"use client";
import { MAIN_CATEGORY_QUERY } from "@/graphql/queries";
import React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useQuery } from "@apollo/client";
import Image from "next/legacy/image";
import Link from "next/link";
import prepRoute from "@/app/Helpers/_prepRoute";

const MainCategoriesSlide = () => {
  const { data: mainCategories } = useQuery(MAIN_CATEGORY_QUERY);

  return (
    <Carousel
      className={`carousel w-full  grid   items-center transition-all duration-500 my-5 bg-white border rounded-sm   `}
    >
      <CarouselContent className=" carousel_content h-full divide-x-2 bg-white  w-full ">
        {mainCategories?.fetchMainCategories?.map(
          (category: any, index: any) => (
            <>
              <CarouselItem
                key={index}
                className={`carousel-item overflow-hidden    group hover:rounded-sm   h-[180px] transition-all relative  basis-1/2 md:basis-1/3 lg:basis-1/6 flex  flex-col justify-evenly  items-center    `}
              >
                <Link
                  href={`/Collections/tunisie/${prepRoute(category.name)}/?category=${category.id}`}
                  className=" group flex flex-col aspect-square items-center gap-4 hover: transition-all p-2 "
                >
                  <span
                    className=" HoverBackgroundSlide hidden opacity-55  -rotate-45 top-[70px] shadow-2xl   group-hover:block z-50 absolute bg-red-600 left-0 w-96 h-6 transition-all duration-500"
                    style={{ animation: "slide-diagonal 1s forwards" }}
                  ></span>
                  {category.smallImage && (
                    <Image
                      src={category.smallImage}
                      width={100}
                      height={100}
                      alt={category.name}
                      objectFit="cover"
                      className="h-24 w-24 object-cover"
                    />
                  )}
                  <span
                    className="text-sm  
                  relative
                   before:h-[1px] before:transition-all  before:bottom-0 before:w-0 before:absolute before:left-0 group-hover:before:w-full before:bg-primaryColor group-hover:before:h-[2px]
                  w-max tracking-wide font-semibold "
                  >
                    {category?.name}
                  </span>
                </Link>
              </CarouselItem>
            </>
          )
        )}
      </CarouselContent>
      <CarouselPrevious className="px-2 left-5 transition-all bg-primaryColor text-white " />
      <CarouselNext className="px-2 transition-all right-5 bg-primaryColor text-white " />
    </Carousel>
  );
};

export default MainCategoriesSlide;
