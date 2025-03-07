import Image from "next/legacy/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

const ProductImage = ({ product }: { product: any }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  const discountData = product?.productDiscounts?.[0];
  const discountPercentage = discountData
    ? Math.round(((discountData.price - discountData.newPrice) / discountData.price) * 100)
    : null;

  return (
    <Link
      href={`/products/tunisie?productId=${product.id}`}
      className="relative block h-56 lg:h-full w-full overflow-hidden rounded-md"
    >
      {discountPercentage && (
        <motion.span 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="absolute left-3 top-3 z-20 text-white bg-green-600 px-3 py-1 rounded-full text-xs font-medium shadow-sm"
        >
          -{discountPercentage}%
        </motion.span>
      )}
      
      <div className="relative h-52 lg:h-full w-full bg-gray-50 rounded-md overflow-hidden group">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
        )}
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="h-full w-full"
        >
          <Image
            layout="fill"
            objectFit="contain"
            className={`h-full w-full transition-opacity duration-300 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
            src={product?.images[0] || "/placeholder-product.png"}
            alt={product?.name || "Product image"}
            onLoadingComplete={() => setIsLoading(false)}
            priority
            quality={85}
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
      </div>
    </Link>
  );
};

export default ProductImage;