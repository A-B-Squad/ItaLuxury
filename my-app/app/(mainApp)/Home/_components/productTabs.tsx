"use client";
import { useState } from "react";
import Image from "next/image";
import calcDateForNewProduct from "@/app/components/_calcDateForNewProduct";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import TitleProduct from "./titleProduct";

const ProductTabs = ({ title, products }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const showNavigationButtons = () => {
    setIsHovered(true);
  };

  const hideNavigationButtons = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="products-tabs  relative rounded-md shadow-lg   grid "
      onMouseEnter={showNavigationButtons}
      onMouseLeave={hideNavigationButtons}
    >
      <TitleProduct title={title} />

      <div className="flex overflow-hidden w-full ">
        <Carousel className="carousel w-full flex items-center   gap-3 transition-all  duration-500 ease-in-out">
          <CarouselContent className="h-full">
            {products.map((item: any, index: any) => (
              <CarouselItem
                key={index}
                className={` carousel-item   flex overflow-hidden flex-col  border shadow-xl md:basis-1/2 lg:basis-1/4 xl:basis-1/5  
                `}
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {calcDateForNewProduct(item.createdAt) && (
                  <span className="bg-green-500 w-fit ml-4 mt-2 z-40 uppercase p-1 text-white text-xs left-0">
                    Nouveau
                  </span>
                )}
                <div className="relative hover:scale-110  transition-all cursor-crosshair text-black    flex justify-center items-center">
                  <Image
                    src={item.image}
                    className=" w-52 h-full"
                    width={250}
                    height={250}
                    alt={`products-${item.name}`}
                  />
                </div>

                <div className="relative z-10 mt-2 py-3 flex flex-col px-3 w-full justify-start items-start">
                  <p className="text-sm font-bold  capitalize ">
                    {item.categories[0].name}
                  </p>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p
                    className={`${
                      item.newPrice
                        ? "line-through text-gray-400"
                        : "text-strongBeige "
                    }font-semibold text-xl`}
                  >
                    {item.price.toFixed(2)} DT
                  </p>
                  {item.newPrice && (
                    <div className="flex items-center">
                      <span className="text-gray-400 font-thin">
                        A partir de :
                      </span>
                      <span className="text-red-700 font-bold ml-1">
                        {item.newPrice.toFixed(2)} DT
                      </span>
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious
            className={`${
              isHovered ? " translate-x-16" : "-translate-x-16"
            } px-2 transition-all bg-strongBeige text-white`}
          />
          <CarouselNext
            className={`${
              isHovered ? "-translate-x-2" : "translate-x-16"
            } px-2 bg-strongBeige text-white transition-all`}
          />
        </Carousel>
      </div>
    </div>
  );
};

export default ProductTabs;
