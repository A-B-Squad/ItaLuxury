interface ProductImageProps {
  product: Product;
  onAddToBasket: (product: Product, quantity: number) => void;
  view: number;
  priority?: boolean;
}
import Image from "next/image";
import Link from "next/link";
import React, { useState, useCallback, useMemo } from "react";
import QuickActionButton from "./components/QuickActionButton";
import { FaChevronDown, FaRegEye, FaTag } from "react-icons/fa";
import { IoGitCompare } from "react-icons/io5";
import { FaBasketShopping } from "react-icons/fa6";
import FavoriteProductButton from "./FavoriteProductButton";
import {
  useProductComparisonStore,
  useProductDetails,
} from "@/app/store/zustand";
import { useToast } from "@/components/ui/use-toast";
import { hasActiveDiscount } from "@/utils/hasActiveDiscount";
import { getDiscountPercentage } from "@/utils/getDiscountPercentage";
import { getActiveDiscount } from "@/utils/getActiveDiscount";



interface ProductImageProps {
  product: Product;
  onAddToBasket: (product: Product, quantity: number) => void;
  view: number;
  priority?: boolean;
}

// Configuration constants
const IMAGE_CONFIG = {
  primaryQuality: 75,
  secondaryQuality: 70,
  listViewQuality: 70,
} as const;

const BLUR_DATA_URL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

