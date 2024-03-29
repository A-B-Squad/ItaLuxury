"use client";
import calcDateForNewProduct from "@/app/components/_calcDateForNewProduct";
import prepRoute from "@/app/components/_prepRoute";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import TitleProduct from "./titleProduct";
import { useState } from "react";
import Loading from "./Loading";
interface Product {
  images: string[];
  Colors: {
    color: string;
    Hex: string;
  };
}

const ProductTabs = ({ title, data, loadingNewProduct }: any) => {
  const [selectedColors, setSelectedColors] = useState<Record<string, Product>>(
    {}
  );

  const handleColorHover = (productId: string, productColor: Product) => {
    setSelectedColors((prevState) => ({
      ...prevState,
      [productId]: productColor,
    }));
  };

  const handleColorHoverEnd = () => {
    setSelectedColors({});
  };

  
  return (
    <div className="products-tabs relative cursor-pointer rounded-md shadow-lg grid">
      <TitleProduct title={title} />
      {loadingNewProduct && <Loading />}
      {!loadingNewProduct && (
        <div className="flex overflow-hidden w-full ">
          <Carousel className="carousel w-full flex items-center transition-all duration-500 ease-in-out">
            <CarouselContent className="h-full gap-1 px-3 ">
              {data?.products.map((product: any, index: any) => (
                <CarouselItem
                  key={index}
                  className="carousel-item group hover:rounded-sm  transition-all relative pb-3 flex overflow-hidden flex-col justify-between items-center border shadow-xl basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                >
                  <Link
                    className="w-full group-hover:bg-[#00000030] transition-colors"
                    href={{
                      pathname: `products/tunisie/${prepRoute(product.name)}`,
                      query: {
                        productId: product.id,
                      },
                    }}
                  >
                    <div className=" flex justify-between w-full px-3 z-50 uppercase text-white text-[11px] translate-y-2 ">
                      {calcDateForNewProduct(product.createdAt) && (
                        <span className="bg-green-500 w-fit justify-start shadow-md p-1">
                          Nouveau
                        </span>
                      )}
                      {product.productDiscounts.length > 0 && (
                        <span className="bg-red-500 w-fit shadow-md p-1">
                          Promo
                        </span>
                      )}
                    </div>

                    <div className="images relative -z-10 transition-all overflow-hidden cursor-crosshair text-black flex justify-center items-center">
                      <Image
                        src={product.ProductColorImage[0]?.images[0]} // Change to select appropriate image
                        className="w-52 h-full"
                        width={300}
                        height={250}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        alt={`products-${product.name}`}
                        layout="responsive"
                      />
                    </div>
                  </Link>

                  <div className="relative border-t-1 flex flex-col px-3 w-full justify-end items-start">
                    <p className="category  font-normal tracking-widest  text-xs capitalize">
                      {product.categories[2]?.name}
                    </p>

                    <Link
                      href={{
                        pathname: `products/tunisie/${prepRoute(product.name)}`,
                        query: {
                          productId: product.id,
                        },
                      }}
                      product-name={product.name}
                      className="product-name hover:text-strongBeige transition-colors text-sm font-medium tracking-wide
                    line-clamp-2 h-10"
                    >
                      {product.name}
                    </Link>

                    <button
                      className={`${
                        product.productDiscounts.length > 0
                          ? "group-hover:-translate-y-4 "
                          : "group-hover:translate-y-1 "
                      } bg-strongBeige  uppercase absolute translate-y-32 left-1/2 -translate-x-1/2 group-hover:translate-y-0 text-xs md:text-sm md:px-3 z-50 hover:bg-mediumBeige transition-all text-white w-4/5 py-2 rounded-md`}
                    >
                      Ajouter au
                    </button>

                    <div className="colors_available">
                      <ul>
                        {product?.ProductColorImage?.map(
                          (productColor: Product, index: number) => (
                            <li
                              key={index}
                              className="w-5 h-5 border-1 border-gray-200 shadow-gray-400 shadow-sm"
                              onMouseEnter={() =>
                                handleColorHover(product.id, productColor)
                              }
                              onMouseLeave={handleColorHoverEnd}
                              style={{
                                backgroundColor: productColor.Colors.Hex,
                              }}
                            />
                          )
                        )}
                      </ul>
                    </div>

                    {!!selectedColors[product.id] && (
                      <div className="product_color_selected flex justify-center items-center flex-col bg-white border-2 absolute z-50 -top-20 left-1/2 -translate-x-1/2 shadow-lg h-32 w-28">
                        <Image
                          width={90}
                          height={90}
                          src={selectedColors[product.id].images[0]}
                          alt={product.name}
                          layout="responsive"
                        />
                        <p>{selectedColors[product.id].Colors.color}</p>
                      </div>
                    )}

                    <div className="priceDetails group-hover:translate-y-32 translate-y-0">
                      <p
                        className={`${
                          product.productDiscounts.length > 0
                            ? "line-through text-lg"
                            : "text-xl text-strongBeige"
                        } py-1 font-semibold`}
                      >
                        {product.price.toFixed(2)} DT
                      </p>
                      {product.productDiscounts.length > 0 && (
                        <div className="flex items-center">
                          <span className="text-gray-400 font-thin">
                            A partir de :
                          </span>
                          <span className="text-red-500 font-bold ml-1 text-xl">
                            {product.productDiscounts[0]?.newPrice.toFixed(2)}{" "}
                            DT
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="px-2 left-5 transition-all bg-strongBeige text-white z-50" />
            <CarouselNext className="px-2 transition-all right-5 bg-strongBeige text-white z-50" />
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default ProductTabs;
