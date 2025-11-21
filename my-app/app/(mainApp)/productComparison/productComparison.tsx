"use client";
import { useMutation } from "@apollo/client";
import React, { useCallback } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import { MdCompareArrows } from "react-icons/md";
import { ADD_TO_BASKET_MUTATION } from "@/graphql/mutations";
import Image from "next/image";

import {
  useBasketStore,
  useProductComparisonStore,
  useDrawerBasketStore,
  useProductsInBasketStore,
} from "@/app/store/zustand";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { BASKET_QUERY } from "../../../graphql/queries";
import { useAuth } from "@/app/hooks/useAuth";
import { trackAddToCart } from "@/utils/facebookEvents";

const ProductComparison = ({ userData }: any) => {
  const { comparisonList, removeFromComparison } = useProductComparisonStore();
  const { openBasketDrawer } = useDrawerBasketStore();
  const { toast } = useToast();
  const { decodedToken, isAuthenticated } = useAuth();

  const [addToBasket, { loading: addingToBasket }] = useMutation(ADD_TO_BASKET_MUTATION);


  const toggleIsUpdated = useBasketStore((state) => state.toggleIsUpdated);
  const { addProductToBasket, increaseProductInQtBasket } = useProductsInBasketStore();

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

  const AddToBasket = async (product: any) => {


    // Prepare complete product data for tracking
    const trackingProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      description: product.description,
      Brand: product.Brand,
      Colors: product.Colors,
      categories: product.categories,
      productDiscounts: product.productDiscounts,
      inventory: product.inventory,
      isVisible: product.isVisible,
      reference: product.reference,
      images: product.images,
      quantity: product.actualQuantity || product.quantity,
      technicalDetails: product.technicalDetails,
    };

    // Prepare user data
    const user = userData ? {
      id: decodedToken?.userId,
      email: userData.email,
      firstName: userData.fullName?.split(' ')[0] || userData.fullName,
      lastName: userData.fullName?.split(' ').slice(1).join(' ') || '',
      phone: userData.number,
      country: "tn",
      city: userData.city || "",
    } : undefined;

    // Track the add to cart event with error handling
    try {
      console.log('🛒 Tracking AddToCart event:', {
        product_id: trackingProduct.id,
        product_name: trackingProduct.name,
        quantity: product.actualQuantity || product.quantity,
        user: user ? 'logged_in' : 'guest'
      });

      await trackAddToCart(trackingProduct, user);

      console.log('✅ AddToCart event tracked successfully');
    } catch (error) {
      console.error("❌ Error tracking add to cart:", error);
      // Don't block the user flow if tracking fails
    }
    // Add to basket based on authentication status
    if (isAuthenticated) {
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
      // Handle local storage basket for non-authenticated users
      const isProductAlreadyInBasket = comparisonList.some(
        (p: any) => p.id === product?.id
      );

      if (!isProductAlreadyInBasket) {
        addProductToBasket({
          ...product,
          price: product.price,
          discountedPrice: product.productDiscounts.length > 0 ? product.productDiscounts : null,
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
          description: `Ce produit est déjà dans votre panier. La quantité a été augmentée.`,
          className: "bg-primaryColor text-white",
        });
      }
    }

    toggleIsUpdated();
    openBasketDrawer();
  };



  if (comparisonList.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <MdCompareArrows className="text-gray-300" size={30} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Aucun produit à comparer</h2>
              <p className="text-gray-600">
                Ajoutez des produits à comparer pour voir leurs caractéristiques côte à côte.
              </p>
              <Link
                href="/Collections/tunisie?page=1"
                className="mt-2 px-6 py-2 bg-primaryColor text-white rounded-md hover:bg-opacity-90 transition-all"
              >
                Découvrir nos produits
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <MdCompareArrows className="text-primaryColor" />
          Comparaison de Produits ({comparisonList.length})
        </h1>
      </header>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 font-semibold text-gray-700 w-40">Produit</th>
              {comparisonList.map((product: any) => (
                <th key={`header-${product.id}`} className="px-4 py-4 min-w-[300px]">
                  <div className="relative flex flex-col items-center bg-white rounded-lg border border-gray-200 p-4">
                    <button
                      onClick={() => removeProduct(product)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
                      aria-label="Supprimer de la comparaison"
                    >
                      <FaRegTrashAlt size={16} />
                    </button>

                    <Link
                      className="relative mb-3 flex h-40 w-full overflow-hidden rounded-lg"
                      href={`/products/${product.slug}`}
                    >
                      <Image
                        className="object-contain w-full h-full"
                        src={product.images[0]}
                        alt={product.name}
                        width={40}
                        height={40}
                      />
                    </Link>

                    <h3 className="text-base font-medium text-gray-800 text-center mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    <div className="flex flex-col items-center mb-3">
                      {product.productDiscounts.length > 0 && (
                        <p className="text-sm text-gray-500 line-through">
                          {product.price.toFixed(3)} TND
                        </p>
                      )}
                      <p className="text-lg font-bold text-red-500">
                        {product.productDiscounts.length > 0
                          ? product.productDiscounts[0].newPrice.toFixed(3)
                          : product.price.toFixed(3)} TND
                      </p>
                    </div>

                    <button
                      disabled={product.inventory <= 0 || addingToBasket}
                      className={`w-full flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-all ${product.inventory <= 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-secondaryColor hover:bg-opacity-90 cursor-pointer"
                        }`}
                      onClick={() => AddToBasket(product)}
                    >
                      <RiShoppingCartLine className="mr-2" />
                      {product.inventory <= 0 ? "Indisponible" : "Ajouter au panier"}
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr className="border-t">
              <th className="px-6 py-4 font-semibold text-gray-700 bg-gray-50">Prix</th>
              {comparisonList.map((product: any) => (
                <td key={`price-${product.id}`} className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center">
                    {product.productDiscounts.length > 0 && (
                      <span className="text-sm text-gray-500 line-through">
                        {product.price.toFixed(3)} TND
                      </span>
                    )}
                    <span className="font-semibold text-red-500">
                      {product.productDiscounts.length > 0
                        ? product.productDiscounts[0].newPrice.toFixed(3)
                        : product.price.toFixed(3)} TND
                    </span>
                  </div>
                </td>
              ))}
            </tr>

            <tr className="border-t">
              <th className="px-6 py-4 font-semibold text-gray-700 bg-gray-50">Description</th>
              {comparisonList.map((product: any) => (
                <td
                  key={`desc-${product.id}`}
                  className="px-6 py-4"
                >
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: product?.description }}
                  />
                </td>
              ))}
            </tr>

            {/* You can add more comparison rows here as needed */}
            <tr className="border-t">
              <th className="px-6 py-4 font-semibold text-gray-700 bg-gray-50">Disponibilité</th>
              {comparisonList.map((product: any) => (
                <td key={`stock-${product.id}`} className="px-6 py-4 text-center">
                  {product.inventory > 0 ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      En stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Rupture de stock
                    </span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductComparison;
