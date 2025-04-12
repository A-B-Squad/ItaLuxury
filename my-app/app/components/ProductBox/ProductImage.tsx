import prepRoute from "@/app/Helpers/_prepRoute";
import Image from "next/legacy/image";
import Link from "next/link";
import React, { useCallback, useMemo, useState } from "react";
import QuickActionButton from "./components/QuickActionButton";
import { FaRegEye } from "react-icons/fa";
import { IoGitCompare } from "react-icons/io5";
import { FaBasketShopping } from "react-icons/fa6";
import FavoriteProductButton from "./FavoriteProductButton";
import {
  useProductComparisonStore,
  useProductDetails,
} from "@/app/store/zustand";
import { useToast } from "@/components/ui/use-toast";
import { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  userId: string;
}
interface ProductImageProps {
  product: Product;
  decodedToken: DecodedToken | null;
  onAddToBasket: (product: any, quantity: number) => void;
  view: number;
}

const ProductImage: React.FC<ProductImageProps> = ({
  product,
  onAddToBasket,
  decodedToken,
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
  const { addToComparison, comparisonList } = useProductComparisonStore(
  );

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

  return (
    <div className={`
      relative w-full group
      ${view === 1 ? 'max-w-[160px]' : ''}
    `}>
      <Link
        href={`/products/tunisie?productId=${product.id}`}
        className="block w-full h-40 md:h-[268px]"
      >
        <div className="relative w-full h-full">
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gray-50 animate-pulse" />
          )}
          {hasImages && (
            <Image
              src={primaryImageUrl}
              alt={product.name}
              layout="fill"
              
              objectFit="contain"
              quality={80}
              priority={true}
              onLoad={handleImageLoad}
              className={`p-2 transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          )}
          {hasSecondImage && (
            <Image
              src={secondaryImageUrl}
              alt={`${product.name} - hover`}
              layout="fill"
              objectFit="contain"
              quality={80}
              className="absolute inset-0 p-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
            />
          )}
        </div>
      </Link>

      <ul
        className={`plus_button absolute h-fit flex ${view === 1
          ? "right-0 top-2/4 -translate-y-2/4 flex-col"
          : "bottom-0 left-2/4 -translate-x-2/4"
          } items-center justify-center lg:opacity-0 lg:group-hover:opacity-100 z-30 gap-2`}
      >
        <QuickActionButton
          icon={<FaRegEye color="white" className="text-xs md:text-base" />}
          onClick={() => openProductDetails(product)}
          title="aperçu rapide"
        />
        <QuickActionButton
          icon={
            <FaBasketShopping color="white" className="text-xs md:text-base" />
          }
          onClick={() => onAddToBasket(product, 1)}
          title="Ajouter au panier"
          disabled={product.inventory <= 0}
          isAddToCart={true}
        />
        <QuickActionButton
          icon={<IoGitCompare color="white" className="text-xs md:text-base" />}
          onClick={onAddToCompare}
          title="Ajouter au comparatif"
        />
        <FavoriteProductButton
          isFavorite={isFavorite}
          setIsFavorite={setIsFavorite}
          productId={product?.id}
          userId={decodedToken?.userId}
          productName={product?.name}
        />
      </ul>
    </div>
  );
};

export default ProductImage;
