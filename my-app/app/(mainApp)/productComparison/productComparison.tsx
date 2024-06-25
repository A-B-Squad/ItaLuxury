"use client";
import { useMutation } from "@apollo/client";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import React, { useCallback, useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { HiX } from "react-icons/hi";
import { RiShoppingCartLine } from "react-icons/ri";
import { ADD_TO_BASKET_MUTATION } from "@/graphql/mutations";
import {
  useBasketStore,
  useComparedProductsStore,
  useDrawerBasketStore,
  useProductsInBasketStore,
} from "@/app/store/zustand";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { BASKET_QUERY } from "../../../graphql/queries";
import prepRoute from "@/app/Helpers/_prepRoute";
interface DecodedToken extends JwtPayload {
  userId: string;
}

const ProductComparison = () => {
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const { products, removeProductFromCompare } = useComparedProductsStore(
    (state) => ({
      products: state.products,
      removeProductFromCompare: state.removeProductFromCompare,
    })
  );
  const { openBasketDrawer } = useDrawerBasketStore();
  const { toast } = useToast();

  const [addToBasket] = useMutation(ADD_TO_BASKET_MUTATION);

  const toggleIsUpdated = useBasketStore((state) => state.toggleIsUpdated);
  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
  }, []);
  const removeProduct = useCallback(
    (product: Product) => {
      removeProductFromCompare(product.id);
      toast({
        title: "Produit retiré de la comparaison",
        description: `Le produit "${product?.name}" a été retiré de la comparaison.`,
        className: "bg-primaryColor text-white",
      });
    },
    [removeProductFromCompare, toast]
  );

  const { addProductToBasket } = useProductsInBasketStore((state) => ({
    addProductToBasket: state.addProductToBasket,
    products: state.products,
  }));

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
  return (
    <>
      {products.length > 0 ? (
        <div className="relative overflow-x-auto p-8">
          <h1 className="font-bold text-2xl">
            Compare Produits ({products?.length})
          </h1>
          <table className="w-full text-sm text-left rtl:text-right">
            <thead className="text-xs text-gray-700 uppercase  ">
              <tr>
                {products.map((product: any) => (
                  <th scope="col" className="px-2 py-1">
                    <div className="relative m-2 flex w-[40rem] max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
                      <Link
                        className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl"
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
                              product?.categories[0]?.subcategories[0]
                                ?.subcategories[0]?.name,
                              product?.categories[0]?.subcategories[0]
                                ?.subcategories[0]?.id,
                              product?.name,
                            ],
                          },
                        }}
                      >
                        <img
                          className="object-cover"
                          src={product.images[0]}
                          alt="product image"
                        />
                      </Link>
                      <div className="mt-4 px-3 pb-5">
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
                                product?.categories[0]?.subcategories[0]
                                  ?.subcategories[0]?.name,
                                product?.categories[0]?.subcategories[0]
                                  ?.subcategories[0]?.id,
                                product?.name,
                              ],
                            },
                          }}
                        >
                          <h5 className="text-lg text-center tracking-tight text-slate-900">
                            {product.name}
                          </h5>
                        </Link>
                        <div className="mt-2 mb-5 flex items-center justify-between">
                          <div className="prices flex flex-col">
                            {product.productDiscounts.length > 0 && (
                              <p className="text-lg text-gray-700 line-through font-semibold">
                                {product.price.toFixed(3)} TND
                              </p>
                            )}
                            <p className="text-2xl font-bold text-slate-900">
                              {product.productDiscounts.length
                                ? product.productDiscounts[0].newPrice.toFixed(
                                    3
                                  )
                                : product.price.toFixed(3)}{" "}
                              TND
                            </p>
                          </div>

                          <p
                            className="text-red-700 flex items-center justify-center gap-1 cursor-pointer"
                            onClick={() => {
                              removeProduct(product);
                            }}
                          >
                            {" "}
                            <FaRegTrashAlt />
                            Supprimer
                          </p>
                        </div>
                        <button
                          className="flex items-center transition-all justify-center rounded-md bg-primaryColor px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-secondaryColor focus:outline-none gap-2 focus:ring-4 focus:ring-blue-300"
                          onClick={() => {
                            AddToBasket(product);

                            toast({
                              title: "Notification de Panier",
                              description: `Le produit "${product?.name}" a été ajouté au panier.`,
                              className: "bg-primaryColor text-white",
                            });
                          }}
                        >
                          <RiShoppingCartLine size={25} />
                          Ajouter au panier
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-200 border-b">
                <th
                  scope="row"
                  className="px-6 py-4  font-bold text-gray-900 whitespace-nowrap "
                >
                  Prix
                </th>
                {products.map((product: any) => (
                  <td className="px-6 py-4">{product?.price.toFixed(3)} TND</td>
                ))}
              </tr>
              <tr className="bg-white border-b ">
                <th
                  scope="row"
                  className="px-6  py-4 font-bold text-gray-900 whitespace-nowrap"
                >
                  Description
                </th>
                {products.map((product: any) => (
                  <td className="px-6 py-4">{product?.description}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-screen flex justify-center item-center mt-5">
          <div className="border shadow-md   w-4/5 text-center md:mt-36 h-24 md:h-32  flex items-center gap-3 justify-center ">
            <HiX size={25} className="text-red-400 " />

            <p className="  font-normal  tracking-wider">
              Aucun produit à comparé !
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductComparison;
