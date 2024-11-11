"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Drawer, IconButton, Typography } from "@material-tailwind/react";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import Link from "next/link";
import Image from "next/legacy/image";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import { CiTrash } from "react-icons/ci";
import { DECREASE_QUANTITY_MUTATION, DELETE_BASKET_BY_ID_MUTATION, INCREASE_QUANTITY_MUTATION } from "@/graphql/mutations";
import { BASKET_QUERY, FETCH_USER_BY_ID } from "@/graphql/queries";
import prepRoute from "@/app/Helpers/_prepRoute";
import {
  useBasketStore,
  useDrawerBasketStore,
  useProductsInBasketStore,
} from "@/app/store/zustand";
import { useToast } from "@/components/ui/use-toast";
import triggerEvents from "@/utlils/trackEvents";
import { pushToDataLayer } from "@/utlils/pushToDataLayer";
import { HiPlus } from "react-icons/hi2";
import { RiSubtractLine } from "react-icons/ri";

interface DecodedToken extends JwtPayload {
  userId: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  inventory: number;
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

const BasketDrawer: React.FC = () => {
  const { toast } = useToast();

  const { isOpen, closeBasketDrawer } = useDrawerBasketStore();
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const {
    products: storedProducts,
    removeProductFromBasket,
    setQuantityInBasket,
    increaseProductInQtBasket,
    decreaseProductInQtBasket,
  } = useProductsInBasketStore();
  const { isUpdated } = useBasketStore();

  const { data, error, refetch } = useQuery(BASKET_QUERY, {
    variables: { userId: decodedToken?.userId },
    skip: !decodedToken?.userId,
    fetchPolicy: "cache-and-network",
  });
  const { toggleIsUpdated } = useBasketStore((state) => ({
    isUpdated: state.isUpdated,
    toggleIsUpdated: state.toggleIsUpdated,
  }));

  const { data: userData } = useQuery(FETCH_USER_BY_ID, {
    variables: {
      userId: decodedToken?.userId,
    },
    skip: !decodedToken?.userId,
  });

  const [deleteBasketById] = useMutation(DELETE_BASKET_BY_ID_MUTATION);

  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      try {
        setDecodedToken(jwt.decode(token) as DecodedToken);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  const productsInBasket = useMemo(() => {
    if (decodedToken?.userId && data?.basketByUserId) {
      return data.basketByUserId.map((basket: any) => ({
        ...basket.Product,
        actualQuantity: basket.quantity,
        basketId: basket.id,
      }));
    }
    return storedProducts;
  }, [decodedToken, data, storedProducts]);

  const totalPrice = useMemo(() => {
    return productsInBasket.reduce((acc: number, curr: Product) => {
      const price = curr.productDiscounts?.length
        ? curr.productDiscounts[0].newPrice
        : curr.price;
      return acc + price * curr.actualQuantity;
    }, 0);
  }, [productsInBasket]);

  useEffect(() => {
    if (isOpen) {
      if (decodedToken?.userId) {
        refetch();
      }
      setQuantityInBasket(
        productsInBasket.reduce(
          (acc: any, curr: { actualQuantity: any }) =>
            acc + curr.actualQuantity,
          0,
        ),
      );
    }
  }, [
    isOpen,
    isUpdated,
    decodedToken,
    refetch,
    productsInBasket,
    setQuantityInBasket,
  ]);

  const handleRemoveProduct = useCallback(
    async (productId: string, basketId?: string) => {
      if (decodedToken?.userId && basketId) {
        try {
          await deleteBasketById({ variables: { basketId } });
          refetch();
        } catch (error) {
          console.error("Failed to delete basket item:", error);
        }
      } else {
        removeProductFromBasket(productId);
      }
    },
    [decodedToken, deleteBasketById, removeProductFromBasket, refetch],
  );
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

      setQuantityInBasket(
        updatedProducts.reduce(
          (total, product) =>
            total + (product.actualQuantity ?? product.quantity),
          0
        )
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
        increaseProductInQtBasket(productId,1);
      }
    },
    [decodedToken, increaseQuantity, handleQuantityChange]
  );

  const handleDecreaseQuantity = useCallback(
    (productId: string, basketId?: string) => {
      if (decodedToken?.userId && basketId) {
        decreaseQuantity({
          variables: { basketId },

        });
      } else {
        decreaseProductInQtBasket(productId);
      }
    },
    [decodedToken, decreaseQuantity, handleQuantityChange]
  );



