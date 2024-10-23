import React from "react";
import { SlBasket } from "react-icons/sl";

interface FullViewDetailsProps {
  product: Product;
  onAddToBasket: (product: any, quantity: number) => void;
}

const FullViewDetails: React.FC<FullViewDetailsProps> = ({
  product,
  onAddToBasket,
}) => (
  <>
    <div className="price&ColorInfo relative flex justify-between items-start pt-1">
      <div className="prices">
        <p
          className={`${product.productDiscounts.length > 0
            ? "line-through font-medium  text-base text-gray-700"
            : "text-primaryColor text-base font-bold md:text-lg py-1"} `}
        >
          {product.price.toFixed(3)} TND
        </p>
        {product.productDiscounts.length > 0 && (

          <p className="text-red-500 font-bold ml-1  text-lg">
            {product.productDiscounts[0]?.newPrice.toFixed(3)} TND
          </p>

        )}
      </div>
      <div
        className="Color absolute right-1 top-0 w-fit rounded-full cursor-crosshair"
        title={product.Colors?.color}
      >
        {product.Colors && (
          <div
            className="colors_available items-center mt-1 rounded-md w-6 h-6 border-black border-1   shadow-gray-400 shadow-md"
            style={{ backgroundColor: product.Colors.Hex }} />
        )}
      </div>
    </div>
    <button
      disabled={product.inventory <= 0}
      type="button"
      className={`${product?.inventory <= 0 ? "cursor-not-allowed" : "cursor-pointer"} flex items-center gap-2 self-center py-2 m-auto  w-fit justify-center bg-white px-2 text-sm md:text-base hover:text-white transition hover:bg-secondaryColor`}

      onClick={() => {
        onAddToBasket(product, 1);
      }}>
      <SlBasket />
      Ajouter au panier
    </button>
  </>
);

export default FullViewDetails;
