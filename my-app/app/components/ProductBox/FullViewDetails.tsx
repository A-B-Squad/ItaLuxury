import React from "react";
import { SlBasket } from "react-icons/sl";

interface FullViewDetailsProps {
  product: Product;
  onAddToBasket: () => void;
}

const FullViewDetails: React.FC<FullViewDetailsProps> = ({
  product,
  onAddToBasket,
}) => (
  <>
    <div className="flex justify-between items-start pt-3">
      <div>
        <p
          className={`${
            product.productDiscounts.length > 0
              ? "line-through font-semibold text-lg text-gray-700"
              : "text-primaryColor text-xl py-1"
          } font-semibold`}
        >
          {product.price.toFixed(3)} TND
        </p>
        {product.productDiscounts.length > 0 && (
          <div className="flex items-center">
            <span className="text-gray-400 text-xs font-thin">
              A partir de :
            </span>
            <span className="text-red-500 font-bold ml-1 text-xl">
              {product.productDiscounts[0]?.newPrice.toFixed(3)} TND
            </span>
          </div>
        )}
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
    </div>
    <button
      type="button"
      className="flex items-center gap-2 self-center py-2 m-auto text-base w-fit justify-center bg-white px-2 text-md hover:text-white transition hover:bg-red-300"
      onClick={onAddToBasket}
    >
      <SlBasket />
      Ajouter au panier
    </button>
  </>
);

export default FullViewDetails;
