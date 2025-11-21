import { getActiveDiscount } from "@/utils/getActiveDiscount";
import { getCurrentPrice } from "@/utils/getCurrentPrice";
import { getDiscountPercentage } from "@/utils/getDiscountPercentage";
import { hasActiveDiscount } from "@/utils/hasActiveDiscount";
import React from "react";
import { FaTag } from "react-icons/fa";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  Colors?: {
    id: string;
    color: string;
    Hex: string;
  };
  productDiscounts: Array<{
    id: string;
    price: number;
    newPrice: number;
    discountType: string;
    discountValue: number;
    campaignName: string;
    campaignType: string;
    dateOfStart: string;
    dateOfEnd: string;
    isActive: boolean;
    isDeleted: boolean;
  }>;
}

interface CompactViewDetailsProps {
  product: Product;
}

const CompactViewDetails: React.FC<CompactViewDetailsProps> = ({ product }) => {
  const hasDiscount = hasActiveDiscount(product);
  const activeDiscount = getActiveDiscount(product);
  const currentPrice = getCurrentPrice(product);
  const discountPercent = getDiscountPercentage(product);

  return (
    <div className="flex items-stretch flex-col">
      <div className="flex justify-between flex-col items-start">
        {/* Price Section */}
        <div className="flex md:gap-3 flex-col md:flex-row items-start md:items-center">
          {hasDiscount && activeDiscount ? (
            <>
              {/* Discount Badge */}
              <div className="flex items-center gap-1 mb-1 md:mb-0">
                <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
                  <FaTag className="w-2.5 h-2.5" />
                  -{discountPercent}%
                </span>
              </div>

              {/* Discounted Price */}
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-bold text-base md:text-lg">
                  {currentPrice.toFixed(3)} TND
                </span>
                {/* Original Price */}
                <p className="line-through text-sm md:text-base font-semibold text-gray-500">
                  {product.price.toFixed(3)} TND
                </p>
              </div>
            </>
          ) : (
            /* Regular Price */
            <p className="text-primaryColor text-base md:text-md py-1 font-semibold">
              {product.price.toFixed(3)} TND
            </p>
          )}
        </div>

        {/* Savings Amount (if discount) */}
        {hasDiscount && (
          <span className="text-xs font-medium text-green-600 mt-1">
            Économisez {(product.price - currentPrice).toFixed(3)} TND
          </span>
        )}

        {/* Color Display */}
        <div
          className="Color relative w-fit cursor-crosshair mt-2"
          title={product.Colors?.color}
        >
          {product.Colors && (
            <div
              className="colors_available items-center w-5 h-5 border-black border-2 rounded-sm shadow-gray-400 shadow-sm"
              style={{ backgroundColor: product.Colors.Hex }}
            />
          )}
        </div>

        {/* Description */}
        <p
          className="w-full text-xs md:text-sm pt-2 line-clamp-3 tracking-wider"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </div>
    </div>
  );
};

export default React.memo(CompactViewDetails);