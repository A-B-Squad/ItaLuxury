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
    <div className="flex justify-between items-start pt-1">
      <div>
        <p
          className={`${
            product.productDiscounts.length > 0
              ? "line-through font-bold text-base text-gray-700"
              : "text-primaryColor text-base md:text-lg py-1"
          } font-bold`}
        >
          {product.price.toFixed(3)} TND
        </p>
        {product.productDiscounts.length > 0 && (
          <div className="flex items-center">
            <span className="text-gray-400 text-xs md:text-sm  font-thin">
              A partir de :
            </span>
            <span className="text-red-500 font-bold ml-1 text-base md:text-lg">
              {product.productDiscounts[0]?.newPrice.toFixed(3)} TND
            </span>
          </div>
        )}
      </div>
      <div
        className="Color relative w-fit rounded-full cursor-crosshair"
        title={product.Colors?.color}
      >
        {product.Colors && (
          <div
            className="colors_available items-center mt-1 rounded-md w-6 h-6 border-black border-1   shadow-gray-400 shadow-md"
            style={{ backgroundColor: product.Colors.Hex }}
          />
        )}
      </div>
    </div>
    <button
      disabled={product.inventory <= 0}
      type="button"
      className={`${product?.inventory <= 0 ? "cursor-not-allowed" : "cursor-pointer"} flex items-center gap-2 self-center py-2 m-auto text-base w-fit justify-center bg-white px-2 text-md hover:text-white transition hover:bg-red-300`}
      onClick={onAddToBasket}
    >
      <SlBasket />
      Ajouter au panier
    </button>
  </>
);

export default FullViewDetails;
