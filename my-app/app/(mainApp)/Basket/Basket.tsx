"use client";

import { useMutation, useQuery } from "@apollo/client";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import Image from "next/legacy/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { HiPlus } from "react-icons/hi2";
import { RiSubtractLine } from "react-icons/ri";

import {
  useBasketStore,
  useCheckoutStore,
  useProductsInBasketStore,
} from "@/app/store/zustand";
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
import triggerEvents from "@/utlils/trackEvents";
import { Trash2Icon } from "lucide-react";
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
    price: number;
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
  const { setCheckoutProducts, setCheckoutTotal } = useCheckoutStore();

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
      const fetchedProducts = data.basketByUserId?.map((basket: any) => ({
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
            (product.actualQuantity ?? product.quantity) + change
          );
          return { ...product, actualQuantity: newQuantity };
        }
        return product;
      });
      const quantityInBasket = updatedProducts.reduce(
        (total, product) =>
          total + (product.actualQuantity ?? product.quantity),
        0
      )
      setProducts(updatedProducts);
      setQuantityInBasket(
        quantityInBasket
      );
    },
    [storedProducts, setQuantityInBasket]
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
      } else {
        increaseProductInQtBasket(productId, 1);
      }
    },
    [decodedToken, increaseQuantity, handleQuantityChange]
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
                  : product
              )
            );
            toggleIsUpdated();
          },
        });
      } else {
        decreaseProductInQtBasket(productId);
      }
    },
    [decodedToken, decreaseQuantity, handleQuantityChange]
  );

  const [deleteBasketById] = useMutation(DELETE_BASKET_BY_ID_MUTATION);

  // Event handlers
  const handleRemoveProduct = useCallback(
    async (productId: string, basketId?: string) => {
      if (decodedToken?.userId && basketId) {
        try {
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product.basketId !== basketId)
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
    [decodedToken, deleteBasketById, removeProductFromBasket, refetch]
  );
  // Render component

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-5">
        {/* Product list */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center border-b p-6">
            <h2 className="text-2xl font-bold text-gray-800">Panier</h2>
            <h3 className="text-xl font-semibold text-gray-600">
              {products.length} article{products.length > 1 ? "s" : ""}
            </h3>
          </div>

          <Table>
            <TableCaption>Bienvenue sur notre site.</TableCaption>
            <TableHeader>
              <TableRow className="w-full ">
                <TableHead className="text-base">Description</TableHead>
                <TableHead className="text-base">Quantité</TableHead>
                <TableHead className="text-base">Prix</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {(products?.length > 0 ? products : []).map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="flex items-center">
                    <div className="w-24 h-24 relative">
                      <Image
                        alt={product.name}
                        loading="lazy"
                        src={
                          product.images?.[0] ||
                          "https://via.placeholder.com/150"
                        }
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                    <div className="ml-4">
                      <Link
                        href={`/products/tunisie?productId=${product.id}`}
                        className="font-semibold text-sm text-gray-800"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-gray-500">
                        {product.categories
                          ?.map((category) => category.name)
                          .join(", ") || "No categories"}
                      </p>
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
                        disabled={product.actualQuantity === product?.inventory}
                        onClick={() =>
                          handleIncreaseQuantity(product.id, product?.basketId)
                        }
                      >
                        <HiPlus />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="w-[30%]">
                    {product?.productDiscounts?.length > 0 &&
                      product.productDiscounts[0]?.newPrice ? (
                      <h4 className="text-md w-max font-bold text-[#333]">
                        {Number(product.productDiscounts[0].newPrice).toFixed(
                          3
                        )}{" "}
                        TND
                      </h4>
                    ) : (
                      <h4 className="text-md w-max font-bold text-[#333]">
                        {Number(product.price || 0).toFixed(3)} TND
                      </h4>
                    )}
                    <h4
                      className={`text-base w-full font-semibold text-[#333] ${product?.productDiscounts?.length > 0
                        ? "text-gray-700 line-through"
                        : ""
                        }`}
                    >
                      {product?.productDiscounts?.length > 0 &&
                        Number(product.price).toFixed(
                          3
                        )}{" "}
                      TND
                    </h4>
                  </TableCell>
                  <TableCell>
                    <Trash2Icon
                      size={23}
                      className="cursor-pointer"
                      color="red"
                      onClick={() => {
                        handleRemoveProduct(product.id, product?.basketId);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Order summary */}
        <div className="bg-white h-fit sticky top-24 shadow-xl rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6">
            Récapitulatif de la commande
          </h3>
          <ul className="space-y-4 mb-6">
            <li className="flex justify-between text-gray-600">
              <span>
                {products.length} article{products.length > 1 ? "s" : ""}
              </span>
              <span className="font-semibold">
                {totalPrice ? Number(totalPrice).toFixed(3) : "0.000"} TND
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
                setCheckoutProducts(products);
                setCheckoutTotal(Number(totalPrice));
                // Track InitiateCheckout
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
                        sum + (product?.actualQuantity || product?.quantity || 0),
                      0
                    ),
                  },
                });
                pushToDataLayer("InitiateCheckout");
              }}
              href={"/Checkout"}
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
