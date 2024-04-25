import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { convertStringToQueriesObject } from "./sideBar";
import { useLazyQuery } from "@apollo/client";
import { SEARCH_PRODUCTS_QUERY } from "../../../graphql/queries";
import { FaHeart } from "react-icons/fa";
import { SlBasket } from "react-icons/sl";

const ProductsSection = () => {
  const searchParams = useSearchParams();
  const paramsObj = convertStringToQueriesObject(searchParams);
  const { color, category, price } = paramsObj;
  const colorParam = searchParams.get("color");
  const categoryParam = searchParams.get("category");
  const priceParam = +searchParams.get("price");
  const [searchProducts, { loading }] = useLazyQuery(SEARCH_PRODUCTS_QUERY);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    searchProducts({
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
      onCompleted: (data) => {
        setProducts(data.searchProducts);
      },
    });
  }, [colorParam, categoryParam, priceParam]);

  return (
    <div className="flex flex-wrap gap-6">
      {products.map((product: Product) => (
        <div className="group my-10 flex w-full max-w-xs flex-col overflow-hidden border border-gray-100 bg-white shadow-md">
          <a className="relative flex h-60 overflow-hidden" href="#">
            <img
              className="absolute top-0 right-0 h-full w-full object-cover"
              src={product.images[0]}
              alt="product image"
            />
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
          </a>
          <div className="mt-4 px-5 pb-5">
            <a href="#">
              <h5 className="text-xl tracking-tight text-slate-900">
                {product.name}
              </h5>
            </a>
            <div className="mt-2 mb-5 flex items-center justify-between">
              <p>
                <span className="text-3xl font-bold text-slate-900">
                  {product.productDiscounts
                    ? product.productDiscounts[0].newPrice.toFixed(3)
                    : product.price.toFixed(3)}{" "}
                  TND
                </span>
                {product.productDiscounts && (
                  <span className="text-sm text-slate-900 line-through">
                    {product.productDiscounts[0].price.toFixed(3)} TND
                  </span>
                )}
              </p>
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
