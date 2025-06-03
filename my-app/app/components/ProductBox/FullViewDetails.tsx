import React from "react";
import { SlBasket } from "react-icons/sl";

interface FullViewDetailsProps {
  product: Product;
}

const FullViewDetails: React.FC<FullViewDetailsProps> = ({
  product,
}) => (
  <>
    <div className="price&ColorInfo  flex w-full justify-between items-start ">
      <div className="prices flex flex-col lg:flex-row lg:gap-2 justify-center  w-full items-center text-center">
        {product.productDiscounts.length > 0 && (
          <p className="text-red-500 font-bold md:text-lg  text-sm">
            {product.productDiscounts[0]?.newPrice.toFixed(3)} TND
          </p>
        )}


        <p
          className={`${product.productDiscounts.length > 0
            ? "line-through font-normal  text-sm md:text-base text-[#666]"
            : "text-primaryColor  font-bold md:text-lg py-1 text-base"} `}
        >
          {product.price.toFixed(3)} TND
        </p>

      </div>
      <div
        className="Color absolute right-1 top-0 w-fit rounded-full cursor-crosshair"
        title={product.Colors?.color}
      >
        {product.Colors && (
          <div
            className="colors_available items-center mt-1 rounded-md w-5 h-5 border-black border-1   shadow-gray-400 shadow-md"
            style={{ backgroundColor: product.Colors.Hex }} />
        )}
      </div>
    </div>
    {/* <button
      disabled={product.inventory <= 0}
      type="button"
      className={`${product?.inventory <= 0 ? "cursor-not-allowed" : "cursor-pointer"} absolute  left-2/4 top-2/4 -translate-x-2/4 flex items-center gap-2 self-center py-2 m-auto  w-fit justify-center bg-white px-2 text-sm md:text-base hover:text-white transition hover:bg-secondaryColor`}

      onClick={() => {
        onAddToBasket(product, 1);
      }}>
      <SlBasket />
      Ajouter au panier
    </button> */}

  </>
);

export default FullViewDetails;
