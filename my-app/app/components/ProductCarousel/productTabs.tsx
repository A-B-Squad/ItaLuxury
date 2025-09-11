import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React, { useMemo, useCallback } from "react";
import ProductBox from "../ProductBox/ProductBox";
import NoProductYet from "./NoProductYet";
import { ProductData } from "@/app/types";

interface ProductTabsProps {
  data: ProductData[];
  loadingProduct: boolean;
  userData: any;
  className?: string;
  title?: string;
  itemsPerSlide?: number;
}



const ProductTabs: React.FC<ProductTabsProps> = ({
  data,
  userData,
  className,
  title,
  itemsPerSlide = 2
}) => {

  // Memoized product grouping based on itemsPerSlide
  const productGroups = useMemo(() => {
    if (!data || data.length === 0) return [];

    const groups: ProductData[][] = [];
    for (let i = 0; i < data.length; i += itemsPerSlide) {
      groups.push(data.slice(i, i + itemsPerSlide));
    }
    return groups;
  }, [data, itemsPerSlide]);

  // Responsive grid classes
  const gridClasses = useMemo(() => {
    const baseClasses = "grid gap-4 md:gap-6 w-full";
    switch (itemsPerSlide) {
      case 1:
        return `${baseClasses} grid-cols-1`;
      case 2:
        return `${baseClasses}  grid-cols-2 md:grid-cols-3 lg:grid-cols-4`;
      case 3:
        return `${baseClasses} grid-cols-2 md:grid-cols-3`;
      case 4:
      default:
        return `${baseClasses} grid-cols-2 md:grid-cols-3 lg:grid-cols-4`;
    }
  }, [itemsPerSlide]);

  // Memoized carousel configuration
  const carouselOptions = useMemo(() => ({
    align: "start" as const,
    containScroll: "trimSnaps" as const,
    dragFree: true,
    skipSnaps: false,
  }), []);

  // Handle product rendering for carousel items
  const renderCarouselProducts = useCallback((products: ProductData[], groupIndex: number) => (
    <div className="flex flex-col gap-4 md:gap-6 h-full">
      {products.map((product, productIndex) => (
        <div
          key={`${product.id}-${groupIndex}-${productIndex}`}
          className="bg-white rounded-2xl overflow-hidden border border-gray-100 
                    hover:border-gray-200 hover:shadow-lg transition-all duration-300 
                    hover:-translate-y-1 group"
        >
          <ProductBox userData={userData} product={product} />
        </div>
      ))}
    </div>
  ), [userData]);

  // Handle static grid products
  const renderGridProducts = useCallback(() => (
    <div className={gridClasses}>
      {data.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-2xl overflow-hidden border border-gray-100 
                     hover:border-gray-200 hover:shadow-lg transition-all duration-300 
                     hover:-translate-y-1 group"
        >
          <ProductBox userData={userData} product={product} />
        </div>
      ))}
    </div>
  ), [data, userData, gridClasses]);



  if (!data || data.length === 0) {
    return <NoProductYet />;
  }

  // Static grid for small datasets
  const shouldUseCarousel = data.length > 8 || (data.length > 4 && itemsPerSlide === 2);

  if (!shouldUseCarousel) {
    return (
      <div className="w-full space-y-6">
        {title && (
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>
        )}
        {renderGridProducts()}
      </div>
    );
  }

  // Carousel layout for larger datasets
  return (
    <div className="w-full space-y-6">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <div className="flex items-center gap-2">
            <CarouselPrevious className="relative h-10 w-10 rounded-full border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md" />
            <CarouselNext className="relative h-10 w-10 rounded-full border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md" />
          </div>
        </div>
      )}

      <Carousel
        className={`w-full ${className}`}
        opts={carouselOptions}
      >
        <div className="flex items-center justify-end gap-2 absolute -top-12 right-0 z-10">
          <CarouselPrevious className="relative h-10 w-10 rounded-full border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md" />
          <CarouselNext className="relative h-10 w-10 rounded-full border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md" />
        </div>

        <CarouselContent className="-ml-2 md:-ml-4">
          {productGroups.map((productGroup, groupIndex) => (
            <CarouselItem
              key={`group-${groupIndex}`}

              className={`pl-2 md:pl-4  basis-1/2 md:basis-1/3 lg:basis-1/4 ${className}`}
            >
              {renderCarouselProducts(productGroup, groupIndex)}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

// Enhanced memo comparison for better performance
const areEqual = (prevProps: ProductTabsProps, nextProps: ProductTabsProps) => {
  return (
    prevProps.loadingProduct === nextProps.loadingProduct &&
    prevProps.data?.length === nextProps.data?.length &&
    prevProps.userData?.id === nextProps.userData?.id &&
    prevProps.className === nextProps.className &&
    prevProps.title === nextProps.title &&
    prevProps.itemsPerSlide === nextProps.itemsPerSlide &&
    (prevProps.data?.length === 0 ||
      prevProps.data?.every((product, index) =>
        product.id === nextProps.data?.[index]?.id
      ))
  );
};

export default React.memo(ProductTabs, areEqual);