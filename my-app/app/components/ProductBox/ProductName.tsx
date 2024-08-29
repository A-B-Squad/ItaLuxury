import prepRoute from "@/app/Helpers/_prepRoute";
import Link from "next/link";
import React from "react";

interface ProductNameProps {
  product: Product;
}

const ProductName: React.FC<ProductNameProps> = ({ product }) => (
  <Link
    rel="preload"
    href={{
      pathname: `/products/tunisie/${prepRoute(product.name)}`,
      query: {
        productId: product.id,
        collection: [
          product.categories[0]?.name,
          product.categories[0]?.id,
          product.categories[0]?.subcategories[0]?.name,
          product.categories[0]?.subcategories[0]?.id,
          product.categories[0]?.subcategories[0]?.subcategories[0]?.name,
          product.categories[0]?.subcategories[0]?.subcategories[0]?.id,
          product.name,
        ],
      },
    }}
  >
    <div className="product-name pt-1 tracking-wider hover:text-primaryColor transition-colors text-sm font-semibold line-clamp-2">
      <p className="category font-normal -tracking-tighter text-xs capitalize">
        {product.categories[2]?.name}
      </p>
      <p className="line-clamp-2 ">{product.name}</p>
    </div>
  </Link>
);
export default ProductName;
