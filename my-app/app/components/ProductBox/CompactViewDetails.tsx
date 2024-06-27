import React from "react";

interface CompactViewDetailsProps {
  product: Product;
}

const CompactViewDetails: React.FC<CompactViewDetailsProps> = ({ product }) => (
  <div className="flex items-stretch flex-col">
    <div className="flex justify-between flex-col items-start">
      <div className="flex md:gap-3 flex-col md:flex-row">
        {product.productDiscounts.length > 0 && (
          <div className="flex items-center">
            <span className="text-red-500 font-bold text-base md:text-lg">
              {product.productDiscounts[0]?.newPrice.toFixed(3)} TND
            </span>
          </div>
        )}
        <p
          className={`${
            product.productDiscounts.length > 0
              ? "line-through text-base md:text-lg font-semibold text-gray-700"
              : "text-primaryColor text-base md:text-lg py-1"
          } font-semibold`}
        >
          {product.price.toFixed(3)} TND
        </p>
      </div>
      <div
        className="Color relative w-fit cursor-crosshair"
        title={product.Colors?.color}
      >
        {product.Colors && (
          <div
            className="colors_available items-center mt-1 w-5 h-5 border-black border-2 rounded-sm shadow-gray-400 shadow-sm"
            style={{ backgroundColor: product.Colors.Hex }}
          />
        )}
      </div>
      <p
        className="w-full text-xs md:text-sm pt-2 tracking-wider line-clamp-2"
        dangerouslySetInnerHTML={{ __html: product.description }}
      />
    </div>
  </div>
);
export default CompactViewDetails;
