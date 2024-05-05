import React, { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CiHeart } from "react-icons/ci";
import { BASKET_QUERY, BEST_SALES_QUERY } from "@/graphql/queries";
import Image from "next/image";
import Link from "next/link";
import prepRoute from "@/app/components/_prepRoute";
import { FaBasketShopping } from "react-icons/fa6";
import { FaRegEye, FaRegHeart } from "react-icons/fa";
import {
  useBasketStore,
  useComparedProductsStore,
  useDrawerBasketStore,
  useProductDetails,
  useProductsInBasketStore,
} from "@/app/store/zustand";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ADD_TO_BASKET_MUTATION } from "@/graphql/mutations";
import FavoriteProduct from "@/app/components/ProductCarousel/FavoriteProduct";

interface Discount {
  id: string;
  percentage: number;
}

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  images: string[];
  price: number;
  productDiscounts: {
    newPrice: number;
    price: number;
    Discount: Discount;
  }[];
  categories: Category[];
}

interface BestSalesData {
  Product: Product;
  Category: Category;
}

interface BestSalesResponse {
  data: {
    products: {
      getBestSales: BestSalesData[];
    };
  };
}
interface DecodedToken extends JwtPayload {
  userId: string;
}

const BestSales: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [getBestSales, { loading, error }] =
    useLazyQuery<BestSalesResponse>(BEST_SALES_QUERY);

  const { openBasketDrawer } = useDrawerBasketStore();

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
          setAllProducts(data.getBestSales.map((item) => item.Product));

          // Extract unique categories and get only the first subcategory
          const uniqueCategories = Array.from(
            new Set(data.getBestSales.flatMap((item) => item.Category.name))
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
    <div className="flex flex-col items-center md:flex-row gap-3">
      {categories.map((category: string, index: number) => (
        <table key={index} className="text-sm text-gray-500 w-full">
          <thead>
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-white tracking-wide uppercase bg-strongBeige"
              >
                {category}
              </th>
            </tr>
          </thead>
          <tbody className="border max-h-96 h-96 overflow-y-scroll">
            {/* Render products belonging to this category */}
            {allProducts
              .filter(
                (product: Product) => product?.categories[0].name === category
              )
              .map((product: Product) => (
                <div
                  key={product.id}
                  className="bg-white border-b relative  hover:opacity-90 transition-all group "
                >
                  <td className=" flex font-medium  text-gray-900 w-full border-b relative">
                    {/* Render product details */}
                    <div className="w-full flex gap-5  items-center">
                      <div className="relative h-28 w-28  ">
                        <span className="z-50 flex flex-col gap-1 items-center justify-center group-hover:bg-[#000000ba] transition-all absolute h-full w-full top-0 left-0">
                          <div
                            title="Ajouter au panier"
                            onClick={() => AddToBasket(product)}
                            className="cursor-pointer hover:opacity-70 p-1 group-hover:opacity-100 opacity-0 hover:bg-strongBeige bg-white text-black hover:text-white rounded-full transition-all"
                          >
                            <FaBasketShopping size={20} />
                          </div>
                          <div
                            className="cursor-pointer hover:opacity-70 p-1 group-hover:opacity-100 opacity-0 hover:bg-strongBeige bg-white text-black hover:text-white rounded-full transition-all"
                            title="aperçu rapide"
                            onClick={() => openProductDetails(product)}
                          >
                            <FaRegEye size={20} />
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
                          className="hover:text-strongBeige transition-all cursor-pointer tracking-wider  "
                          title={product.name}
                          href={{
                            pathname: `/products/tunisie/${prepRoute(product?.name)}`,
                            query: {
                              productId: product?.id,
                              collection: [
                                product?.categories[0]?.name,
                                product?.categories[0]?.id,
                                product?.categories[0]?.subcategories[0]?.name,
                                product?.categories[0]?.subcategories[0]?.id,
                                product?.categories[0]?.subcategories[0]
                                  ?.subcategories[1]?.name,
                                product?.categories[0]?.subcategories[0]
                                  ?.subcategories[1]?.id,
                                product?.name,
                              ],
                            },
                          }}
                        >
                          <p className="text-left">{product.name}</p>
                        </Link>

                        {product.productDiscounts.length === 0 ? (
                          <div className="flex gap-2 font-bold text-red-500 text-base ">
                            <span className="">
                              {product?.price.toFixed(3)} DT
                            </span>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <span className=" font-bold text-red-500 text-base">
                              {product.productDiscounts[0]?.price.toFixed(3)} DT
                            </span>
                            <span className="text-gray-400 line-through">
                              {product.productDiscounts[0]?.newPrice.toFixed(3)}{" "}
                              DT
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="relative right-4 top-4">
                      <FavoriteProduct
                        isFavorite={isFavorite}
                        setIsFavorite={setIsFavorite}
                        heartSize={20}
                        heartColor={"gray"}
                        productId={product?.id}
                        userId={decodedToken?.userId}
                      />
                    </div>
                  </td>
                </div>
              ))}
          </tbody>
        </table>
      ))}
    </div>
  );
};

export default BestSales;
