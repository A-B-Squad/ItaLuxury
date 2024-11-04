import prepRoute from "@/app/Helpers/_prepRoute";
import Link from "next/link";
import React from "react";

interface ProductNameProps {
  product: Product;
}

const ProductName: React.FC<ProductNameProps> = ({ product }) => {
  const categoryNames = product.categories
    .map(cat => cat.name)
  const queryParams = new URLSearchParams({
    productId: product.id,
    categories: [categoryNames,product?.name].join(',')
  });

  return (
    <Link
      rel="preload"
      href={`/products/tunisie/${prepRoute(product?.name)}/?${queryParams}`}

    >
      <div className="product-name pt-1 tracking-wider  hover:text-primaryColor transition-colors text-sm font-semibold ">
        <p className="category font-normal -tracking-tighter text-xs capitalize">
          {categoryNames[categoryNames.length - 1]}
        </p>
        <p className="text-xs lg:font-semibold lg:text-sm line-clamp-2 ">{product.name}</p>
      </div>
    </Link>
  );
};
export default ProductName;
