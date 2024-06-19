"use client";
import { useMutation, useQuery } from "@apollo/client";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DECREASE_QUANTITY_MUTATION,
  DELETE_BASKET_BY_ID_MUTATION,
  INCREASE_QUANTITY_MUTATION,
} from "../../../graphql/mutations";
import { BASKET_QUERY } from "../../../graphql/queries";
import Image from "next/legacy/image";
import { useToast } from "@/components/ui/use-toast";
import prepRoute from "@/app/Helpers/_prepRoute";
import { HiPlus } from "react-icons/hi2";
import { RiSubtractLine } from "react-icons/ri";
import Loading from "../Checkout/loading";
import { useBasketStore } from "@/app/store/zustand";

interface DecodedToken extends JwtPayload {
  userId: string;
}

interface Product {
  [x: string]: any;
  id: string;
  name: string;
  price: number;
  images: string[];
  quantity: number;
  basketId: string;
  productDiscounts: {
    newPrice: number;
  }[];
}

const Basket = () => {
  // Toast for notifications
  const { toast } = useToast();

  // State to store decoded token
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  // State to store products in the basket
  const [products, setProducts] = useState<Product[]>([]);
  // State to store total price of products in the basket
  const [totalPrice, setTotalPrice] = useState<number>(0);
  // Zustand store function to toggle update status
  const { toggleIsUpdated } = useBasketStore((state) => ({
    isUpdated: state.isUpdated,
    toggleIsUpdated: state.toggleIsUpdated,
  }));

  // Function to calculate total price of products in the basket
  const calculateTotalPrice = useCallback(() => {
    return products.reduce((acc, product) => {
      const productPrice =
        product.productDiscounts?.length > 0
          ? product.productDiscounts[0].newPrice
          : product.price;
      return acc + Number(productPrice) * product.quantity;
    }, 0);
  }, [products]);

  // Effect to decode the JWT token from cookies and set the decoded token state
  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
  }, []);
  // Effect to update total price when products change
  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
  }, [products, calculateTotalPrice]);

  // Query to fetch basket data
  const { loading } = useQuery(BASKET_QUERY, {
    variables: { userId: decodedToken?.userId },
    onCompleted: (data) => {
      const fetchedProducts = data.basketByUserId.map((basket: any) => ({
        ...basket.Product,
        quantity: basket.quantity,
        basketId: basket.id,
      }));
      setProducts(fetchedProducts);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  // Mutation to increase product quantity
  const [increaseQuantity] = useMutation(INCREASE_QUANTITY_MUTATION, {
    onCompleted: ({ increaseQuantity }) => {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.basketId === increaseQuantity.id
            ? { ...product, quantity: increaseQuantity.quantity }
            : product
        )
      );
      toggleIsUpdated();
    },
    onError: (error) => {
      if (error.message === "Not enough inventory") {
        toast({
          title: "Notification de Stock",
          description: `Le produit est en rupture de stock.`,
          className: "bg-red-500 text-white",
        });
      }
    },
  });

  // Mutation to decrease product quantity
  const [decreaseQuantity] = useMutation(DECREASE_QUANTITY_MUTATION, {
    onCompleted: ({ decreaseQuantity }) => {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.basketId === decreaseQuantity.id
            ? { ...product, quantity: decreaseQuantity.quantity }
            : product
        )
      );
      toggleIsUpdated();
    },
  });

  // Mutation to delete product from basket
  const [deleteBasketById] = useMutation(DELETE_BASKET_BY_ID_MUTATION);

  // Function to handle product removal from basket
  const handleRemoveProduct = useCallback(
    (basketId: string) => {
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.basketId !== basketId)
      );
      deleteBasketById({ variables: { basketId } });
      toggleIsUpdated();
      toast({
        title: "Notification de Panier",
        description: `Le produit a été retiré du panier.`,
        className: "bg-primaryColor text-white",
      });
    },
    [deleteBasketById, toast, toggleIsUpdated]
  );
  return (
    <div className="">
      <div className="grid lg:grid-cols-3 gap-5 h-max my-8 py-5">
        <div className="lg:col-span-2 p-10 bg-white overflow-x-auto shadow-xl">
          <div className="flex border-b p-5">
            <h2 className="text-2xl font-extrabold text-[#333] flex-1">
              Panier
            </h2>
            <h3 className="text-xl font-extrabold text-[#333]">
              {products.length} articles
            </h3>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <Table>
              <TableCaption>Bienvenue sur notre site.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-base">Description</TableHead>
                  <TableHead className="text-base">Quantité</TableHead>
                  <TableHead className="text-base">Prix</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium  flex items-center gap-7">
                      {" "}
                      <Image
                        width={150}
                        height={150}
                        alt={product.name}
                        src={product.images[0]}
                        objectFit="contain"
                      />
                      <div>
                        <Link
                          rel="preload"
                          href={{
                            pathname: `/products/tunisie/${prepRoute(product?.name)}`,
                            query: {
                              productId: product?.id,
                              collection: [
                                product?.categories[0]?.name,
                                product?.categories[0]?.id,
                                product?.categories[0]?.subcategories[0]?.name,
                                product?.categories[0]?.subcategories[0]?.id,
                                product?.categories[0]?.subcategories[0]?.subcategories[0]?.name,
                                product?.categories[0]?.subcategories[0]?.subcategories[0]?.id,
                                product?.name,
                              ],
                            },
                          }}
                          className="text-md font-bold hover:text-primaryColor text-[#333]"
                        >
                          {product.name}
                        </Link>
                        <button
                          type="button"
                          className="mt-4 font-semibold text-red-400 text-sm flex items-center justify-center gap-1 cursor-pointer"
                          onClick={() => {
                            handleRemoveProduct(product.basketId);
                            toast({
                              title: "Notification de Panier",
                              description: `Le produit "${product?.name}" a été retiré du panier.`,
                              className: "bg-primaryColor text-white",
                            });
                          }}
                        >
                          <FaRegTrashAlt />
                          Retirer
                        </button>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex divide-x border w-max">
                        <button
                          type="button"
                          className="bg-lightBeige px-2 py-1 font-semibold cursor-pointer"
                          onClick={() => {
                            decreaseQuantity({
                              variables: { basketId: product.basketId },
                            });
                          }}
                          disabled={product.quantity === 1}
                        >
                          <RiSubtractLine />
                        </button>
                        <span className="bg-transparent px-2 py-1 font-semibold text-[#333] text-md">
                          {product.quantity}
                        </span>
                        <button
                          type="button"
                          className="bg-primaryColor text-white px-2 py-1 font-semibold cursor-pointer"
                          onClick={() => {
                            increaseQuantity({
                              variables: { basketId: product.basketId },
                            });
                          }}
                        >
                          <HiPlus />
                        </button>
                      </div>
                    </TableCell>

                    <TableCell className="">
                      {product?.productDiscounts?.length > 0 && (
                        <h4 className="text-md w-max font-bold text-[#333]">
                          {product.productDiscounts[0].newPrice.toFixed(3)} TND
                        </h4>
                      )}
                      <h4
                        className={`text-base w-full font-semibold text-[#333] ${product?.productDiscounts?.length > 0 ? " text-gray-700 line-through" : ""}`}
                      >
                        {product.price.toFixed(3)} TND
                      </h4>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="bg-white p-10 shadow-xl">
          <h3 className="text-xl font-extrabold text-[#333] border-b pb-4">
            Récapitulatif de la commande
          </h3>

          {products.length === 0 ? (
            <Loading />
          ) : (
            <>
              <ul className="text-[#333] divide-y mt-6">
                <li className="flex flex-wrap gap-4 text-md py-4">
                  {products.length > 1 ? (
                    <span className="font-normal">
                      {products.length} articles
                    </span>
                  ) : (
                    <span className="font-normal">1 article</span>
                  )}
                  <span className="ml-auto font-sefmibold">
                    {Number(totalPrice).toFixed(3)} TND
                  </span>
                </li>
                <li className="flex flex-wrap gap-4 text-md py-4">
                  Livraison{" "}
                  <span className="ml-auto font-semibold">
                    {Number(totalPrice) >= 499 ? "Gratuit" : "8.000 TND"}
                  </span>
                </li>
                <li className="flex flex-wrap gap-4 text-md py-4 font-semibold">
                  Total (TTC){" "}
                  <span className="ml-auto">
                    {Number(totalPrice) >= 499
                      ? Number(totalPrice).toFixed(3)
                      : (Number(totalPrice) + 8).toFixed(3)}{" "}
                    TND
                  </span>
                </li>
              </ul>
              <Link
                href={{
                  pathname: "/Checkout",
                  query: {
                    products: JSON.stringify(products),
                    total:
                      Number(totalPrice) >= 499
                        ? Number(totalPrice).toFixed(3)
                        : (Number(totalPrice) + 8).toFixed(3),
                  },
                }}
                className=" relative top-5 text-md px-10 py-2 w-full transition-all bg-primaryColor hover:bg-amber-200 text-white  cursor-pointer"
              >
                Vérifier
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Basket;
