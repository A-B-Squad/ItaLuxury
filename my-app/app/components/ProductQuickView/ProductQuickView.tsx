"use client";
import {
  useBasketStore,
  useProductDetails,
  useProductsInBasketStore,
} from "@/app/store/zustand";
import { useToast } from "@/components/ui/use-toast";
import { ADD_TO_BASKET_MUTATION } from "@/graphql/mutations";
import { BASKET_QUERY } from "@/graphql/queries";

import { useMutation, useQuery } from "@apollo/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaPlus, FaRegHeart, FaHeart } from "react-icons/fa";
import { GoAlertFill } from "react-icons/go";
import { IoCloseOutline } from "react-icons/io5";
import { RiSubtractFill } from "react-icons/ri";
import { SlBasket } from "react-icons/sl";
import { useAuth } from "@/app/hooks/useAuth";
import CustomInnerZoom from "./CustomInnerZoom";
import { AnimatePresence } from "framer-motion";
import { createPortal } from 'react-dom';
import { ProductData } from "@/app/types";
import { trackAddToCart } from "@/utils/facebookEvents";

// ==================== HELPER FUNCTIONS ====================

// Helper function to prepare tracking data
const prepareTrackingData = (product: any, userData: any, decodedToken: any) => {
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

  const user = userData ? {
    id: decodedToken?.userId,
    email: userData.email,
    firstName: userData.fullName?.split(' ')[0] || userData.fullName,
    lastName: userData.fullName?.split(' ').slice(1).join(' ') || '',
    phone: userData.number,
    country: "tn",
    city: userData.city || "",
  } : undefined;

  return { trackingProduct, user };
};

// Helper function to track add to cart event
const trackCartEvent = async (trackingProduct: any, user: any, product: any) => {
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
  }
};

// Helper function to check inventory
const checkInventoryAvailability = (
  currentQuantity: number,
  requestedQuantity: number,
  maxInventory: number,
  toast: any
): boolean => {
  if (currentQuantity + requestedQuantity > maxInventory) {
    toast({
      title: "Quantité non disponible",
      description: `Désolé, nous n'avons que ${maxInventory} unités en stock.`,
      className: "bg-red-600 text-white",
    });
    return false;
  }
  return true;
};

// Helper function to show success toast
const showSuccessToast = (quantity: number, productName: string, toast: any, isAuthenticated: boolean) => {
  const unit = quantity > 1 ? "unités" : "unité";
  const verb = quantity > 1 ? "ont été ajoutées" : "a été ajoutée";
  const bgColor = isAuthenticated ? "bg-primaryColor" : "bg-green-600";

  toast({
    title: "Produit ajouté au panier",
    description: `${quantity} ${unit} de "${productName}" ${verb} à votre panier.`,
    className: `${bgColor} text-white`,
  });
};

