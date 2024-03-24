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

      <div className="flex overflow-hidden w-full   ">
        <Carousel className="carousel w-full flex  items-center   transition-all  duration-500 ease-in-out">
          <CarouselContent className="h-full gap-1 px-8 ">
            {products.map((item: any, index: any) => (
              <CarouselItem
                key={index}
                className={` carousel-item  relative  pb-3 flex overflow-hidden flex-col  border shadow-xl md:basis-1/2 lg:basis-1/4 xl:basis-1/5  
              `}
              >
                <div className="absolute  flex top-2 px-1 justify-between w-full z-40   uppercase text-white text-xs  ">
                  {calcDateForNewProduct(item.createdAt) && (
                    <span className="bg-green-500 w-fit justify-start   p-1 ">
                      nouveau
                    </span>
                  )}
                  {item?.productDiscount?.length && (
                    <span className="bg-red-500 w-fit  p-1 ">promo</span>
                  )}
                </div>

                <div className="flex flex-col h-full  justify-around">
                  <div className="relative hover:scale-110  transition-all cursor-crosshair text-black    flex justify-center items-center">
                    <Image
                      src={item.image}
                      className=" w-52 h-full"
                      width={250}
                      height={250}
                      alt={`products-${item.name}`}
                    />
                  </div>

                  <div className="relative z-10    flex flex-col px-3 w-full justify-end  items-start">
                    <p className="text-sm font-bold  capitalize ">
                      {item.categories[0].name}
                    </p>
                    <p className="text-sm font-medium line-clamp-2 h-10	">
                      {item.name}
                    </p>
                    <p
                      className={`${
                        item?.productDiscount?.length
                          ? "line-through text-gray-400"
                          : "text-strongBeige"
                      }py-2 font-semibold text-xl`}
                    >
                      {item.price.toFixed(2)} DT
                    </p>

                    {item?.productDiscount?.length && (
                      <div className="flex items-center">
                        <span className="text-gray-400 font-thin">
                          A partir de :
                        </span>
                        <span className="text-red-700 font-bold ml-1">
                          {item.productDiscount[0].newPrice.toFixed(2)} DT
                        </span>
                      </div>
                    )}
                  </div>
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
