import React from "react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  categories?: Array<{
    name: string;
  }>;
  Colors?: {
    color: string;
    Hex: string;
  };
}

interface ProductNameProps {
  product: Product;
}

const ProductName: React.FC<ProductNameProps> = ({ product }) => {
  const mainCategory = product.categories?.[product.categories.length - 1]?.name;

  return (
    <div className="space-y-1">
      {/* Category */}
      {mainCategory && (
        <Link
          href={`/products/tunisie?productId=${product.id}`}
          className="inline-block"
        >
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide hover:text-blue-600 transition-colors">
            {mainCategory}
          </span>
        </Link>
      )}
      <div className="flex">

        {/* Product Name */}
        <Link
          href={`/products/tunisie?productId=${product.id}`}
          className="block group"
        >
          <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        {/* Color Display */}
        {product.Colors && (
          <div className="ColorDisplay flex flex-col items-center gap-1">
            <div
              className="w-6 h-6 rounded-full ring-2 ring-gray-200 ring-offset-1 cursor-pointer hover:ring-gray-300 transition-all"
              style={{ backgroundColor: product.Colors.Hex }}
              title={product.Colors.color}
              aria-label={`Selected color: ${product.Colors.color}`}
            />
          </div>
        )}
      </div>

    </div>
  );
};

export default ProductName;