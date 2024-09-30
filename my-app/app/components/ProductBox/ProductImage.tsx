import prepRoute from "@/app/Helpers/_prepRoute";
import Image from "next/legacy/image";
import Link from "next/link";
import React from "react";

interface ProductImageProps {
  product: Product;
}

const ProductImage: React.FC<ProductImageProps> = ({ product }) => (
  <Link
    className="relative  w-full flex mx-auto items-center  justify-center h-52 md:w-56 overflow-hidden"
    rel="preload"
    href={`/products/tunisie/${prepRoute(product?.name)}/?productId=${product?.id}&categories=${[product?.categories[0]?.name, product?.categories[0]?.subcategories[0]?.name, product?.categories[0]?.subcategories[0]?.subcategories[0]?.name, product?.name]}`}
  >
    <div className="images  top-0 relative group  h-48 w-48 md:h-full md:w-full">
      {product.images.length > 1 ? (
        <>
          <Image
            src={product.images[0]}
            className="absolute group-hover:opacity-0 z-10 opacity-100 transition-all 
            
            "
            loading="eager"
            priority
            objectFit="contain"
            alt={`products-${product.name}`}
            layout="fill"
          />
          <Image
            src={product.images[1]}
            className="absolute group-hover:opacity-100 group-hover:scale-125  duration-1000   opacity-0 transition-all "
            loading="eager"
            priority
            objectFit="contain"
            alt={`products-${product.name}`}
            layout="fill"
          />
        </>
      ) : (
        <Image
          src={product.images[0]}
          className="h-full w-full "
          loading="eager"
          priority
          objectFit="contain"
          alt={`products-${product.name}`}
          layout="fill"
        />
      )}
    </div>
  </Link>
);

export default ProductImage;
