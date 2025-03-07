
"use client";
import {
  useBasketStore,
  useProductDetails,
  useProductsInBasketStore,
} from "@/app/store/zustand";
import { useToast } from "@/components/ui/use-toast";
import { ADD_TO_BASKET_MUTATION } from "@/graphql/mutations";
import { BASKET_QUERY, FETCH_USER_BY_ID } from "@/graphql/queries";
import triggerEvents from "@/utlils/trackEvents";
import { useMutation, useQuery } from "@apollo/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaPlus, FaRegHeart, FaHeart } from "react-icons/fa";
import { GoAlertFill } from "react-icons/go";
import { IoCloseOutline } from "react-icons/io5";
import { RiSubtractFill } from "react-icons/ri";
import { SlBasket } from "react-icons/sl";
import { sendGTMEvent } from "@next/third-parties/google";
import { useAuth } from "@/lib/auth/useAuth";
import CustomInnerZoom from "./CustomInnerZoom";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from 'react-dom';



const ProductQuickView = () => {
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
    // Set portal element to document body
    if (typeof window !== 'undefined') {
      setPortalElement(document.body);
    }
  }, []);

  const { data: basketData } = useQuery(BASKET_QUERY, {
    variables: { userId: decodedToken?.userId },
    skip: !isAuthenticated,
  });

  const { data: userData } = useQuery(FETCH_USER_BY_ID, {
    variables: {
      userId: decodedToken?.userId,
    },
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
        (item: any) => item.Product.id === productData?.id
      );
    }
    return storedProducts.find(
      (product: any) => product.id === productData?.id
    );
  }, [isAuthenticated, basketData, storedProducts]);

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

  const AddToBasket = async (product: any, quantity: number = 1) => {
    const price =
      product.productDiscounts.length > 0
        ? product.productDiscounts[0].newPrice
        : product.price;
    const addToCartData = {
      user_data: {
        em: [userData?.fetchUsersById.email.toLowerCase()],
        fn: [userData?.fetchUsersById.fullName],
        ph: [userData?.fetchUsersById?.number],
        country: ["tn"],
        external_id: userData?.fetchUsersById.id,
      },
      custom_data: {
        content_name: product.name,
        content_type: "product",
        content_ids: [product.id],
        value: price * quantity,
        currency: "TND",
      },
    };
    const cartEventData = {
      event: "add_to_cart",
      ecommerce: {
        currency: "TND",
        value: price * quantity,
        items: [{
          item_id: product.id,
          item_name: product.name,
          quantity: quantity,
          price: price
        }]
      },
      // User data for both events
      user_data: {
        em: [userData?.fetchUsersById.email.toLowerCase()],
        fn: [userData?.fetchUsersById.fullName],
        ph: [userData?.fetchUsersById?.number],
        country: ["tn"],
        external_id: userData?.fetchUsersById.id
      },
      // Facebook specific data
      facebook_data: {
        content_name: product.name,
        content_type: "product",
        content_ids: [product.id],
        value: price * quantity,
        currency: "TND"
      }
    };
    triggerEvents("AddToCart", addToCartData);
    sendGTMEvent(cartEventData);

    if (isAuthenticated) {
      try {
        const currentBasketQuantity = productsInBasket
          ? productsInBasket.quantity || productsInBasket.actualQuantity
          : 0;

        if (currentBasketQuantity + quantity > product.inventory) {
          toast({
            title: "Quantité non disponible",
            description: `Désolé, nous n'avons que ${product.inventory} unités en stock.`,
            className: "bg-red-600 text-white",
          });
          return;
        }

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
            toast({
              title: "Produit ajouté au panier",
              description: `${quantity} ${quantity > 1 ? "unités" : "unité"} de "${product?.name}" ${quantity > 1 ? "ont été ajoutées" : "a été ajoutée"} à votre panier.`,
              className: "bg-primaryColor text-white",
            });
          },
        });
      } catch (error) {
        console.error("Error adding to basket:", error);
        toast({
          title: "Erreur",
          description:
            "Une erreur s'est produite lors de l'ajout au panier. Veuillez réessayer.",
          className: "bg-red-600 text-white",
        });
      }
    } else {
      const isProductAlreadyInBasket = storedProducts.some(
        (p: any) => p.id === product?.id
      );
      const filteredProduct = storedProducts.find(
        (p: any) => p.id === product?.id
      );

      if (
        filteredProduct &&
        filteredProduct.actualQuantity + quantity > product.inventory
      ) {
        toast({
          title: "Quantité non disponible",
          description: `Désolé, nous n'avons que ${product.inventory} unités en stock.`,
          className: "bg-red-600 text-white",
        });
        return;
      }

      if (isProductAlreadyInBasket) {
        increaseProductInQtBasket(product.id, quantity);
      } else {
        addProductToBasket({
          ...product,
          price,
          actualQuantity: quantity,
        });
      }

      toast({
        title: "Produit ajouté au panier",
        description: `${quantity} ${quantity > 1 ? "unités" : "unité"} de "${product?.name}" ${quantity > 1 ? "ont été ajoutées" : "a été ajoutée"} à votre panier.`,
        className: "bg-green-600 text-white",
      });

    }
    toggleIsUpdated();
  };
  useEffect(() => {

    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", moveCursor);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, [productData]);

  if (!mounted || !isOpen || !portalElement) return null;

  // Use createPortal to render the modal directly to the body
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <div

            onClick={closeProductDetails}
            className="fixed cursor-none  z-[999999]  inset-0 transition-all bg-lightBlack h-screen w-screen"
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
              maxHeight: '90vh',
              width: '90%',
              maxWidth: '1200px',
              zIndex: 9999999,
              margin: 0
            }}
            className="overflow-y-auto pb-10 overflow-x-hidden bg-white rounded-lg shadow-2xl"
          >
            <div className="sticky top-0 z-50 bg-white p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Aperçu Rapide</h2>
              <button
                onClick={closeProductDetails}
                className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all duration-300"
              >
                <IoCloseOutline size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="details flex flex-col lg:flex-row gap-8">
                {/* Product Images Section */}
                <div className="lg:w-1/2 relative">
                  <div className="sticky top-24">
                    <CustomInnerZoom images={productData?.images} />
                    <span
                      className={`absolute top-2 right-2 p-2 rounded-md ${productData?.inventory > 1
                        ? "bg-green-600"
                        : productData?.inventory === 1
                          ? "bg-amber-500"
                          : "bg-red-500"
                        } text-xs font-medium text-white`}
                    >
                      {productData?.inventory > 1
                        ? "EN STOCK"
                        : productData?.inventory === 1
                          ? "DERNIER ARTICLE"
                          : "RUPTURE DE STOCK"}
                    </span>
                  </div>
                </div>

                {/* Product Info Section */}
                <div className="lg:w-1/2">
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
                      {productData?.name}
                    </h2>
                    <button
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      onClick={() => setIsInWishlist(!isInWishlist)}
                    >
                      {isInWishlist ? (
                        <FaHeart className="text-red-500" size={22} />
                      ) : (
                        <FaRegHeart className="text-gray-400 hover:text-gray-600" size={22} />
                      )}
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    Référence: <span className="font-medium">{productData?.reference}</span>
                  </p>

                  {/* Price Section */}
                  <div className="mt-6 mb-6">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-primaryColor">
                        {productData?.productDiscounts[0]
                          ? productData?.productDiscounts[0].newPrice.toFixed(3)
                          : productData?.price.toFixed(3)}
                      </span>
                      <span className="ml-1 text-xl font-semibold text-primaryColor">TND</span>
                      {!productData?.productDiscounts[0] && (
                        <span className="ml-2 text-sm text-gray-500">TTC</span>
                      )}
                    </div>

                    {productData?.productDiscounts[0] && (
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <p className="line-through text-gray-500">
                          {productData?.productDiscounts[0].price.toFixed(3)} TND
                        </p>
                        <span className="px-2 py-1 text-xs font-bold bg-red-100 text-red-700 rounded">
                          ÉCONOMISEZ {(
                            productData?.productDiscounts[0].price -
                            productData?.productDiscounts[0].newPrice
                          ).toFixed(3)}{" "}
                          TND
                        </span>
                        <span className="text-sm text-gray-500">TTC</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mt-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                    <div className="prose prose-sm max-w-none text-gray-600">
                      <div
                        dangerouslySetInnerHTML={{ __html: productData?.description }}
                      />
                    </div>
                  </div>

                  {/* Color */}
                  {productData?.Colors && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Couleur</h3>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm"
                          style={{ backgroundColor: productData?.Colors.Hex }}
                        />
                        <span className="text-sm text-gray-700">{productData?.Colors.name || "Couleur sélectionnée"}</span>
                      </div>
                    </div>
                  )}

                  {/* Quantity Selector */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Quantité</h3>
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 h-10 w-10 flex items-center justify-center rounded-l-md transition-colors"
                        disabled={quantity === 1}
                        onClick={handleDecreaseQuantity}
                      >
                        <RiSubtractFill size={18} />
                      </button>
                      <div className="h-10 w-14 flex items-center justify-center border-t border-b border-gray-300 bg-white">
                        <span className="font-medium">{quantity}</span>
                      </div>
                      <button
                        type="button"
                        className={`bg-gray-100 hover:bg-gray-200 text-gray-700 h-10 w-10 flex items-center justify-center rounded-r-md transition-colors ${quantity === productData?.inventory ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        disabled={quantity === productData?.inventory}
                        onClick={handleIncreaseQuantity}
                      >
                        <FaPlus size={14} />
                      </button>
                    </div>

                    {quantity === productData?.inventory && (
                      <div className="flex items-center mt-2 text-sm gap-2">
                        <GoAlertFill className="text-amber-500" size={16} />
                        <p className="text-amber-600">
                          La quantité maximale disponible est de {quantity} unités.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <div className="mt-8">
                    <button
                      disabled={productData?.inventory <= 0}
                      type="button"
                      onClick={() => AddToBasket(productData, quantity)}
                      className={`w-full py-3 px-6 flex items-center justify-center gap-2 rounded-md font-semibold text-white transition-all ${productData?.inventory <= 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primaryColor hover:bg-amber-200 hover:text-gray-800"
                        }`}
                    >
                      <SlBasket size={18} />
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
