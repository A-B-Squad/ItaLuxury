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

// Define the shape of a product
interface Product {
  id: string;
}

// Define the props for the ProductTabs component
interface ProductTabsProps {
  data: Product[];
  loadingProduct: boolean;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ data, loadingProduct }) => {
  if (!data || (data && data.length == 0) || loadingProduct) {
    return <NoProductYet />;
  }

  // Create pairs of products for 2 rows
  const productPairs: Product[][] = [];
  for (let i = 0; i < data.length; i += 2) {
    productPairs.push(data.slice(i, i + 2));
  }

  return (
    <div className="products-tab relative  w-full rounded-md shadow-sm">
      {data.length > 0 && (
        <Carousel className="productCarousel w-full ">
          <div className="flex items-center justify-end -top-12 right-4 md:right-10 absolute gap-2 z-10">
            <CarouselPrevious className="px-2 shadow-lg border hover:opacity-85 transition-opacity bg-primaryColor text-white" />
            <CarouselNext className="px-2 shadow-lg border bg-primaryColor text-white hover:opacity-85 transition-opacity" />
          </div>

          <CarouselContent className="productCarouselContent lg:pl-10">
            {productPairs.map((pair, index) => (
              <CarouselItem
                key={index}
                className="pl-1 lg:pl-4 basis-1/2  lg:basis-1/3 2xl:basis-1/4 "
              >
                <div className="flex flex-col gap-1 md:gap-3 h-full">
                  {pair.map((product, productIndex) => (
                    <ProductBox
                      key={`${product.id}-${productIndex}`}
                      product={product}
                    />
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </div>
  );
};

export default ProductTabs;