// Helper function to handle authenticated user basket
const handleAuthenticatedBasket = async (
  product: any,
  quantity: number,
  productsInBasket: any,
  addToBasket: any,
  decodedToken: any,
  toast: any
) => {
  const currentBasketQuantity = productsInBasket
    ? productsInBasket.quantity || productsInBasket.actualQuantity
    : 0;

  const hasInventory = checkInventoryAvailability(
    currentBasketQuantity,
    quantity,
    product.inventory,
    toast
  );

  if (!hasInventory) return;

  try {
    await addToBasket({
      variables: {
        input: {
          userId: decodedToken?.userId,
          quantity,
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
        showSuccessToast(quantity, product?.name, toast, true);
      },
    });
  } catch (error) {
    console.error("Error adding to basket:", error);
    toast({
      title: "Erreur",
      description: "Une erreur s'est produite lors de l'ajout au panier. Veuillez réessayer.",
      className: "bg-red-600 text-white",
    });
  }
};

// Helper function to handle guest user basket
const handleGuestBasket = (
  product: any,
  quantity: number,
  storedProducts: any[],
  addProductToBasket: any,
  increaseProductInQtBasket: any,
  toast: any
) => {
  const filteredProduct = storedProducts.find((p: any) => p.id === product?.id);

  if (filteredProduct) {
    const hasInventory = checkInventoryAvailability(
      filteredProduct.actualQuantity,
      quantity,
      product.inventory,
      toast
    );
    if (!hasInventory) return;

    increaseProductInQtBasket(product.id, quantity);
  } else {
    addProductToBasket({
      ...product,
      price: product.price,
      discountedPrice: product.productDiscounts.length > 0 ? product.productDiscounts : null,
      actualQuantity: quantity,
    });
  }

  showSuccessToast(quantity, product?.name, toast, false);
};

// ==================== MAIN COMPONENT ====================

const ProductQuickView = ({ userData }: any) => {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  const [addToBasket] = useMutation(ADD_TO_BASKET_MUTATION);
  const { isOpen, productData, closeProductDetails } = useProductDetails();
  const { decodedToken, isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState<number>(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setPortalElement(document.body);
    }
  }, []);

  const { data: basketData } = useQuery(BASKET_QUERY, {
    variables: { userId: decodedToken?.userId },
    skip: !isAuthenticated,
  });

  const {
    products: storedProducts,
    addProductToBasket,
    increaseProductInQtBasket,
  } = useProductsInBasketStore();

  const toggleIsUpdated = useBasketStore((state) => state.toggleIsUpdated);

  const productsInBasket = useMemo(() => {
    if (isAuthenticated && basketData?.basketByUserId) {
      return basketData.basketByUserId.find(
        (item: ProductData) => item.Product.id === productData?.id
      );
    }
    return storedProducts.find(
      (product: ProductData) => product.id === productData?.id
    );
  }, [isAuthenticated, basketData, storedProducts, productData?.id]);

  const handleIncreaseQuantity = useCallback(() => {
    if (quantity < productData?.inventory) {
      setQuantity((prev) => prev + 1);
    }
  }, [quantity, productData?.inventory]);

  const handleDecreaseQuantity = useCallback(() => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  }, [quantity]);

  // ==================== REFACTORED ADD TO BASKET ====================
  const AddToBasket = async (product: any, quantity: number = 1) => {
    // Prepare and track
    const { trackingProduct, user } = prepareTrackingData(product, userData, decodedToken);
    await trackCartEvent(trackingProduct, user, product);

    // Handle basket addition based on authentication
    if (isAuthenticated) {
      await handleAuthenticatedBasket(
        product,
        quantity,
        productsInBasket,
        addToBasket,
        decodedToken,
        toast
      );
    } else {
      handleGuestBasket(
        product,
        quantity,
        storedProducts,
        addProductToBasket,
        increaseProductInQtBasket,
        toast
      );
    }

    toggleIsUpdated();
  };

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    globalThis.addEventListener("mousemove", moveCursor);
    return () => {
      globalThis.removeEventListener("mousemove", moveCursor);
    };
  }, [productData]);

  if (!mounted || !isOpen || !portalElement) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            onClick={closeProductDetails}
            className="fixed cursor-none z-[999999] inset-0 transition-all bg-lightBlack h-screen w-screen"
          >
            <IoCloseOutline
              size={40}
              className="animate-pulse invisible lg:visible fixed"
              style={{ top: position.y, left: position.x }}
            />
          </div>

          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              maxHeight: '95vh',
              width: '95%',
              maxWidth: '1200px',
              zIndex: 9999999,
              margin: 0
            }}
            className="overflow-y-auto overflow-x-hidden bg-white rounded-lg md:rounded-xl shadow-2xl"
          >
            {/* Header - Sticky */}
            <div className="sticky top-0 z-50 bg-white px-3 py-2 md:p-4 border-b flex justify-between items-center">
              <h2 className="text-base md:text-xl font-bold text-gray-800">Aperçu Rapide</h2>
              <button
                onClick={closeProductDetails}
                className="bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 md:p-2 transition-all duration-300"
              >
                <IoCloseOutline size={20} className="md:w-6 md:h-6" />
              </button>
            </div>

            <div className="p-3 md:p-6">
              <div className="details flex flex-col lg:flex-row gap-4 md:gap-8">
                {/* Product Images Section */}
                <div className="lg:w-1/2 relative">
                  <div className="lg:sticky lg:top-24">
                    <CustomInnerZoom images={productData?.images} />
                    <span
                      className={`absolute top-2 right-2 px-2 py-1 rounded text-[10px] md:text-xs font-medium text-white ${productData?.inventory > 1
                        ? "bg-green-600"
                        : productData?.inventory === 1
                          ? "bg-amber-500"
                          : "bg-red-500"
                        }`}
                    >
                      {productData?.inventory > 1
                        ? "EN STOCK"
                        : productData?.inventory === 1
                          ? "DERNIER"
                          : "RUPTURE"}
                    </span>
                  </div>
                </div>

                {/* Product Info Section */}
                <div className="lg:w-1/2">
                  <div className="flex justify-between items-start gap-2">
                    <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-800 tracking-tight line-clamp-3">
                      {productData?.name}
                    </h2>
                    <button
                      className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                      onClick={() => setIsInWishlist(!isInWishlist)}
                    >
                      {isInWishlist ? (
                        <FaHeart className="text-red-500" size={18} />
                      ) : (
                        <FaRegHeart className="text-gray-400 hover:text-gray-600" size={18} />
                      )}
                    </button>
                  </div>

                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    Réf: <span className="font-medium">{productData?.reference}</span>
                  </p>

                  {/* Price Section */}
                  <div className="mt-3 md:mt-6 mb-3 md:mb-6">
                    <div className="flex items-baseline">
                      <span className="text-2xl md:text-3xl font-bold text-primaryColor">
                        {productData?.productDiscounts[0]
                          ? productData?.productDiscounts[0].newPrice.toFixed(3)
                          : productData?.price.toFixed(3)}
                      </span>
                      <span className="ml-1 text-lg md:text-xl font-semibold text-primaryColor">TND</span>
                      {!productData?.productDiscounts[0] && (
                        <span className="ml-2 text-xs md:text-sm text-gray-500">TTC</span>
                      )}
                    </div>

                    {productData?.productDiscounts[0] && (
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <p className="line-through text-gray-500 text-sm md:text-base">
                          {productData?.productDiscounts[0].price.toFixed(3)} TND
                        </p>
                        <span className="px-2 py-0.5 text-[10px] md:text-xs font-bold bg-red-100 text-red-700 rounded">
                          -{(
                            productData?.productDiscounts[0].price -
                            productData?.productDiscounts[0].newPrice
                          ).toFixed(3)} TND
                        </span>
                        <span className="text-xs md:text-sm text-gray-500">TTC</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mt-3 md:mt-6 mb-3 md:mb-6">
                    <h3 className="text-sm md:text-lg font-semibold text-gray-800 mb-1 md:mb-2">Description</h3>
                    <div className="prose prose-sm max-w-none text-gray-600 text-xs md:text-sm line-clamp-4 md:line-clamp-none">
                      <div
                        dangerouslySetInnerHTML={{ __html: productData?.description }}
                      />
                    </div>
                  </div>

                  {/* Color */}
                  {productData?.Colors && (
                    <div className="mt-3 md:mt-6">
                      <h3 className="text-sm md:text-lg font-semibold text-gray-800 mb-1 md:mb-2">Couleur</h3>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-gray-300 shadow-sm"
                          style={{ backgroundColor: productData?.Colors.Hex }}
                        />
                        <span className="text-xs md:text-sm text-gray-700">{productData?.Colors.name || "Couleur sélectionnée"}</span>
                      </div>
                    </div>
                  )}

                  {/* Quantity Selector */}
                  <div className="mt-4 md:mt-8">
                    <h3 className="text-sm md:text-lg font-semibold text-gray-800 mb-2 md:mb-3">Quantité</h3>
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded-l-md transition-colors"
                        disabled={quantity === 1}
                        onClick={handleDecreaseQuantity}
                      >
                        <RiSubtractFill size={16} className="md:w-[18px] md:h-[18px]" />
                      </button>
                      <div className="h-9 w-12 md:h-10 md:w-14 flex items-center justify-center border-t border-b border-gray-300 bg-white">
                        <span className="font-medium text-sm md:text-base">{quantity}</span>
                      </div>
                      <button
                        type="button"
                        className={`bg-gray-100 hover:bg-gray-200 text-gray-700 h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded-r-md transition-colors ${quantity === productData?.inventory ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        disabled={quantity === productData?.inventory}
                        onClick={handleIncreaseQuantity}
                      >
                        <FaPlus size={12} className="md:w-[14px] md:h-[14px]" />
                      </button>
                    </div>

                    {quantity === productData?.inventory && (
                      <div className="flex items-center mt-2 text-xs md:text-sm gap-1 md:gap-2">
                        <GoAlertFill className="text-amber-500 flex-shrink-0" size={14} />
                        <p className="text-amber-600">
                          Max {quantity} unités disponibles
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <div className="mt-4 md:mt-8">
                    <button
                      disabled={productData?.inventory <= 0}
                      type="button"
                      onClick={() => AddToBasket(productData, quantity)}
                      className={`w-full py-2.5 md:py-3 px-4 md:px-6 flex items-center justify-center gap-2 rounded-md font-semibold text-white text-sm md:text-base transition-all ${productData?.inventory <= 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primaryColor hover:bg-amber-200 hover:text-gray-800"
                        }`}
                    >
                      <SlBasket size={16} className="md:w-[18px] md:h-[18px]" />
                      {productData?.inventory <= 0 ? "Indisponible" : "Ajouter au panier"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>,
    portalElement
  );
};

export default ProductQuickView;