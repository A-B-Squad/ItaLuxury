import calcDateForNewProduct from "@/app/Helpers/_calcDateForNewProduct";
import { useAllProductViewStore } from "@/app/store/zustand";
import React from "react";

interface ProductLabelsProps {
  product: Product;
}

const ProductLabels: React.FC<ProductLabelsProps> = ({ product }) => {
  const { view } = useAllProductViewStore();

  return (
    <div
      className={`absolute -top-2 flex ${view == 1 ? "gap-10" : "justify-between"}  w-full px-3 z-20 uppercase text-white text-[11px] translate-y-4`}
    >
      {product.inventory <= 0 && (
        <span className="bg-black text-white w-fit shadow-md p-1">
          En Rupture de Stock
        </span>
      )}
      {calcDateForNewProduct(product?.createdAt) && product.inventory !== 0 && (
        <span className="bg-green-500 w-fit justify-start shadow-md p-1">
          Nouveau
        </span>
      )}
      {product.productDiscounts.length > 0 && product.inventory !== 0 && (
        <span className="bg-red-500 w-fit shadow-md p-1">Promo</span>
      )}
    </div>
  );
};
export default ProductLabels;
