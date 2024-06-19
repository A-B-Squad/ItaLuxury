"use client";
import React, { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { BASKET_QUERY, BEST_SALES_QUERY } from "@/graphql/queries";
import Image from "next/legacy/image";
import Link from "next/link";
import prepRoute from "@/app/Helpers/_prepRoute";
import { FaBasketShopping } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
import {
  useBasketStore,
  useDrawerBasketStore,
  useProductDetails,
  useProductsInBasketStore,
} from "@/app/store/zustand";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ADD_TO_BASKET_MUTATION } from "@/graphql/mutations";
import FavoriteProduct from "@/app/components/ProductCarousel/FavoriteProduct";
import { useToast } from "@/components/ui/use-toast";

interface DecodedToken extends JwtPayload {
  userId: string;
}

const BestSales = ({ TopSellsSectionVisibility }: any) => {
  const [allProducts, setAllProducts] = useState<SellsData[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [getBestSales] = useLazyQuery(BEST_SALES_QUERY);

  const { openBasketDrawer } = useDrawerBasketStore();
  const { toast } = useToast();

  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);

  const [addToBasket] = useMutation(ADD_TO_BASKET_MUTATION);

  const toggleIsUpdated = useBasketStore((state) => state.toggleIsUpdated);
  const { openProductDetails } = useProductDetails();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
  }, []);
  const { addProductToBasket, products } = useProductsInBasketStore(
    (state) => ({
      addProductToBasket: state.addProductToBasket,
      products: state.products,
    })
  );

  const AddToBasket = (product: any) => {
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
        (p: any) => p.id === product?.id
      );
      if (!isProductAlreadyInBasket) {
        addProductToBasket({
          ...product,
          price:
            product.productDiscounts.length > 0
              ? product?.productDiscounts[0]?.newPrice
              : product?.price,
          actualQuantity: 1,
        });
      } else {
        console.log("Product is already in the basket");
      }
    }
    toggleIsUpdated();
    openBasketDrawer();
  };

  useEffect(() => {
    const fetchBestSales = async () => {
      try {
        const { data } = await getBestSales();
        if (data) {
          setAllProducts(data.getBestSales.map((item: any) => item.Product));

          // Extract unique categories and get only the first subcategory
          const uniqueCategories = Array.from(
            new Set(
              data.getBestSales.flatMap((item: any) => item.Category.name)
            )
          );
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchBestSales();
  }, []);

  return (
    TopSellsSectionVisibility && (
      <div className="flex flex-col w-full items-center md:flex-row gap-3">
        {categories.map((category: string, index: number) => (
          <table key={index} className="text-sm text-gray-500 w-full">
            <thead>
              <tr>
                <th
                  scope="col"
                  className=" px-3 py-3 text-white tracking-wider uppercase bg-primaryColor"
                >
                  {category}
                </th>
              </tr>
            </thead>
            <tbody className="border-2 w-full p-5 shadow-md max-h-[500px] h-[500px] flex flex-col items-center  overflow-y-auto">
              {allProducts
                .filter(
                  (product: any) => product?.categories[0].name === category
                )
                .map((product: any) => (
                  <div
                    key={product.id}
                    className="bg-white border-b-2 shadow-sm  w-full  relative   hover:opacity-90 transition-all group "
                  >
                    <td className=" flex font-medium  text-gray-900 w-full relative">
                      {/* Render product details */}
                      <div className="w-full flex gap-5  items-center">
                        <div className="relative h-28 w-28  ">
                          <span className="z-50 flex flex-col gap-1 items-center justify-center group-hover:bg-[#000000ba] transition-all absolute h-full w-full top-0 left-0">
                            <div
                              title="Ajouter au panier"
                              onClick={() => {
                                AddToBasket(product);

                                toast({
                                  title: "Notification de Panier",
                                  description: `Le produit "${product?.name}" a été ajouté au panier.`,
                                  className: "bg-primaryColor text-white",
                                });
                              }}
                              className="cursor-pointer hover:opacity-70 p-2 group-hover:opacity-100 opacity-0 hover:bg-primaryColor bg-white text-black hover:text-white rounded-full transition-all"
                            >
                              <FaBasketShopping size={18} />
                            </div>
                            <div
                              className="cursor-pointer hover:opacity-70 p-2 group-hover:opacity-100 opacity-0 hover:bg-primaryColor bg-white text-black hover:text-white rounded-full transition-all"
                              title="aperçu rapide"
                              onClick={() => openProductDetails(product)}
                            >
                              <FaRegEye size={18} />
                            </div>
                          </span>

                          <Image
                            className="  "
                            src={product.images[0]}
                            alt="product"
                            layout="fill"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <Link
                            className="hover:text-primaryColor text-base font-semibold transition-all cursor-pointer tracking-wider  "
                            title={product.name}
                            href={{
                              pathname: `/products/tunisie/${prepRoute(product?.name)}`,
                              query: {
                                productId: product?.id,
                                collection: [
                                  product?.categories[0]?.name,
                                  product?.categories[0]?.id,
                                  product?.categories[0]?.subcategories[0]
                                    ?.name,
                                  product?.categories[0]?.subcategories[0]?.id,
                                  product?.categories[0]?.subcategories[0]
                                    ?.subcategories[0]?.name,
                                  product?.categories[0]?.subcategories[0]
                                    ?.subcategories[0]?.id,
                                  product?.name,
                                ],
                              },
                            }}
                          >
                            <p className="text-left">{product.name}</p>
                          </Link>

                          {product.productDiscounts.length === 0 ? (
                            <div className="flex gap-2 font-bold text-lg tracking-wider text-primaryColor    ">
                              <span>{product?.price.toFixed(3)} DT</span>
                            </div>
                          ) : (
                            <div className="flex gap-2 tracking-wider items-center">
                              <span className="text-primaryColor font-bold text-lg ">
                                {product.productDiscounts[0]?.newPrice.toFixed(
                                  3
                                )}{" "}
                                DT
                              </span>
                              <span className=" line-through text-gray-700 text-base font-semibold">
                                {product.productDiscounts[0]?.price.toFixed(3)}{" "}
                                DT
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="relative right-4 top-4 hover:text-black transition-colors">
                        <FavoriteProduct
                          isFavorite={isFavorite}
                          setIsFavorite={setIsFavorite}
                          heartSize={20}
                          heartColor={"gray"}
                          productId={product?.id}
                          userId={decodedToken?.userId}
                          productName={product?.name}
                        />
                      </div>
                    </td>
                  </div>
                ))}
            </tbody>
          </table>
        ))}
      </div>
    )
  );
};

export default BestSales;
