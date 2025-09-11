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
      className={`productStatusLabel absolute -top-2 flex ${view == 1 ? "gap-10" : "justify-between"}  w-full px-3 z-20 uppercase text-white text-[11px] translate-y-4`}
    >
      {calcDateForNewProduct(product?.createdAt) && (
        <span className="bg-blueColor w-fit justify-start shadow-md p-1">
          Nouveau
        </span>
      )}

      {product.inventory == 0 && (
        <span className="bg-gray-400 text-white w-fit shadow-md p-1 md:block">
          <span className="hidden md:inline">En Rupture de Stock</span>
          <span className="md:hidden">Rupture</span>
        </span>
      )}
      {product.productDiscounts.length > 0 && product.inventory !== 0 && (
        <span className="bg-red-500 w-fit shadow-md p-1">Promo</span>
      )}
    </div>
  );
};
export default ProductLabels;
