"use client";
import { useState } from "react";
import Image from "next/image";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";

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

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? 0 : prevIndex - 1));
  };

  const nextSlide = () => {
    if (currentIndex < products.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <div
      className="products-tabs w-screen relative rounded-md shadow-lg "
      onMouseEnter={showNavigationButtons}
      onMouseLeave={hideNavigationButtons}
    >
      <TitleProduct title={title} />

      <div className="flex overflow-hidden ">
        <button
          className={` ${
            isHovered ? "left-0" : "left-[-50px]"
          } transition-all absolute top-1/2 left-0 transform -translate-y-1/2 px-4 py-2 bg-strongBeige text-white rounded-full ${
            currentIndex === 0 ? "bg-lightBeige" : ""
          }`}
          onClick={prevSlide}
          disabled={currentIndex === 0}
        >
          <MdKeyboardArrowLeft />
        </button>
        <div className="carousel flex overflow-x-auto transition-transform gap-3  duration-500 ease-in-out">
          {products.map((item: any, index: any) => (
            <div
              key={index}
              className={` carousel-item shadow-lg border  w-72 p-4   transform transition-transform duration-500 
            hover:scale-90 `}
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              <div className="rounded-md p-4 flex flex-col justify-center">
                <div className="relative w-full h-fit flex justify-center items-center">
                  <Image
                    src={item.image}
                    width={300}
                    height={300}
                    alt={`products-${item.name}`}
                  />
                </div>
              </div>
              <div className="relative z-10 mt-2">
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
            </div>
          ))}
        </div>
        <button
          className={`
            ${isHovered ? "right-0" : "right-[-50px]"} transition-all
              absolute top-1/2 right-0 transform -translate-y-1/2 px-4 py-2 bg-strongBeige text-white rounded-full ${
                currentIndex === products.length - 1 ? "bg-lightBeige" : ""
              } `}
          onClick={nextSlide}
          disabled={currentIndex === products.length - 1}
        >
          <MdKeyboardArrowRight />
        </button>
        {/* {products.length > 1 && (
          <div className="relative top-1/2 transform -translate-y-1/2 flex justify-between w-full">
          
         
          </div>
        )} */}
      </div>
    </div>
  );
};

export default ProductTabs;
