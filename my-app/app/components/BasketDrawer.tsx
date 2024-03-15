"use client";
import { Drawer, Typography, IconButton } from "@material-tailwind/react";
import Link from "next/link";
import { gql, useQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";

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

const BasketDrawer = ({ openRight, closeDrawerRight }: any) => {
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
  }, []);

  const BASKET_QUERY = gql`
    query BasketByUserId($userId: ID!) {
      basketByUserId(userId: $userId) {
        id
        userId
        quantity
        Product {
          id
          name
          price
          images
        }
      }
    }
  `;

  const DELETE_BASKET_BY_ID = gql`
    mutation DeleteBasketById($basketId: ID!) {
      deleteBasketById(basketId: $basketId)
    }
  `;

  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
  }, []);

  const { loading, refetch } = useQuery(BASKET_QUERY, {
    variables: { userId: "e8b5999f-75a9-41a1-8681-658294544c1a" },
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

  const [deleteBasketById, { loading: deletingLoading }] =
    useMutation(DELETE_BASKET_BY_ID);

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

  return (
    <Drawer
      placement="right"
      open={openRight}
      onClose={closeDrawerRight}
      className="p-4"
      size={400}
      placeholder={""}
    >
      <div className="mb-6 flex items-center justify-between">
        <Typography placeholder={""} variant="h5" color="blue-gray">
          Panier
        </Typography>
        <IconButton
          placeholder={""}
          variant="text"
          color="blue-gray"
          onClick={closeDrawerRight}
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
      {products.length > 0 ? (
        deletingLoading ? (
          <div>loading</div>
        ) : (
          <>
            <div className="mt-8">
              <div className="flow-root">
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                  {products.map((product) => (
                    <li className="flex py-6">
                      <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={product.images[0]}
                          alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt."
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>
                              <a href="#">{product.name}</a>
                            </h3>
                            <p className="ml-4 ">{product.price} DT</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">Salmon</p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <p className="text-gray-500">
                            Qty {product.quantity}
                          </p>

                          <div className="flex">
                            <button
                              type="button"
                              className="font-medium text-strongBeige hover:text-amber-200"
                              onClick={() => {
                                handleRemoveProduct(product.basketId);
                              }}
                            >
                              Retirer
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Total</p>
                <p> {totalPrice} DT</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">
                Frais de port et taxes calculés à la Vérification.
              </p>
              <div className="mt-6">
                <a
                  href="#"
                  className="flex items-center justify-center rounded-md border border-transparent bg-strongBeige px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-amber-500"
                >
                  Vérifier
                </a>
                <Link
                  onClick={closeDrawerRight}
                  href="/Basket"
                  className="flex items-center justify-center rounded-md border border-transparent bg-lightBeige px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-amber-500 mt-4"
                >
                  Voir Panier
                </Link>
              </div>
              <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                <p>
                  ou
                  <button
                    type="button"
                    className="font-medium text-strongBeige hover:text-amber-200"
                  >
                    Continuer vos achats
                    <span aria-hidden="true"> &rarr;</span>
                  </button>
                </p>
              </div>
            </div>
          </>
        )
      ) : (
        <div className="flex flex-col justify-center items-center h-screen">
          <h1 className="text-xl font-semibold">Votre panier est vide</h1>
          <MdOutlineRemoveShoppingCart color="grey" size={100} />
          <button
            type="button"
            className="font-medium text-strongBeige hover:text-amber-200 mt-20"
          >
            Continuer vos achats
            <span aria-hidden="true"> &rarr;</span>
          </button>
        </div>
      )}
    </Drawer>
  );
};

export default BasketDrawer;
