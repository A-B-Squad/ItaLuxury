import calcDateForNewProduct from "@/app/Helpers/_calcDateForNewProduct";
import React from "react";

interface ProductLabelsProps {
  product: Product;
}

const ProductLabels: React.FC<ProductLabelsProps> = ({ product }) => (
  <div className="absolute top-0 flex justify-between w-full px-3 z-20 uppercase text-white text-[11px] translate-y-4">
    {calcDateForNewProduct(product?.createdAt) && product.inventory !== 0 && (
      <span className="bg-green-500 w-fit justify-start shadow-md p-1">
        Nouveau
      </span>
    )}
    {product.productDiscounts.length > 0 && product.inventory !== 0 && (
      <span className="bg-red-500 w-fit shadow-md p-1">Promo</span>
    )}
    {product.inventory === 0 && (
      <span className="bg-black text-white w-fit shadow-md p-1">
        En Rupture de Stock
      </span>
    )}
  </div>
);
export default ProductLabels;
