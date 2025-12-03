import calcDateForNewProduct from "@/app/Helpers/_calcDateForNewProduct";
import { useAllProductViewStore } from "@/app/store/zustand";
import { getActiveDiscount } from "@/utils/getActiveDiscount";
import { getDiscountPercentage } from "@/utils/getDiscountPercentage";
import { hasActiveDiscount } from "@/utils/hasActiveDiscount";
import React, { useMemo } from "react";
import { FaTag } from "react-icons/fa";

interface ProductLabelsProps {
  product: Product;
}

const ProductLabels: React.FC<ProductLabelsProps> = ({ product }) => {
  const { view } = useAllProductViewStore();

  // First check if product is new based on createdAt
  const isNewByCreatedAt = calcDateForNewProduct(product?.createdAt);

  // Show "new" label if either condition is true
  const isNewProduct = isNewByCreatedAt;

  // Discount-related memoized values
  const isDiscounted = useMemo(
    () => hasActiveDiscount(product) && product.inventory !== 0,
    [product]
  );
  const discountPercent = useMemo(
    () => getDiscountPercentage(product),
    [product]
  );
  const activeDiscount = useMemo(
    () => getActiveDiscount(product),
    [product]
  );

  const isOutOfStock = product.inventory === 0;

  return (
    <div className="absolute top-0 left-0 w-full p-2 z-20 pointer-events-none">
      {/* Discount Badge - Top Left (Absolute positioned) */}
      {isDiscounted && (
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-2.5 py-1 rounded-lg shadow-lg font-bold text-xs flex items-center gap-1.5">
            <FaTag className="w-3 h-3" />
            -{discountPercent}%
          </div>
          {activeDiscount?.campaignName && view !== 1 && (
            <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-2 py-0.5 rounded-md shadow-md font-semibold text-[10px] whitespace-nowrap">
              {activeDiscount.campaignName}
            </div>
          )}
        </div>
      )}

      {/* Other Labels - Top Right */}
      <div className="flex justify-end gap-1.5">
        {/* New Product Badge */}
        {isNewProduct && !isOutOfStock && (
          <span className="bg-gradient-to-r from-secondaryColor to-secondaryColor text-white px-2 py-1 rounded-md shadow-md font-semibold text-[10px] uppercase">
            Nouveau
          </span>
        )}

        {/* Out of Stock Badge */}
        {isOutOfStock && (
          <span className="bg-gradient-to-r from-gray-600 to-gray-500 text-white px-2 py-1 rounded-md shadow-md font-semibold text-[10px] uppercase">
            <span className="hidden md:inline">En Rupture de Stock</span>
            <span className="md:hidden">Rupture</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default React.memo(ProductLabels);