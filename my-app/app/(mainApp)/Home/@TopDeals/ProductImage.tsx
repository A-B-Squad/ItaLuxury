import Image from "next/image";

import Link from "next/link";
import { useState, useMemo } from "react";

const ProductImage = ({ product }: { product: any }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Use useMemo to calculate these values only when product changes
  const { discountPercentage, isNewProduct, imageUrl } = useMemo(() => {
    const discountData = product?.productDiscounts?.[0];
    const discountPercentage = discountData
      ? Math.round(((discountData.price - discountData.newPrice) / discountData.price) * 100)
      : null;

    // Check if product is new (created within the last 7 days)
    const isNewProduct = product?.createdAt &&
      new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Ensure we have a valid image URL
    const imageUrl = product?.images && product.images.length > 0 && product.images[0]
      ? product.images[0]
      : "https://res.cloudinary.com/dc1cdbirz/image/upload/v1732014003/ita-luxury/zdiptq7s9m9ck13ljnvy.jpg";

    return { discountPercentage, isNewProduct, imageUrl };
  }, [product]);

  const productUrl = `/products/tunisie?productId=${product.id}`;

  return (
    <Link href={productUrl} className="relative block h-56 md:h-64 lg:h-full w-full overflow-hidden rounded-md">
      {/* Discount badge - positioned on the left top */}
      {discountPercentage && (
        <div className="absolute left-0 top-3 z-20">
          <div className="bg-red-500 text-white px-3 py-1 text-xs md:text-sm font-bold shadow-md rounded-r-full">
            -{discountPercentage}%
          </div>
        </div>
      )}

      {/* New product badge - positioned on the right top */}
      {isNewProduct && (
        <div className="absolute right-0 top-3 z-20">
          <div className="bg-green-500 text-white px-3 py-1 text-xs md:text-sm font-bold shadow-md rounded-l-full">
            NOUVEAU
          </div>
        </div>
      )}

      <div className="relative h-52 md:h-60 lg:h-full w-full  rounded-md overflow-hidden group cursor-pointer">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
        )}

        <div className="h-full w-full transform transition-transform duration-300 hover:scale-105">
          <Image
            layout="fill"
            style={{ objectFit: "contain" }}
            className={`h-full w-full transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"
              }`}
            src={imageUrl}
            alt={product?.name || "Product image"}
            onLoadingComplete={() => setIsLoading(false)}
            onError={() => {
              setImageError(true);
              setIsLoading(false);
            }}
            priority
            quality={85}
            unoptimized={imageError}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
        </div>

        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
      </div>
    </Link>
  );
};

export default ProductImage;