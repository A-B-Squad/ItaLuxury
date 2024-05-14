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
  console.log(data);

  return (
    <div className="products-tab w-full  relative cursor-pointer rounded-md shadow-lg grid">
      {loadingNewProduct && <Loading />}
      {!loadingNewProduct && data && data.length>0 && (
        <div className=" overflow-hidden w-full h-fit  ">
          <Carousel className={`carousel w-full h-4/5 grid   items-center transition-all duration-500 ease-in-out   `}>
            <CarouselContent className=" carousel_content h-full gap-1 px-3  w-full ">
              {data.map((product: any, index: any) => (
                <>
                  <CarouselItem
                    key={product?.id}
                    className={`carousel-item  group hover:rounded-sm  h-[400px] transition-all relative pb-2  flex  flex-col justify-between  items-center border shadow-xl   ${carouselWidthClass}`}
                  >
                    <ProductBox product={product} />
                  </CarouselItem>
                </>
              ))}
            </CarouselContent>
            <CarouselPrevious className="px-2 left-5 transition-all bg-strongBeige text-white " />
            <CarouselNext className="px-2 transition-all right-5 bg-strongBeige text-white " />
          </Carousel>
        </div>
      )}
      {!loadingNewProduct && data && data.length === 0 && <NoProductYet />}
    </div>
  );
};

export default ProductTabs;
