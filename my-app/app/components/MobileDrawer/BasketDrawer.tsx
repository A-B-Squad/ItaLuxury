"use client";
import {
  useBasketStore,
  useCheckoutStore,
  useDrawerBasketStore,
  useProductsInBasketStore,
} from "@/app/store/zustand";
import { useToast } from "@/components/ui/use-toast";
import { DECREASE_QUANTITY_MUTATION, DELETE_PRODUCT_FROM_BASKET_BY_ID_MUTATION, INCREASE_QUANTITY_MUTATION } from "@/graphql/mutations";
import { BASKET_QUERY } from "@/graphql/queries";
import { useAuth } from "@/app/hooks/useAuth";
import { useMutation, useQuery } from "@apollo/client";
import { Drawer, IconButton, Typography } from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CiTrash } from "react-icons/ci";
import { HiPlus } from "react-icons/hi2";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import { RiSubtractLine } from "react-icons/ri";
import { FaArrowRight } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { motion } from "framer-motion";
import { trackRemoveFromCart, trackViewCart } from "@/utils/facebookEvents";



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

const BasketDrawer = ({ userData }: any) => {
  const { toast } = useToast();
  const { setCheckoutProducts, setCheckoutTotal } = useCheckoutStore();
  const { isOpen, closeBasketDrawer } = useDrawerBasketStore();
  const { decodedToken, isAuthenticated } = useAuth();
  const {
    products: storedProducts,
    removeProductFromBasket,
    setQuantityInBasket,
    increaseProductInQtBasket,
    decreaseProductInQtBasket,
  } = useProductsInBasketStore();
  const { isUpdated } = useBasketStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

  // Fetch basket data from server
  const { data: fetchedProductInBasket, refetch } = useQuery(BASKET_QUERY, {
    variables: { userId: decodedToken?.userId },
    skip: !isAuthenticated,
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de charger le panier. Veuillez réessayer.",
        className: "bg-red-500 text-white",
      });
    }
  });

  // Mutations
  const [deleteBasketById] = useMutation(DELETE_PRODUCT_FROM_BASKET_BY_ID_MUTATION);
  const [increaseQuantity] = useMutation(INCREASE_QUANTITY_MUTATION);
  const [decreaseQuantity] = useMutation(DECREASE_QUANTITY_MUTATION);

  // Compute products in basket (server or local)
  const productsInBasket = useMemo(() => {
    if (decodedToken?.userId && fetchedProductInBasket?.basketByUserId) {
      return fetchedProductInBasket.basketByUserId.map((basket: any) => ({
        ...basket.Product,
        actualQuantity: basket.quantity,
        basketId: basket.id,
      }));
    }
    return storedProducts;
  }, [decodedToken, fetchedProductInBasket, storedProducts]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    return productsInBasket.reduce((acc: number, curr: Product) => {
      const price = curr.productDiscounts?.length
        ? curr.productDiscounts[0].newPrice
        : curr.price;
      return acc + price * curr.actualQuantity;
    }, 0);
  }, [productsInBasket]);

  // ========== TRACK ViewCart ON PAGE LOAD ==========
  useEffect(() => {
    // Only track if we have products
    if (!productsInBasket || productsInBasket.length === 0) return;

    // Prepare complete cart items for tracking with ALL required fields
    const cartItems = productsInBasket.map((product: Product) => {
      // Get the actual price (with discount if available)
      const productPrice = product.productDiscounts?.length > 0
        ? product.productDiscounts[0].newPrice
        : product.price;

      const quantity = product.quantity || product.actualQuantity || 0;

      return {
        // Required fields from CartItem interface
        id: product.id,
        name: product.name,
        slug: product.slug || `product-${product.id}`, // Fallback if slug missing
        price: Number(productPrice),
        quantity: quantity,

        // Other required fields with fallbacks
        isVisible: product.isVisible !== undefined ? product.isVisible : true,
        reference: product.reference || product.id,
        description: product.description || product.name,
        inventory: product.inventory || 0,
        images: product.images || [],
        categories: product.categories || [],
        productDiscounts: product.productDiscounts || [],

        // Optional fields
        Brand: product.Brand || { name: 'ita-luxury' },
        Colors: product.Colors || null,
        technicalDetails: product.technicalDetails,
        reviews: product.reviews || [],
        GroupProductVariant: product.GroupProductVariant,
        solde: product.solde,
      };
    });

    // Prepare user data
    const user = userData ? {
      id: userData.id,
      email: userData.email,
      phone: userData.number,
      firstName: userData.fullName?.split(' ')[0] || userData.fullName,
      lastName: userData.fullName?.split(' ').slice(1).join(' ') || '',
      city: userData.city || "",
      country: "tn",
    } : undefined;

    console.log('🛒 ViewCart - Tracking data:', {
      product_count: cartItems.length,
      total_value: totalPrice,
      user: user ? 'logged_in' : 'guest',
      items: cartItems.map((item: { id: any; name: any; quantity: any; price: any; }) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    });

    // Track ViewCart event
    trackViewCart(cartItems, Number(totalPrice), user)
      .then(() => {
        console.log("✅ ViewCart tracked successfully");
      })
      .catch(error => {
        console.error("❌ Error tracking ViewCart:", error);
      });

  }, [productsInBasket, totalPrice, userData]);

  // ========== TRACK RemoveFromCart ==========
  const handleRemoveProduct = useCallback(
    async (productId: string, basketId?: string) => {
      setLoadingProductId(productId);

      // Find the product being removed
      const removedProduct = productsInBasket.find(
        (p: Product) => p.id === productId || p.basketId === basketId
      );

      try {
        if (removedProduct) {
          // Prepare complete product data for tracking with fallbacks
          const productToTrack = {
            id: removedProduct.id,
            name: removedProduct.name,
            slug: removedProduct.slug || `product-${removedProduct.id}`,
            price: Number(removedProduct.price) || 0,
            quantity: removedProduct.quantity || removedProduct.actualQuantity || 1,
            description: removedProduct.description || removedProduct.name,
            Brand: removedProduct.Brand || { name: 'ita-luxury' },
            Colors: removedProduct.Colors || null,
            categories: removedProduct.categories || [],
            productDiscounts: removedProduct.productDiscounts || [],
            inventory: removedProduct.inventory || 0,
            isVisible: removedProduct.isVisible !== undefined ? removedProduct.isVisible : true,
            reference: removedProduct.reference || removedProduct.id,
            images: removedProduct.images || [],
          };

          console.log('🗑️ RemoveFromCart - Preparing to track:', {
            product_id: productToTrack.id,
            product_name: productToTrack.name,
            quantity: productToTrack.quantity,
            price: productToTrack.price
          });

          // Prepare user data with better name handling
          const user = userData ? {
            id: userData.id,
            email: userData.email,
            phone: userData.number,
            firstName: userData.fullName?.split(' ')[0] || userData.fullName,
            lastName: userData.fullName?.split(' ').slice(1).join(' ') || '',
            city: userData.city || "",
            country: "tn",
          } : undefined;

          // Track RemoveFromCart event (non-blocking)
          trackRemoveFromCart(productToTrack, user)
            .then(() => {
              console.log("✅ RemoveFromCart tracked successfully");
            })
            .catch(trackingError => {
              console.error("❌ Error tracking RemoveFromCart:", trackingError);
              // Don't show error to user - tracking failure shouldn't affect UX
            });
        } else {
          console.warn('⚠️ Product not found for removal tracking:', { productId, basketId });
        }

        // Remove from database or store
        if (decodedToken?.userId && basketId) {
          await deleteBasketById({
            variables: { basketId, productId }
          });
          refetch(); // Refresh the basket data

          console.log('🗑️ Product removed from database:', { productId, basketId });
        } else {
          removeProductFromBasket(productId);
          console.log('🗑️ Product removed from local storage:', { productId });
        }

        // Show success message
        toast({
          title: "Produit retiré",
          description: "Le produit a été retiré de votre panier",
          className: "bg-green-500 text-white",
        });

      } catch (error) {
        console.error("❌ Failed to remove product:", error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le produit. Veuillez réessayer.",
          className: "bg-red-500 text-white",
        });
      } finally {
        setLoadingProductId(null);
      }
    },
    [productsInBasket, userData, decodedToken, deleteBasketById, removeProductFromBasket, refetch, toast]
  );
  // Handle increasing quantity
  const handleIncreaseQuantity = useCallback(
    async (productId: string, basketId?: string) => {
      setLoadingProductId(productId);

      try {
        if (decodedToken?.userId && basketId) {
          await increaseQuantity({
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
          refetch();
        } else {
          increaseProductInQtBasket(productId, 1);
        }
      } finally {
        setLoadingProductId(null);
      }
    },
    [decodedToken, increaseQuantity, increaseProductInQtBasket, toast]
  );

  // Handle decreasing quantity
  const handleDecreaseQuantity = useCallback(
    async (productId: string, basketId?: string) => {
      setLoadingProductId(productId);

      try {
        if (decodedToken?.userId && basketId) {
          await decreaseQuantity({
            variables: { basketId },
          });
          refetch();
        } else {
          decreaseProductInQtBasket(productId);
        }
      } finally {
        setLoadingProductId(null);
      }
    },
    [decodedToken, decreaseQuantity, decreaseProductInQtBasket]
  );

  // ========== TRACK InitiateCheckout ==========
  const handleCheckout = useCallback(async () => {
    setIsLoading(true);

    try {
      // Set checkout data
      setCheckoutProducts(productsInBasket);
      setCheckoutTotal(Number(totalPrice));
      closeBasketDrawer();
    } finally {
      setIsLoading(false);
    }
  }, [productsInBasket, totalPrice, userData, closeBasketDrawer, setCheckoutProducts, setCheckoutTotal]);

  // Render product list
  const renderProductList = () => (
    <ul role="list" className="divide-y divide-gray-200">
      {productsInBasket.map((product: Product, index: number) => (
        <motion.li
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="flex py-4 relative"
          key={product.id || index}
        >
          {loadingProductId === product.id && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-lg">
              <div className="w-5 h-5 border-2 border-primaryColor border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <Link
            href={`/products/${product.slug}`}
            onClick={closeBasketDrawer}
            className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-50 group"
          >
            <Image
              fill={true}
              style={{ objectFit: "contain" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              src={
                (product.images &&
                  product.images.length > 0 &&
                  product.images[0]) ||
                "https://res.cloudinary.com/dc1cdbirz/image/upload/v1732014003/ita-luxury/zdiptq7s9m9ck13ljnvy.jpg"
              }
              alt={product.name}
              className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          <div className="ml-4 flex flex-1 flex-col">
            <div className="flex justify-between">
              <div className="flex-1 pr-2">
                <Link
                  className="text-sm font-medium text-gray-900 hover:text-primaryColor transition-colors line-clamp-2"
                  href={`/products/${product.slug}`}
                  onClick={closeBasketDrawer}
                >
                  {product.name}
                </Link>

                <div className="mt-1 flex items-center">
                  <p className="text-sm text-gray-500">
                    {product.categories && product.categories.length > 0
                      ? product.categories[0]?.name
                      : "Catégorie"}
                  </p>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2 border rounded-lg overflow-hidden">
                    <button
                      type="button"
                      className={`p-1.5 text-white ${(product.quantity || product.actualQuantity) <= 1
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-primaryColor hover:bg-amber-200"
                        } transition-colors`}
                      onClick={() => handleDecreaseQuantity(product.id, product.basketId)}
                      disabled={(product.quantity || product.actualQuantity) <= 1 || loadingProductId === product.id}
                      aria-label="Diminuer la quantité"
                    >
                      <RiSubtractLine size={16} />
                    </button>

                    <span className="px-3 py-1 font-medium text-gray-700 text-sm">
                      {product.actualQuantity || product.quantity}
                    </span>

                    <button
                      type="button"
                      className={`p-1.5 text-white ${product.actualQuantity >= product?.inventory
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-primaryColor hover:bg-amber-200"
                        } transition-colors`}
                      onClick={() => handleIncreaseQuantity(product.id, product.basketId)}
                      disabled={product.actualQuantity >= product?.inventory || loadingProductId === product.id}
                      aria-label="Augmenter la quantité"
                    >
                      <HiPlus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {product.productDiscounts?.length > 0 ? (
                      <>
                        <span className="font-bold text-primaryColor">
                          {(product.productDiscounts[0].newPrice || 0).toFixed(3)} TND
                        </span>
                        <span className="ml-2 text-xs text-gray-400 line-through">
                          {(product.price || 0).toFixed(3)} TND
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-primaryColor">
                        {(product.price || 0).toFixed(3)} TND
                      </span>
                    )}
                  </p>

                  <button
                    type="button"
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    onClick={() => handleRemoveProduct(product.id, product.basketId)}
                    disabled={loadingProductId === product.id}
                    aria-label="Supprimer du panier"
                  >
                    <CiTrash size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.li>
      ))}
    </ul>
  );

  // Render empty basket state
  const renderEmptyBasket = () => (
    <div className="flex flex-col justify-center items-center h-[70vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <MdOutlineRemoveShoppingCart className="text-gray-300 mb-4" size={100} />
        <h2 className="text-xl font-medium text-gray-700 mb-2">Votre panier est vide</h2>
        <p className="text-gray-500 text-center mb-8">
          Ajoutez des produits à votre panier pour commencer vos achats
        </p>
        <Link
          href="/Collections?page=1"
          onClick={closeBasketDrawer}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primaryColor hover:bg-amber-200 transition-colors duration-200"
        >
          Découvrir nos produits
        </Link>
      </motion.div>
    </div>
  );

  return (
    <Drawer
      placement="right"
      open={isOpen}
      onClose={closeBasketDrawer}
      overlay={true}
      className="p-4 h-full z-[999991]"
      size={400}
      overlayProps={{ className: "fixed inset-0 bg-black/50 z-[9998]" }}
      placeholder={""}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
      onResize={undefined}
      onResizeCapture={undefined}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between pb-4 border-b">
          <Typography
            variant="h5"
            className="font-medium text-gray-900"
            placeholder={""}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
          >
            Mon Panier ({productsInBasket.length})
          </Typography>
          <IconButton
            variant="text"
            color="gray"
            onClick={closeBasketDrawer}
            className="rounded-full hover:bg-gray-100"
            placeholder={""}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
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
          <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto py-4 pr-1 custom-scrollbar">
              {renderProductList()}
            </div>

            <div className="mt-auto border-t border-gray-200 pt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-base">
                  <p className="text-gray-500">Sous-total</p>
                  <p className="font-medium text-gray-900">{totalPrice.toFixed(3)} TND</p>
                </div>

                <p className="text-sm text-gray-500">
                  Frais de livraison calculés à la caisse
                </p>

                <div className="space-y-2">
                  <button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-primaryColor hover:bg-amber-200 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Link
                        href={"/Checkout"}
                        className="flex items-center gap-2"
                      >
                        Procéder au paiement
                        <FaArrowRight size={14} />
                      </Link>
                    )}
                  </button>

                  <Link
                    href="/Basket"
                    onClick={closeBasketDrawer}
                    className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                  >
                    <IoMdCart size={18} />
                    Voir le panier
                  </Link>
                </div>

                <div className="text-center">
                  <button
                    onClick={closeBasketDrawer}
                    className="text-primaryColor hover:text-amber-200 text-sm font-medium transition-colors"
                  >
                    Continuer mes achats
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          renderEmptyBasket()
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </Drawer>
  );
};

export default BasketDrawer;
