"use client";
import { useMutation, useQuery } from "@apollo/client";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import {
  DECREASE_QUANTITY_MUTATION,
  DELETE_BASKET_BY_ID_MUTATION,
  INCREASE_QUANTITY_MUTATION,
} from "../../../graphql/mutations";
import { BASKET_QUERY } from "../../../graphql/queries";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";

interface DecodedToken extends JwtPayload {
  userId: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  quantity: number;
  basketId: string;
}

const Basket = () => {
  const { toast } = useToast();

  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const { loading, refetch } = useQuery(BASKET_QUERY, {
    variables: { userId: decodedToken?.userId },
    onCompleted: (data) => {
      const fetchedProducts = data.basketByUserId.map((basket: any) => ({
        ...basket.Product,
        quantity: basket.quantity,
        basketId: basket.id,
      }));

      setProducts(fetchedProducts);
      const total = fetchedProducts.reduce((acc: number, curr: Product) => {
        return acc + curr.price * curr.quantity;
      }, 0);
      setTotalPrice(total);
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const [increaseQuantity] = useMutation(INCREASE_QUANTITY_MUTATION, {
    onCompleted: ({ increaseQuantity }) => {
      const updatedProducts = products.map((product) =>
        product.basketId === increaseQuantity.id
          ? { ...product, quantity: increaseQuantity.quantity }
          : product
      );
      setProducts(updatedProducts);
      updateTotalPrice(updatedProducts);
    },
  });
  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
  }, []);

  const [decreaseQuantity] = useMutation(DECREASE_QUANTITY_MUTATION, {
    onCompleted: ({ decreaseQuantity }) => {
      const updatedProducts = products.map((product) =>
        product.basketId === decreaseQuantity.id
          ? { ...product, quantity: decreaseQuantity.quantity }
          : product
      );
      setProducts(updatedProducts);
      updateTotalPrice(updatedProducts);
    },
  });
  const [deleteBasketById] = useMutation(DELETE_BASKET_BY_ID_MUTATION, {});

  const handleRemoveProduct = (basketId: string) => {
    const updatedProducts = products.filter(
      (product) => product.basketId !== basketId
    );

    const updatedTotalPrice = updatedProducts.reduce((acc, curr) => {
      return acc + curr.price * curr.quantity;
    }, 0);
    setTotalPrice(updatedTotalPrice);
    setProducts(updatedProducts);
    deleteBasketById({ variables: { basketId } });
  };

  const updateTotalPrice = (updatedProducts: Product[]) => {
    const total = updatedProducts.reduce((acc: number, curr: Product) => {
      return acc + curr.price * curr.quantity;
    }, 0);
    setTotalPrice(total);
  };

  return (
    <div className="">
      <div className="grid lg:grid-cols-3 gap-5 p-8">
        <div className="lg:col-span-2 p-10 bg-white overflow-x-auto shadow-xl">
          <div className="flex border-b pb-4">
            <h2 className="text-2xl font-extrabold text-[#333] flex-1">
              Panier
            </h2>
            <h3 className="text-xl font-extrabold text-[#333]">
              {products.length} articles
            </h3>
          </div>
          <div>
            <table className="mt-6 w-full border-collapse divide-y">
              <thead className="whitespace-nowrap text-left">
                <tr>
                  <th className="text-base text-[#333] p-4">Description</th>
                  <th className="text-base text-[#333] p-4">Quantité</th>
                  <th className="text-base text-[#333] p-4">Prix</th>
                </tr>
              </thead>
              <tbody className="whitespace-nowrap divide-y">
                {products.map((product) => (
                  <tr className="b">
                    <td className="py-6 px-4 ">
                      <div className="flex items-center gap-6 ">
                        <Image
                          width={150}
                          height={150}
                          alt={product.name}
                          src={product.images[0]}
                        />
                        <div>
                          <p className="text-md font-bold text-[#333]">
                            {product.name}
                          </p>
                          <button
                            type="button"
                            className="mt-4 font-semibold text-red-400 text-sm flex items-center justify-center gap-1 cursor-pointer"
                            onClick={() => {
                              handleRemoveProduct(product.basketId);
                              toast({
                                title: "Notification de Panier",
                                description: `Le produit "${product?.name}" a été retiré du panier.`,
                                className: "bg-white",
                              });
                            }}
                          >
                            <FaRegTrashAlt />
                            Retirer
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex divide-x border w-max">
                        <button
                          type="button"
                          className="bg-lightBeige px-4 py-2 font-semibold cursor-pointer"
                          onClick={() => {
                            decreaseQuantity({
                              variables: { basketId: product.basketId },
                            });
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 fill-current cursor-pointer"
                            viewBox="0 0 124 124"
                          >
                            <path
                              d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
                              data-original="#000000"
                            ></path>
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="bg-transparent px-4 py-2 font-semibold text-[#333] text-md"
                        >
                          {product.quantity}
                        </button>
                        <button
                          type="button"
                          className="bg-strongBeige text-white px-4 py-2 font-semibold cursor-pointer"
                          onClick={() => {
                            increaseQuantity({
                              variables: { basketId: product.basketId },
                            });
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 fill-current cursor-pointer"
                            viewBox="0 0 42 42"
                          >
                            <path
                              d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                              data-original="#000000"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <h4 className="text-md font-bold text-[#333]">
                        {product.price.toFixed(3)} TND
                      </h4>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-gray-50 p-10 shadow-xl">
          <h3 className="text-xl font-extrabold text-[#333] border-b pb-4">
            Récapitulatif de la commande
          </h3>
          <ul className="text-[#333] divide-y mt-6">
            <li className="flex flex-wrap gap-4 text-md py-4">
              {products.length > 1 ? (
                <span className="font-normal">
                  {products.length}
                  articles
                </span>
              ) : (
                <span className="font-normal">1 article</span>
              )}
              <span className="ml-auto font-semibold">
                {totalPrice.toFixed(3)} TND
              </span>
            </li>
            <li className="flex flex-wrap gap-4 text-md py-4">
            Livraison{" "}
              <span className="ml-auto font-semibold">
                {totalPrice >= 499 ? "Gratuit" : "8.000 TND"}
              </span>
            </li>
            <li className="flex flex-wrap gap-4 text-md py-4 font-semibold">
              Total (TTC){" "}
              <span className="ml-auto">
                {totalPrice >= 499
                  ? totalPrice.toFixed(3)
                  : (totalPrice + 8).toFixed(3)}{" "}
                TND
              </span>
            </li>
          </ul>
          <Link
            href={{
              pathname: "/Checkout",
              query: {
                total:
                  totalPrice >= 499
                    ? totalPrice.toFixed(3)
                    : totalPrice.toFixed(3) + 8,
                products: JSON.stringify(products),
              },
            }}
            className=" relative top-5 text-md px-10 py-2 w-full transition-all bg-strongBeige hover:bg-amber-200 text-white  cursor-pointer"
          >
            Vérifier
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Basket;
