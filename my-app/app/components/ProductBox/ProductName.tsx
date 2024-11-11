import Link from "next/link";
import React, { useMemo } from "react";

interface ProductNameProps {
  product: Product;
}

const ProductName: React.FC<ProductNameProps> = ({ product }) => {
  const categoryNames = useMemo(
    () => product.categories?.map((category: { name: any }) => category.name),
    [product]
  );

  return (
    <Link rel="preload" href={`/products/tunisie?productId=${product.id}`}>
      <div className="product-name pt-1 tracking-wider  hover:text-primaryColor transition-colors text-sm font-semibold ">
        <p className="category font-normal -tracking-tighter text-xs capitalize">
          {categoryNames[categoryNames.length - 1]}
        </p>
        <p className="text-xs lg:font-semibold lg:text-sm line-clamp-2 ">
          {product.name}
        </p>
      </div>
    </Link>
  );
};
export default ProductName;
