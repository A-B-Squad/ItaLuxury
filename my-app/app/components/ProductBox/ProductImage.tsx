import Image from "next/image";
import Link from "next/link";
import { useState, useCallback, useMemo } from "react";
import QuickActionButton from "./components/QuickActionButton";
import { FaChevronDown, FaRegEye } from "react-icons/fa";
import { IoGitCompare } from "react-icons/io5";
import { FaBasketShopping } from "react-icons/fa6";
import FavoriteProductButton from "./FavoriteProductButton";
import {
  useProductComparisonStore,
  useProductDetails,
} from "@/app/store/zustand";
import { useToast } from "@/components/ui/use-toast";

interface ProductImageProps {
  product: Product;
  onAddToBasket: (product: Product, quantity: number) => void;
  view: number;
}

const ProductImage: React.FC<ProductImageProps> = ({
  product,
  onAddToBasket,
  view,
}) => {
  const { toast } = useToast();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const hasImages = useMemo(() => product.images.length > 0, [product.images]);
  const hasSecondImage = useMemo(
    () => product.images.length > 1,
    [product.images]
  );

  const { openProductDetails } = useProductDetails();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const { addToComparison, comparisonList } = useProductComparisonStore();

  const primaryImageUrl = useMemo(() => {
    if (!hasImages) return "";
    return product.images[0];
  }, [product.images, hasImages]);

  const secondaryImageUrl = useMemo(() => {
    if (!hasSecondImage) return "";
    return product.images[1];
  }, [product.images, hasSecondImage]);

  const onAddToCompare = useCallback(() => {
    const isProductAlreadyInCompare = comparisonList.some(
      (p: any) => p.id === product.id
    );
    if (!isProductAlreadyInCompare) {
      addToComparison(product);
    } else {
      toast({
        title: "Produit ajouté à la comparaison",
        description: `Le produit "${product?.name}" a été ajouté à la comparaison.`,
        className: "bg-primaryColor text-white",
      });
    }
  }, [product, comparisonList]);

  const handleImageLoad = useCallback(() => {
    setIsImageLoaded(true);
  }, []);

  const [showActions, setShowActions] = useState(false);

  const toggleActionButtons = useCallback(() => {
    setShowActions(prev => !prev);
  }, []);

  return (
    <div className={`overflow-hidden relative w-full group
      ${view === 1 ? 'max-w-[200px]' : ''}
    `}>
      {/* Toggle button for action buttons */}
      <button
        onClick={toggleActionButtons}
        className={`absolute ${product.productDiscounts.length > 0 && product.inventory !== 0
            ? "top-9"
            : "top-4"
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
        href={`/products/tunisie?productId=${product.id}`}
        className="block w-full"
      >
        {/*  aspect ratio container for professional look */}
        <div className={`
          relative w-full bg-gray-50 overflow-hidden rounded-t-lg
          ${view === 1
            ? 'h-32 sm:h-40'
            : 'aspect-square'
          }
        `}>
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gray-50 animate-pulse" />
          )}

          {hasImages && (
            <Image
              src={primaryImageUrl}
              alt={product.name}
              fill
              sizes={view === 1
                ? "(max-width: 640px) 128px, 160px"
                : "(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              }
              style={{
                objectFit: "cover",
                objectPosition: "center"
              }}
              quality={85}
              priority={true}
              onLoad={handleImageLoad}
              className={`
                transition-opacity duration-300 
                ${isImageLoaded ? 'opacity-100' : 'opacity-0'}
                ${view !== 1 ? 'group-hover:scale-105' : ''}
                transition-transform duration-500
              `}
            />
          )}

          {hasSecondImage && view !== 1 && (
            <Image
              src={secondaryImageUrl}
              alt={`${product.name} - hover`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              style={{
                objectFit: "cover",
                objectPosition: "center"
              }}
              quality={85}
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-105"
            />
          )}
        </div>
      </Link>

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

export default ProductImage;