  const renderProductList = () => (
    <ul role="list" className="divide-y divide-gray-200">
      {productsInBasket.map((product: Product, index: number) => (
        <li className="flex py-2" key={product.id || index}>
          <div className="relative h-24 w-20 flex-shrink-0 rounded-md">
            <Image
              layout="fill"
              objectFit="contain"
              src={
                (product.images &&
                  product.images.length > 0 &&
                  product.images[0]) ||
                "https://res.cloudinary.com/dc1cdbirz/image/upload/v1718970701/b23xankqdny3n1bgrvjz.png"
              }
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="ml-4 flex justify-center-center w-full flex-col">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-2 text-base font-medium w-full justify-between text-gray-900">
                <Link
                  className="hover:text-secondaryColor text-sm w-5/6 transition-colors"
                  href={`/products/tunisie?productId=${product.id}`}

                >
                  {product.name}
                </Link>
                <div className="quantity flex items-center gap-5">
                  <p className="quantiy font-light text-base text-gray-500">
                    QTY: {product.actualQuantity}
                  </p>
                  <div className="flex divide-x border w-max rounded-full">
                    <button
                      type="button"
                      className="bg-secondaryColor opacity-80 hover:opacity-75 rounded-l-full transition-opacity text-white w-fit h-fit  p-2  text-sm font-semibold cursor-pointer"
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
                      className="w-fit  transition-opacity h-fit rounded-r-full  bg-secondaryColor text-white p-2 text-sm hover:opacity-75 font-semibold cursor-pointer"

                      disabled={product.actualQuantity === product?.inventory}
                      onClick={() =>
                        handleIncreaseQuantity(product.id, product.basketId)
                      }
                    >
                      <HiPlus />
                    </button>
                  </div>

                </div>
                <p className="font-semibold tracking-wide">
                  {(product.productDiscounts?.length
                    ? product.productDiscounts[0].newPrice
                    : product.price
                  )?.toFixed(3)}{" "}
                  TND
                </p>
              </div>
              <button
                type="button"
                className="font-medium text-primaryColor hover:text-amber-200"
                onClick={() =>
                  handleRemoveProduct(product.id, product.basketId)
                }
              >
                <CiTrash size={25} />
              </button>
            </div>

          </div>
        </li>
      ))}
    </ul>
  );

  const renderEmptyBasket = () => (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-xl font-semibold">Votre panier est vide</h1>
      <MdOutlineRemoveShoppingCart color="grey" size={100} />
      <Link
        onClick={closeBasketDrawer}
        href="/Collections/tunisie?page=1"
        className="font-medium text-primaryColor hover:text-amber-200 mt-20"
      >
        Continuer vos achats
        <span aria-hidden="true"> &rarr;</span>
      </Link>
    </div>
  );

  if (error) {
    toast({
      title: "Erreur",
      description: "Impossible de charger le panier. Veuillez réessayer.",
      className: "bg-red-500 text-white",
    });
    return;
  }

  return (
    <Drawer
      placement="right"
      open={isOpen}
      onClose={closeBasketDrawer}
      overlay={false}
      className="p-4  h-[200vh]"
      size={400}
      placeholder={""}
      onPointerEnterCapture={""}
      onPointerLeaveCapture={""}
    >
      <div className="mb-6 flex items-center justify-between">
        <Typography
          variant="h5"
          color="blue-gray"
          placeholder={""}
          onPointerEnterCapture={""}
          onPointerLeaveCapture={""}
        >
          Panier
        </Typography>
        <IconButton
          variant="text"
          color="blue-gray"
          onClick={closeBasketDrawer}
          placeholder={""}
          onPointerEnterCapture={""}
          onPointerLeaveCapture={""}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </IconButton>
      </div>
      {productsInBasket.length > 0 ? (
        <div className="flex flex-col justify-between items-center h-full">
          <div className="product-details h-full w-full overflow-hidden hover:overflow-y-auto">
            <div className="flow-root">{renderProductList()}</div>
          </div>
          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Total</p>
              <p>{totalPrice.toFixed(3)} TND</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              Frais de port et taxes calculés à la Vérification.
            </p>
            <div className="mt-6">
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
                      content_name: "Initiate Checkout",
                      content_type: "product",
                      currency: "TND",
                      value: totalPrice,
                      contents: storedProducts.map((product) => ({
                        id: product.id,
                        quantity: product.actualQuantity || product.quantity,
                      })),
                      num_items: storedProducts.reduce(
                        (sum, product) =>
                          sum +
                          (product?.actualQuantity || product?.quantity || 0),
                        0,
                      ),
                    },
                  });
                  pushToDataLayer("Initiate Checkout");
                  closeBasketDrawer()
                }}
                href={{
                  pathname: "/Checkout",
                  query: {
                    products: JSON.stringify(productsInBasket),
                    total: totalPrice.toFixed(3),
                  },
                }}
                className="flex items-center justify-center transition-all  border border-transparent bg-blueColor px-6 py-3 text-base font-medium text-white shadow-sm hover:opacity-80"
              >
                Procéder au paiement   </Link>
              <Link
                onClick={closeBasketDrawer}
                href={"/Basket"}
                className="flex items-center transition-all justify-center  border border-transparent bg-pinkColor px-6 py-3 text-base font-medium text-white shadow-sm hover:opacity-80 mt-4"
              >
                Voir Panier
              </Link>
            </div>
            <div className="mt-6 flex gap-2 justify-center text-center text-sm text-gray-500">
              <p>ou</p>
              <Link
                onClick={closeBasketDrawer}
                href="/Touts-Les-Produits"
                className="font-medium text-primaryColor transition-all hover:text-secondaryColor"
              >
                Continuer vos achats
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        renderEmptyBasket()
      )}
    </Drawer>
  );
};

export default BasketDrawer;
