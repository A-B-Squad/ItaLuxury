"use client";
import { useMutation, useQuery } from "@apollo/client";
import React, { useCallback } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { HiX } from "react-icons/hi";
import { RiShoppingCartLine } from "react-icons/ri";
import { ADD_TO_BASKET_MUTATION } from "@/graphql/mutations";
import {
  useBasketStore,
  useProductComparisonStore,
  useDrawerBasketStore,
  useProductsInBasketStore,
} from "@/app/store/zustand";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { BASKET_QUERY, FETCH_USER_BY_ID } from "../../../graphql/queries";
import triggerEvents from "../../../utlils/trackEvents";
import { sendGTMEvent } from "@next/third-parties/google";
import { useAuth } from "@/lib/auth/useAuth";


const ProductComparison = () => {
  const { comparisonList, removeFromComparison } = useProductComparisonStore();
  const { openBasketDrawer } = useDrawerBasketStore();
  const { toast } = useToast();
  const { decodedToken, isAuthenticated } = useAuth();

  const [addToBasket] = useMutation(ADD_TO_BASKET_MUTATION);
  const { data: userData } = useQuery(FETCH_USER_BY_ID, {
    variables: {
      userId: decodedToken?.userId,
    },
    skip: !isAuthenticated,
  });
  const toggleIsUpdated = useBasketStore((state) => state.toggleIsUpdated);
  const removeProduct = useCallback(
    (product: Product) => {
      removeFromComparison(product.id);
      toast({
        title: "Produit retiré de la comparaison",
        description: `Le produit "${product?.name}" a été retiré de la comparaison.`,
        className: "bg-primaryColor text-white",
      });
    },
    [removeFromComparison, toast]
  );

  const { addProductToBasket, increaseProductInQtBasket } = useProductsInBasketStore();

  const AddToBasket = async (product: any) => {
    // Track Add to Cart

    triggerEvents("AddToCart", {
      user_data: {
        em: [userData?.fetchUsersById.email.toLowerCase()],
        fn: [userData?.fetchUsersById.fullName],
        ph: [userData?.fetchUsersById?.number],
        country: ["tn"],
        external_id: userData?.fetchUsersById.email.id,
      },
      custom_data: {
        content_name: product.name,
        content_type: "product",
        content_ids: [product.id],
        contents: {
          id: product.id,
          quantity: product.actualQuantity || product.quantity,
        },
        value:
          product.productDiscounts.length > 0
            ? product.productDiscounts[0].newPrice
            : product.price,
        currency: "TND",
      },
    });
    sendGTMEvent({
      event: "add_to_cart",
      ecommerce: {
        currency: "TND",
        value: product.productDiscounts.length > 0
          ? product.productDiscounts[0].newPrice
          : product.price,
        items: [{
          item_id: product.id,
          item_name: product.name,
          quantity: product.actualQuantity || product.quantity,
          price: product.productDiscounts.length > 0
            ? product.productDiscounts[0].newPrice
            : product.price
        }]
      },
      user_data: {
        em: [userData?.fetchUsersById.email.toLowerCase()],
        fn: [userData?.fetchUsersById.fullName],
        ph: [userData?.fetchUsersById?.number],
        country: ["tn"],
        external_id: userData?.fetchUsersById.email.id
      },
      facebook_data: {
        content_name: product.name,
        content_type: "product",
        content_ids: [product.id],
        contents: {
          id: product.id,
          quantity: product.actualQuantity || product.quantity
        },
        value: product.productDiscounts.length > 0
          ? product.productDiscounts[0].newPrice
          : product.price,
        currency: "TND"
      }
    });
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

        onCompleted: () => {
          toast({
            title: "Notification de Panier",
            description: `Le produit "${product?.name}" a été ajouté au panier.`,
            className: "bg-primaryColor text-white",
          });
        },
      });
    } else {
      const isProductAlreadyInBasket = comparisonList.some(
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

        toast({
          title: "Notification de Panier",
          description: `Le produit "${product?.name}" a été ajouté au panier.`,
          className: "bg-primaryColor text-white",
        });
      } else {
        increaseProductInQtBasket(product.id, 1);

        toast({
          title: "Notification de Panier",
          description: `Product is already in the basket`,
          className: "bg-primaryColor text-white",
        });
      }
    }
    toggleIsUpdated();
    openBasketDrawer();
  };

  return (
    <>
      {comparisonList.length > 0 ? (
        <div className="relative overflow-x-auto p-6">
          <h1 className="font-bold text-2xl">
            Compare Produits ({comparisonList?.length})
          </h1>
          <table className="w-full text-sm text-left rtl:text-right">
            <thead className="text-xs text-gray-700 uppercase  ">
              <tr>
                {comparisonList.map((product: any) => (
                  <th scope="col" className="px-2 py-1">
                    <div className="relative m-2 flex w-[40rem] max-w-xs flex-col items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
                      <Link
                        className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl"
                        rel="preload"
                        href={`/products/tunisie?productId=${product.id}`}
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
                          href={`/products/tunisie?productId=${product.id}`}
                        >
                          <p className="text-base text-black  text-center tracking-tight text-slate-900">
                            {product.name}
                          </p>
                        </Link>
                        <div className="mt-2 mb-5 flex items-center justify-between">
                          <div className="prices flex flex-col">
                            {product.productDiscounts.length > 0 && (
                              <p className="text-lg text-gray-700 line-through font-semibold">
                                {product.price.toFixed(3)} TND
                              </p>
                            )}
                            <p className="text-2xl font-bold text-red-500 text-slate-900">
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
                          disabled={product.inventory <= 0}
                          className={`flex items-center transition-all ${product.inventory <= 0 ? "cursor-not-allowed" : "cursor-pointer"} justify-center rounded-md bg-secondaryColor px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-secondaryColor focus:outline-none gap-2 focus:ring-4 focus:ring-blue-300`}
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
                {comparisonList.map((product: any) => (
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
                {comparisonList.map((product: any) => (
                  <td
                    key={product.id}
                    className="px-6 py-4"
                    dangerouslySetInnerHTML={{ __html: product?.description }}
                  />
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-screen flex justify-center  item-center mt-5">
          <div className="border shadow-md bg-white  w-4/5 text-center md:mt-36 h-24 md:h-32  flex items-center gap-3 justify-center ">
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