const ProductImage: React.FC<ProductImageProps> = ({
  product,
  onAddToBasket,
  view,
  priority = false,
}) => {
  const { toast } = useToast();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const hasImages = useMemo(() => product.images.length > 0, [product.images]);
  const hasSecondImage = useMemo(
    () => product.images.length > 1,
    [product.images]
  );

  const { openProductDetails } = useProductDetails();
  const { addToComparison, comparisonList } = useProductComparisonStore();

  // Discount-related memoized values
  const isDiscounted = useMemo(
    () => hasActiveDiscount(product) && product.inventory !== 0,
    [product]
  );
  const discountPercent = useMemo(
    () => getDiscountPercentage(product),
    [product]
  );
  const activeDiscount = useMemo(
    () => getActiveDiscount(product),
    [product]
  );

  const primaryImageUrl = useMemo(() => {
    if (!hasImages) return "";
    return product.images[0];
  }, [product.images, hasImages]);

  const secondaryImageUrl = useMemo(() => {
    if (!hasSecondImage) return "";
    return product.images[1];
  }, [product.images, hasSecondImage]);

  // Optimized sizes based on view type
  const imageSizes = useMemo(() => {
    if (view === 1) {
      // List view - smaller images
      return "(max-width: 640px) 128px, 160px";
    }
    // Grid view - responsive breakpoints
    return "(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 300px";
  }, [view]);

  const onAddToCompare = useCallback(() => {
    const isProductAlreadyInCompare = comparisonList.some(
      (p: any) => p.id === product.id
    );
    if (!isProductAlreadyInCompare) {
      addToComparison(product);
      toast({
        title: "Produit ajouté à la comparaison",
        description: `Le produit "${product?.name}" a été ajouté à la comparaison.`,
        className: "bg-primaryColor text-white",
      });
    }
  }, [product, comparisonList, addToComparison, toast]);

  const handleImageLoad = useCallback(() => {
    setIsImageLoaded(true);
  }, []);

  const toggleActionButtons = useCallback(() => {
    setShowActions(prev => !prev);
  }, []);

  const productDetailsHref = useMemo(() => `/products/${product.slug}`, [product.slug]);

  return (
    <div className={`overflow-hidden relative w-full group
      ${view === 1 ? 'max-w-[200px]' : ''}
    `}>
      {/* Discount Badge - Top Left */}
      {isDiscounted && (
        <div className="absolute top-2 left-2 z-40 flex flex-col gap-1">
          <div className="bg-red-600 text-white px-2 py-1 rounded-md shadow-lg font-bold text-xs flex items-center gap-1">
            <FaTag className="w-3 h-3" />
            -{discountPercent}%
          </div>
          {activeDiscount?.campaignName && view !== 1 && (
            <div className="bg-orange-500 text-white px-2 py-1 rounded-md shadow-lg font-semibold text-xs whitespace-nowrap">
              {activeDiscount.campaignName}
            </div>
          )}
        </div>
      )}


      {/* Toggle button for action buttons */}
      <button
        onClick={toggleActionButtons}
        className={`absolute ${isDiscounted ? "top-9" : "top-4"
          } right-[18px] z-40 bg-white hover:bg-secondaryColor text-black rounded-full w-7 h-7 flex items-center justify-center transition-all duration-300 shadow-md`}
        aria-label="Toggle action buttons"
      >
        <FaChevronDown
          width={15}
          className={`transition-transform duration-300 ${showActions ? 'rotate-180' : ''
            }`}
        />
      </button>

      <Link
        href={productDetailsHref}
        className="block w-full"
      >
        {/* Aspect ratio container for professional look */}
        <div className={`
          relative w-full bg-gray-50 overflow-hidden rounded-t-lg
          ${view === 1
            ? 'h-32 sm:h-40'
            : 'aspect-square'
          }
        `}>
          {/* Loading placeholder */}
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
          )}

          {/* Primary Image */}
          {hasImages && (
            <Image
              src={primaryImageUrl}
              alt={product.name}
              fill
              sizes={imageSizes}
              style={{
                objectFit: "cover",
                objectPosition: "center"
              }}
              quality={view === 1 ? IMAGE_CONFIG.listViewQuality : IMAGE_CONFIG.primaryQuality}
              onLoad={handleImageLoad}
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              priority={priority}
              loading={priority ? "eager" : undefined}
              className={`
                transition-opacity duration-300 
                ${isImageLoaded ? 'opacity-100' : 'opacity-0'}
                ${view !== 1 ? 'group-hover:scale-105' : ''}
                transition-transform duration-500
              `}
            />
          )}

          {/* Secondary Image (hover effect) */}
          {hasSecondImage && view !== 1 && (
            <Image
              src={secondaryImageUrl}
              alt={`${product.name} - vue alternative`}
              fill
              sizes={imageSizes}
              style={{
                objectFit: "cover",
                objectPosition: "center"
              }}
              quality={IMAGE_CONFIG.secondaryQuality}
              loading="lazy"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-105"
            />
          )}
        </div>
      </Link>

      {/* Action Buttons */}
      <ul
        className={`plus_button absolute h-fit flex flex-col ${view === 1
          ? "right-0 top-2/4 -translate-y-2/4 flex-col"
          : "right-4 top-16"
          } items-center justify-center ${showActions || view === 1 ? 'opacity-100' : 'lg:opacity-0'
          } ${view === 1 || !showActions ? 'invisible' : 'visible'
          } z-30 gap-2 transition-all duration-300`}
      >
        <QuickActionButton
          icon={<FaRegEye color="black" className="text-xs md:text-base" />}
          onClick={() => openProductDetails(product)}
          title="aperçu rapide"
        />
        <QuickActionButton
          icon={
            <FaBasketShopping color="black" className="text-xs md:text-base" />
          }
          onClick={() => onAddToBasket(product, 1)}
          title="Ajouter au panier"
          disabled={product.inventory <= 0}
          isAddToCart={true}
        />
        <QuickActionButton
          icon={<IoGitCompare color="black" className="text-xs md:text-base" />}
          onClick={onAddToCompare}
          title="Ajouter au comparatif"
        />
        <FavoriteProductButton
          isFavorite={isFavorite}
          setIsFavorite={setIsFavorite}
          productId={product?.id}
          productName={product?.name}
        />
      </ul>
    </div>
  );
};

export default React.memo(ProductImage);