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
  useComparedProductsStore,
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
  const { addProductToCompare, productsInCompare } = useComparedProductsStore(
    (state) => ({
      addProductToCompare: state.addProductToCompare,
      productsInCompare: state.products,
    })
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
    const isProductAlreadyInCompare = productsInCompare.some(
      (p: any) => p.id === product.id
    );
    if (!isProductAlreadyInCompare) {
      addProductToCompare(product);
    } else {
      toast({
        title: "Produit ajouté à la comparaison",
        description: `Le produit "${product?.name}" a été ajouté à la comparaison.`,
        className: "bg-primaryColor text-white",
      });
    }
  }, [product, productsInCompare, addProductToCompare, toast]);

  const handleImageLoad = useCallback(() => {
    setIsImageLoaded(true);
  }, []);

  return (
    <div
      className={`images relative flex ${view == 1 ? "flex-row" : "flex-col"}  gap-1`}
    >
      <Link
        className="relative w-full flex mx-auto items-center justify-center overflow-hidden"
        href={`/products/tunisie?productId=${product.id}`}
      >
        <div className="relative h-44 w-44">
          <div
            className={`absolute inset-0 bg-gray-100 transition-opacity duration-300 ${
              isImageLoaded && (
                <Image src={"/sale.png"} width={100} height={100} />
              )
            }`}
          />

          {hasImages && (
            <Image
              src={primaryImageUrl}
              alt={`${product.name}`}
              layout="fill"
              objectFit="contain"
              quality={75}
              sizes="176px"
              priority={true}
              onLoad={handleImageLoad}
              className={`transition-opacity duration-300 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {hasSecondImage && (
            <Image
              src={secondaryImageUrl}
              alt={`${product.name} - hover`}
              layout="fill"
              objectFit="contain"
              quality={75}
              sizes="176px"
              loading="lazy"
              className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
            />
          )}
        </div>
      </Link>

      <ul
        className={`plus_button absolute h-fit flex ${
          view === 1
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
