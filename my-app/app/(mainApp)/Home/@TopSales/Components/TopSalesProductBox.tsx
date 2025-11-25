"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import { FaBasketShopping } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
import { useBasketStore, useProductDetails, useProductsInBasketStore } from "@/app/store/zustand";
import { ADD_TO_BASKET_MUTATION } from "@/graphql/mutations";
import FavoriteProduct from "@/app/components/ProductCarousel/FavoriteProduct";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/app/hooks/useAuth";
import { trackAddToCart } from "@/utils/facebookEvents";

const TopSalesProductBox = ({ product, userData }: any) => {
  const { toast } = useToast();
  const { decodedToken, isAuthenticated } = useAuth();
  const [addToBasket] = useMutation(ADD_TO_BASKET_MUTATION);
  const toggleIsUpdated = useBasketStore((state) => state.toggleIsUpdated);
  const { openProductDetails } = useProductDetails();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { products, addProductToBasket, increaseProductInQtBasket } = useProductsInBasketStore();

  // Calculate product data
  const price = product.productDiscounts.length > 0 ? product.productDiscounts[0].newPrice : product.price;
  const formattedPrice = price.toFixed(3);
  const isDiscounted = product.productDiscounts.length > 0;
  const originalPrice = isDiscounted ? product.productDiscounts[0].price.toFixed(3) : null;
  const isOutOfStock = product.inventory <= 0;
  const discountPercentage = isDiscounted
    ? Math.round(((product.productDiscounts[0].price - product.productDiscounts[0].newPrice) / product.productDiscounts[0].price) * 100)
    : 0;

  const AddToBasket = async () => {
    if (isOutOfStock) return;

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

    // Add to basket
    if (isAuthenticated) {
      try {
        await addToBasket({
          variables: {
            input: {
              userId: decodedToken?.userId,
              quantity: 1,
              productId: product.id,
            },
          },
        });
      } catch (error) {
        console.error("Error adding to basket:", error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter le produit au panier",
          className: "bg-red-600 text-white",
        });
        return;
      }
    } else {
      const isProductAlreadyInBasket = products.some(p => p.id === product.id);

      if (isProductAlreadyInBasket) {
        increaseProductInQtBasket(product.id, 1);
      } else {
        addProductToBasket({
          ...product,
          price: product.price,
          discountedPrice: isDiscounted ? product.productDiscounts : null,
          actualQuantity: 1,
        });
      }
    }

    toggleIsUpdated();
    toast({
      title: "Notification de Panier",
      description: `Le produit "${product?.name}" a été ajouté au panier.`,
      className: "bg-primaryColor text-white",
    });
  };

  return (
    <article
      className={`flex font-medium text-gray-900 w-full relative group bg-white rounded-lg p-3 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 ${isHovered ? '-translate-y-1' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full flex gap-4 items-center">
        <div className="relative h-28 w-28 overflow-hidden rounded-md bg-gray-50 flex-shrink-0">
          {isDiscounted && (
            <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 z-20 rounded-br-md">
              -{discountPercentage}%
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Rupture de stock
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 z-10" />

          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "contain" }}
            className="transition-transform duration-500 group-hover:scale-110"
          />

          <div
            className={`absolute bottom-0 left-0 right-0 flex justify-center gap-2 p-1 z-20 transition-all duration-200 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          >
            <button
              type="button"
              className={`p-2 rounded-full shadow-md ${isOutOfStock
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-white text-gray-800 hover:bg-primaryColor hover:text-white"
                } transition-colors duration-200`}
              disabled={isOutOfStock}
              onClick={AddToBasket}
              aria-label="Ajouter au panier"
            >
              <FaBasketShopping size={16} />
            </button>
            <button
              className="p-2 bg-white text-gray-800 hover:bg-primaryColor hover:text-white rounded-full shadow-md transition-colors duration-200"
              onClick={() => openProductDetails(product)}
              aria-label="Aperçu rapide"
            >
              <FaRegEye size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-grow">
          <Link
            className="hover:text-primaryColor text-base font-medium transition-all cursor-pointer"
            title={product.name}
            href={`/products/${product.slug}`}
          >
            <h3 className="text-left line-clamp-2 leading-tight">{product.name}</h3>
          </Link>

          <div className="flex items-center mt-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-3 h-3 ${i < (product?.rating || 4) ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1 text-xs text-gray-500">
                ({product?.reviewCount || Math.floor(Math.random() * 50) + 5})
              </span>
            </div>
          </div>

          {!isDiscounted ? (
            <div className="font-bold text-lg tracking-wider text-primaryColor">
              <span>{formattedPrice} DT</span>
            </div>
          ) : (
            <div className="flex gap-2 tracking-wider items-center">
              <span className="text-primaryColor font-bold text-lg">
                {formattedPrice} DT
              </span>
              <span className="line-through text-gray-500 text-sm">
                {originalPrice} DT
              </span>
            </div>
          )}

          {/* Free shipping indicator */}
          {price >= 499 && (
            <div className="mt-1">
              <span className="text-green-600 text-xs font-medium flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Livraison gratuite
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="absolute right-3 top-3">
        <FavoriteProduct
          isFavorite={isFavorite}
          setIsFavorite={setIsFavorite}
          heartSize={20}
          heartColor={"gray"}
          productId={product?.id}
          productName={product?.name}
        />
      </div>
    </article>
  );
};

export default TopSalesProductBox;