"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import Link from "next/link";
import Image from "next/legacy/image";
import { FaRegTrashAlt } from "react-icons/fa";
import { HiPlus } from "react-icons/hi2";
import { RiSubtractLine } from "react-icons/ri";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import prepRoute from "@/app/Helpers/_prepRoute";
import { useBasketStore, useProductsInBasketStore } from "@/app/store/zustand";
import {
  DECREASE_QUANTITY_MUTATION,
  DELETE_BASKET_BY_ID_MUTATION,
  INCREASE_QUANTITY_MUTATION,
} from "../../../graphql/mutations";
import {
  BASKET_QUERY,
  COMPANY_INFO_QUERY,
  FETCH_USER_BY_ID,
} from "../../../graphql/queries";
import { pushToDataLayer } from "@/utlils/pushToDataLayer";
import triggerEvents from "@/utlils/trackEvents";

// Interface definitions
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
  productDiscounts: {
    newPrice: number;
  }[];
  categories: {
    name: string;
    id: string;
    subcategories: {
      name: string;
      id: string;
      subcategories: {
        name: string;
        id: string;
      }[];
    }[];
  }[];
  [key: string]: any;
}

const Basket: React.FC = () => {
  // State declarations
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);
  const {
    products: storedProducts,
    removeProductFromBasket,
    setQuantityInBasket,
    increaseProductInQtBasket,
    decreaseProductInQtBasket,
  } = useProductsInBasketStore();
  // Hooks
  const { toast } = useToast();
  const { toggleIsUpdated } = useBasketStore((state) => ({
    isUpdated: state.isUpdated,
    toggleIsUpdated: state.toggleIsUpdated,
  }));

  // Helper functions
  const calculateTotalPrice = useCallback(() => {
    return products.reduce((acc, product) => {
      const productPrice =
        product.productDiscounts?.length > 0
          ? product.productDiscounts[0].newPrice
          : product.price;
      const quantity = product.quantity || product.actualQuantity || 0;
      return acc + Number(productPrice) * quantity;
    }, 0);
  }, [products]);

  // Effects
  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
  }, []);

  useEffect(() => {
    if (!decodedToken?.userId) {
      setProducts(storedProducts);
    }
  }, [storedProducts]);

  useEffect(() => {
    const updatedTotalPrice = calculateTotalPrice();
    setTotalPrice(updatedTotalPrice);
  }, [products]);

  // Queries
  const { refetch } = useQuery(BASKET_QUERY, {
    variables: { userId: decodedToken?.userId },
    skip: !decodedToken?.userId,
    onCompleted: (data) => {
      const fetchedProducts = data.basketByUserId.map((basket: any) => ({
        ...basket.Product,
        quantity: basket.quantity,
        basketId: basket.id,
      }));
      setProducts(fetchedProducts);
    },
    onError: (error) => {
      console.error("Error fetching basket:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le panier. Veuillez réessayer.",
        className: "bg-red-500 text-white",
      });
    },
  });

  const { data: userData } = useQuery(FETCH_USER_BY_ID, {
    variables: {
      userId: decodedToken?.userId,
    },
    skip: !decodedToken?.userId,
  });

  useQuery(COMPANY_INFO_QUERY, {
    onCompleted: (companyData) => {
      setDeliveryPrice(companyData.companyInfo.deliveringPrice);
    },
  });

  const handleQuantityChange = useCallback(
    (productId: string, change: number) => {
      const updatedProducts = storedProducts.map((product) => {
        if (product.id === productId) {
          const newQuantity = Math.max(
            1,
            (product.actualQuantity ?? product.quantity) + change,
          );
          return { ...product, actualQuantity: newQuantity };
        }
        return product;
      });

      setProducts(updatedProducts);
      setQuantityInBasket(
        updatedProducts.reduce(
          (total, product) =>
            total + (product.actualQuantity ?? product.quantity),
          0,
        ),
      );
    },
    [storedProducts, setQuantityInBasket],
  );

  // Mutations
  const [increaseQuantity] = useMutation(INCREASE_QUANTITY_MUTATION);
  const [decreaseQuantity] = useMutation(DECREASE_QUANTITY_MUTATION);

  const handleIncreaseQuantity = useCallback(
    (productId: string, basketId?: string) => {
      if (decodedToken?.userId && basketId) {
        increaseQuantity({
          variables: { basketId },
          onCompleted: ({ increaseQuantity }) => {
            setProducts((prevProducts) =>
              prevProducts.map((product) =>
                product.basketId === increaseQuantity.id
                  ? { ...product, quantity: increaseQuantity.quantity }
                  : product,
              ),
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
      } else {
        increaseProductInQtBasket(productId);
      }
    },
    [decodedToken, increaseQuantity, handleQuantityChange],
  );

  const handleDecreaseQuantity = useCallback(
    (productId: string, basketId?: string) => {
      if (decodedToken?.userId && basketId) {
        decreaseQuantity({
          variables: { basketId },
          onCompleted: ({ decreaseQuantity }) => {
            setProducts((prevProducts) =>
              prevProducts.map((product) =>
                product.basketId === decreaseQuantity.id
                  ? { ...product, quantity: decreaseQuantity.quantity }
                  : product,
              ),
            );
            toggleIsUpdated();
          },
        });
      } else {
        decreaseProductInQtBasket(productId);
      }
    },
    [decodedToken, decreaseQuantity, handleQuantityChange],
  );

  const [deleteBasketById] = useMutation(DELETE_BASKET_BY_ID_MUTATION);

  // Event handlers
  const handleRemoveProduct = useCallback(
    async (productId: string, basketId?: string) => {
      if (decodedToken?.userId && basketId) {
        try {
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product.basketId !== basketId),
          );
          await deleteBasketById({
            variables: { basketId },
          });
          refetch();
          toggleIsUpdated();
        } catch (error) {
          console.error("Failed to delete basket item:", error);
        }
      } else {
        removeProductFromBasket(productId);
      }
    },
    [decodedToken, deleteBasketById, removeProductFromBasket, refetch],
  );

  // Render component
  return (
    <div className="">
      <div className="grid lg:grid-cols-3 gap-5 h-max my-8 py-5">
        {/* Product list */}
        <div className="lg:col-span-2 p-10 bg-white overflow-x-auto shadow-xl">
          <div className="flex justify-between items-center border-b p-6">
            <h2 className="text-2xl font-bold text-gray-800">Panier</h2>
            <h3 className="text-xl font-semibold text-gray-600">
              {products.length} article{products.length > 1 ? "s" : ""}
            </h3>
          </div>

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
                  <TableCell className="font-medium w-full flex items-center md:gap-7">
                    <div className="w-40 h-40 relative">
                      <Image
                        alt={product.name}
                        loading="lazy"
                        src={
                          (product.images &&
                            product.images.length > 0 &&
                            product.images[0]) ||
                          "https://res.cloudinary.com/dc1cdbirz/image/upload/v1718970701/b23xankqdny3n1bgrvjz.png"
                        }
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                    <div>
                      <Link
                        href={`/products/tunisie/${prepRoute(product.name)}/?productId=${product.id}&categories=${[
                          product?.categories[0]?.name,
                          product?.categories[0]?.subcategories[0]?.name,
                          product?.categories[0]?.subcategories[0]
                            ?.subcategories[0]?.name,
                          product.name,
                        ]}`}
                        className="text-md font-bold hover:text-primaryColor text-[#333]"
                      >
                        {product.name}
                      </Link>
                      <button
                        type="button"
                        className="mt-4 font-semibold text-red-400 text-sm flex items-center justify-center gap-1 cursor-pointer"
                        onClick={() =>
                          handleRemoveProduct(product.id, product.basketId)
                        }
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
                        onClick={() =>
                          handleDecreaseQuantity(product.id, product.basketId)
                        }
                        disabled={
                          (product.quantity || product.actualQuantity) === 1
                        }
                      >
                        <RiSubtractLine />
                      </button>
                      <span className="bg-transparent px-2 py-1 font-semibold text-[#333] text-md">
                        {product.quantity || product.actualQuantity}
                      </span>
                      <button
                        type="button"
                        className="bg-primaryColor text-white px-2 py-1 font-semibold cursor-pointer"
                        onClick={() =>
                          handleIncreaseQuantity(product.id, product.basketId)
                        }
                      >
                        <HiPlus />
                      </button>
                    </div>
                  </TableCell>

                  <TableCell>
                    {product?.productDiscounts?.length > 0 && (
                      <h4 className="text-md w-max font-bold text-[#333]">
                        {product.productDiscounts[0].newPrice.toFixed(3)} TND
                      </h4>
                    )}
                    <h4
                      className={`text-base w-full font-semibold text-[#333] ${
                        product?.productDiscounts?.length > 0
                          ? " text-gray-700 line-through"
                          : ""
                      }`}
                    >
                      {product.price.toFixed(3)} TND
                    </h4>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Order summary */}
        <div className="bg-white shadow-xl rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6">
            Récapitulatif de la commande
          </h3>
          <ul className="space-y-4 mb-6">
            <li className="flex justify-between text-gray-600">
              <span>
                {products.length} article{products.length > 1 ? "s" : ""}
              </span>
              <span className="font-semibold">
                {Number(totalPrice).toFixed(3)} TND
              </span>
            </li>
            <li className="flex justify-between text-gray-600">
              <span>Livraison</span>
              <span className="font-semibold">
                {Number(totalPrice) >= 499
                  ? "Gratuit"
                  : `${deliveryPrice.toFixed(3)} TND`}
              </span>
            </li>
            <li className="flex justify-between text-gray-800 font-bold">
              <span>Total (TTC)</span>
              <span>
                {Number(totalPrice) >= 499
                  ? Number(totalPrice).toFixed(3)
                  : (Number(totalPrice) + deliveryPrice).toFixed(3)}{" "}
                TND
              </span>
            </li>
          </ul>

          {products.length > 0 ? (
            <Link
              onClick={() => {
                // Track Add to Cart
                triggerEvents("InitiateCheckout", {
                  user_data: {
                    em: [userData?.fetchUsersById.email.toLowerCase()],
                    fn: [userData?.fetchUsersById.fullName],
                    ph: [userData?.fetchUsersById?.number],
                    country: ["tn"],
                    external_id: userData?.fetchUsersById.id,
                  },
                  custom_data: {
                    content_name: "InitiateCheckout",
                    content_type: "product",
                    currency: "TND",
                    value: totalPrice,
                    contents: products.map((product) => ({
                      id: product.id,
                      quantity: product.actualQuantity || product.quantity,
                    })),
                    num_items: products.reduce(
                      (sum, product) =>
                        sum +
                        (product?.actualQuantity || product?.quantity || 0),
                      0,
                    ),
                  },
                });
                pushToDataLayer("Initiate Checkout");
              }}
              href={{
                pathname: "/Checkout",
                query: {
                  products: JSON.stringify(products),
                  total: Number(totalPrice).toFixed(3),
                },
              }}
              className="block w-full text-center py-3 px-4 bg-primaryColor text-white font-semibold rounded hover:bg-amber-200 transition-colors"
            >
              Procéder au paiement
            </Link>
          ) : (
            <button
              disabled
              className="block w-full text-center py-3 px-4 bg-gray-400 text-white font-semibold rounded cursor-not-allowed"
            >
              Procéder au paiement
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Basket;
