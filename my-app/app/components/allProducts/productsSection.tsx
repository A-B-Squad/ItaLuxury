import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { convertStringToQueriesObject } from "./sideBar";
import { useLazyQuery, useMutation } from "@apollo/client";
import { BASKET_QUERY, SEARCH_PRODUCTS_QUERY } from "../../../graphql/queries";
import { FaHeart } from "react-icons/fa";
import { SlBasket } from "react-icons/sl";
import { ADD_TO_BASKET_MUTATION } from "@/graphql/mutations";
import { useBasketStore, useProductsInBasketStore } from "@/app/store/zustand";
import jwt, { JwtPayload } from "jsonwebtoken";
import Cookies from "js-cookie";

const ProductsSection = () => {
  const searchParams = useSearchParams();

  const colorParam = searchParams?.get("color");
  const categoryParam = searchParams?.get("category");
  const priceParam = searchParams?.get("price");
  const [productsData, setProductsData] = useState([]);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);

  const [searchProducts, { loading }] = useLazyQuery(SEARCH_PRODUCTS_QUERY);
  const [addToBasket] = useMutation(ADD_TO_BASKET_MUTATION);

  const toggleIsUpdated = useBasketStore((state) => state.toggleIsUpdated);
  const { addProductToBasket, products } = useProductsInBasketStore(
    (state) => ({
      addProductToBasket: state.addProductToBasket,
      products: state.products,
    })
  );

  interface DecodedToken extends JwtPayload {
    userId: string;
  }

  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
    const fetchProducts = async () => {
      try {
        const { data } = await searchProducts({
          variables: {
            input: {
              categoryId: categoryParam || undefined,
              colorId: colorParam || undefined,
              minPrice: 1,
              maxPrice: parseInt(priceParam || "500") || undefined,
            },
            page: 1,
            pageSize: 10,
          },
        });
        setProductsData(data.searchProducts);
      } catch (error) {}
    };

    fetchProducts();
  }, [searchProducts, colorParam, categoryParam, priceParam]);

  return (
    <div className="flex flex-wrap gap-6">
      {productsData.map((product: Product) => (
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
            <button
              className="flex items-center gap-3 justify-center bg-strongBeige px-2 py-1 text-lg text-white transition hover:bg-yellow-700"
              onClick={() => {
                if (decodedToken) {
                  addToBasket({
                    variables: {
                      input: {
                        userId: decodedToken?.userId,
                        quantity: 1,
                        productId: product.id,
                      },
                    },
                    refetchQueries: [
                      {
                        query: BASKET_QUERY,
                        variables: { userId: decodedToken?.userId },
                      },
                    ],
                  });
                } else {
                  const isProductAlreadyInBasket = products.some(
                    (p: any) => p.id === product.id
                  );

                  if (!isProductAlreadyInBasket) {
                    addProductToBasket({
                      ...product,
                      price: product.productDiscounts
                        ? product.productDiscounts[0].newPrice
                        : product.price,
                      quantity: 1,
                    });
                  } else {
                    console.log("Product is already in the basket");
                  }
                }
                toggleIsUpdated();
              }}
            >
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
