import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React from "react";
import Loading from "./Loading";
import { ProductBox } from "../ProductBox";
import NoProductYet from "./NoProductYet";

const ProductTabs = ({ data, loadingNewProduct, carouselWidthClass }: any) => {
  return (
    <div className="products-tabs relative cursor-pointer rounded-md shadow-lg grid">
      {loadingNewProduct && <Loading />}
      {!loadingNewProduct && data && (
        <div className="flex overflow-hidden w-full h-fit  ">
          <Carousel className="carousel w-full h-4/5 flex items-center transition-all duration-500 ease-in-out">
            <CarouselContent className="h-full gap-1 px-3  w-full ">
              {(data.products ? data.products : data.productsLessThen20).map(
                (product: any, index: any) => (
                  <>
                    <CarouselItem
                      key={product?.id}
                      className={`carousel-item  group hover:rounded-sm  h-[400px]    transition-all relative pb-2  flex  flex-col justify-between  items-center border shadow-xl basis-full  md:basis-1/2 lg:basis-1/4  xxl:basis-1/5 ${carouselWidthClass}`}
                    >
                      <ProductBox product={product} />
                    </CarouselItem>
                  </>
                )
              )}
              {/* {!data && <NoProductYet />} */}
            </CarouselContent>
            <CarouselPrevious className="px-2 left-5 transition-all bg-strongBeige text-white " />
            <CarouselNext className="px-2 transition-all right-5 bg-strongBeige text-white " />
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default ProductTabs;
