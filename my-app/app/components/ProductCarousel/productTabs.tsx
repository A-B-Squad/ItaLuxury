import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import NoProductYet from "./NoProductYet";
import ProductBox from "../ProductBox/ProductBox";

interface Product {
  id: string;
}

interface ProductTabsProps {
  data: Product[];
  loadingProduct: boolean;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ data, loadingProduct }) => {
  if (!data || data.length === 0 || loadingProduct) {
    return <NoProductYet />;
  }

  // Create pairs of products for 2 rows
  const productPairs: Product[][] = [];
  for (let i = 0; i < data.length; i += 2) {
    productPairs.push(data.slice(i, i + 2));
  }

  // Static grid for 4 or fewer products
  if (data.length <= 4) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {data.map((product) => (
            <div key={product.id} className="bg-white rounded-lg">
              <ProductBox product={product} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="ProductTabs relative w-full ">
      <Carousel
        className="w-full"
        opts={{
          align: "start",
          containScroll: "trimSnaps"
        }}
      >
        <div className="flex items-center justify-end gap-2 absolute -top-16 right-0">
          <CarouselPrevious
            className="relative h-9 w-9 rounded-full border bg-white 
                      shadow-sm hover:bg-gray-50 transition-colors"
          />
          <CarouselNext
            className="relative h-9 w-9 rounded-full border bg-white 
                      shadow-sm hover:bg-gray-50 transition-colors"
          />
        </div>

        <CarouselContent className="-ml-4">
          {productPairs.map((pair, index) => (
            <CarouselItem
              key={index}
              className="pl-3 basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <div className="flex flex-col gap-4">
                {pair.map((product, productIndex) => (
                  <div
                    key={`${product.id}-${productIndex}`}
                    className="  h-full max-h-[396px] w-full bgwhite rounded-lg"
                  >
                    <ProductBox product={product} />
                  </div>
                ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default ProductTabs;