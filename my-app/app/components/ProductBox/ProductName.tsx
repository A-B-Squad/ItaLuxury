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
      <div className="product-name pt-1">
        <p className="category hidden lg:block font-normal -tracking-tighter text-xs capitalize">
          {categoryNames[categoryNames.length - 1]}
        </p>
        <p className=" font-semibold px-2 text-center text-[13px] line-clamp-2 ">
          {product.name}
        </p>
      </div>
    </Link>
  );
};
export default ProductName;
