import { getCurrentPrice } from "@/utils/getCurrentPrice";
import { hasActiveDiscount } from "@/utils/hasActiveDiscount";
import React from "react";
import { SlBasketLoaded } from "react-icons/sl";

interface Product {
  id: string;
  name: string;
  price: number;
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

interface FullViewDetailsProps {
  product: Product;
  onAddToBasket: (product: Product, quantity: number) => void;
}

const FullViewDetails: React.FC<FullViewDetailsProps> = ({
  product,
  onAddToBasket
}) => {
  const hasDiscount = hasActiveDiscount(product);
  const currentPrice = getCurrentPrice(product);

  return (
    <div className="flex w-full flex-col md:flex-row justify-between items-start">
      {/* Price Section */}
      <div className="PriceSection flex-1">
        {hasDiscount ? (
          <div className="flex flex-col sm:items-center gap-1">
            <span className="text-lg md:text-xl font-bold text-red-500">
              {currentPrice.toFixed(3)} TND
            </span>
            <span className="text-base font-medium line-through text-gray-400">
              {product.price.toFixed(3)} TND
            </span>
          </div>
        ) : (
          <span className="md:text-xl font-bold text-gray-900">
            {product.price.toFixed(3)} TND
          </span>
        )}
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={() => onAddToBasket(product, 1)}
        className="flex items-center justify-center w-full md:w-9 h-9 bg-gray-100 hover:bg-blue-50 rounded-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        aria-label={`Add ${product.name} to basket`}
        title="Add to basket"
      >
        <SlBasketLoaded
          size={16}
          className="text-gray-600 group-hover:text-blue-600 transition-colors duration-200"
        />
      </button>
    </div>
  );
};

export default React.memo(FullViewDetails);