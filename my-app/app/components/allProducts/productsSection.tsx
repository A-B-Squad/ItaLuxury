"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { convertStringToQueriesObject } from "@/app/(mainApp)/Collections/_components/sideBar";
import { useLazyQuery } from "@apollo/client";
import { SEARCH_PRODUCTS_QUERY } from "../../../graphql/queries";
import { FaHeart } from "react-icons/fa";
import { SlBasket } from "react-icons/sl";
import Link from "next/link";
import prepRoute from "../_prepRoute";

const ProductsSection = () => {
  const searchParams = useSearchParams();
  // const paramsObj = convertStringToQueriesObject(searchParams);
  // const { color, category, price } = paramsObj;
  const colorParam = searchParams?.get("color");
  const categoryParam = searchParams?.get("category");
  const priceParamString = searchParams?.get("price");
  const priceParam = priceParamString ? +priceParamString : undefined;
  const [searchProducts, { loading }] = useLazyQuery(SEARCH_PRODUCTS_QUERY);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      console.log(categoryParam, colorParam, priceParam);

      try {
        const { data } = await searchProducts({
          variables: {
            input: {
              categoryId: categoryParam || undefined,
              colorId: colorParam || undefined,
              minPrice: 1,
              maxPrice: priceParam || undefined,
            },
            page: 1,
            pageSize: 10,
          },
        });
        console.log("fetched products:", data.searchProducts);
        setProducts(data.searchProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [searchProducts, colorParam, categoryParam, priceParam]);

  return (
    <div className="w-full grid lg:grid-cols-5 px-10 gap-4 md:grid-cols-3 grid-cols-1">
      {products.map((product: any) => (
        <div className="group  my-10 flex w-full max-w-xs flex-col overflow-hidden border border-gray-100 bg-white shadow-md">
          <Link className="relative flex h-52 overflow-hidden" href="#">
            <div className="group ">
              <img
                className="absolute group-hover:opacity-0 z-10 opacity-100 transition-all top-0 right-0 h-full w-full object-cover"
                src={product.images[0]}
                alt="product image"
              />
              <img
                className="absolute group-hover:opacity-100 opacity-0 transition-all  top-0 right-0 h-full w-full object-cover"
                src={product.images[1]}
                alt="product image"
              />
            </div>
            <div className="absolute bottom-0 mb-4 flex w-full justify-center space-x-4">
              <div className="h-3 w-3 rounded-full border-2 border-white bg-white"></div>
              <div className="h-3 w-3 rounded-full border-2 border-white bg-transparent"></div>
              <div className="h-3 w-3 rounded-full border-2 border-white bg-transparent"></div>
            </div>
            <div className="absolute -right-16 bottom-0 mr-2 mb-4 space-y-2 transition-all duration-300 group-hover:right-0">
              <button className="flex h-10 w-10 items-center justify-center bg-strongBeige text-white transition hover:bg-yellow-700">
                <FaHeart />
              </button>
            </div>
          </Link>
          <div className="mt-4 px-5 pb-5">
            <Link
             className="group"
              href={{
                pathname: `products/tunisie/${prepRoute(product?.name)}`,
                query: {
                  productId: product?.id,
                  collection: [
                    product?.categories[0]?.name,
                    product?.categories[0]?.subcategories[0]?.name,
                    product?.name,
                  ],
                },
              }}
            >
              <h5 className="text-md group-hover:text-mediumBeige transition-colors tracking-tight text-slate-900">
                {product.name}
              </h5>
            </Link>
            <div
            // className={`priceDetails ${product?.productDiscounts.length > 0 ? "group-hover:hidden" : "group-hover:translate-y-32 "}  translate-y-0`}
          >
            <p
              className={`${
                product?.productDiscounts.length > 0
                  ? "line-through text-lg"
                  : " text-strongBeige text-xl py-1"
              }  font-semibold`}
            >
              {product?.price.toFixed(3)} TND
            </p>
            {product?.productDiscounts.length > 0 && (
              <div className="flex items-center">
                <span className="text-gray-400 text-xs font-thin">
                  A partir de :
                </span>
                <span className="text-red-500 font-bold ml-1 text-xl">
                  {product?.productDiscounts[0]?.newPrice.toFixed(3)} TND
                </span>
              </div>
            )}
          </div>
            <button className="flex items-center gap-3 justify-center bg-strongBeige px-2 py-1 text-lg text-white transition hover:bg-yellow-700">
              <SlBasket />
              Ajouter au panier
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsSection;