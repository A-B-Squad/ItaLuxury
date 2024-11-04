
import React from "react";
import { FaPlus } from "react-icons/fa";
import { RiSubtractFill } from "react-icons/ri";


const productDetailsDrawer = ({
  isBottom,
  productDetails,
  addToBasket,
  discount,
  handleDecreaseQuantity,
  quantity,
  handleIncreaseQuantity,
}: any) => {



  return (
    <div className="hidden md:flex ">

      {isBottom && !!productDetails && (
        <div className="fixed z-50 bottom-0 left-0 right-0 gap-8 bg-white p-4 h-[20%] border-t-2 flex items-center justify-center">
          <img
            src={productDetails.images[0]}
            className="max-h-full"
            alt="product image"
          />

          <div className="items-center ">
            <h2 className="product_name tracking-wider text-xl max-w-60 line-clamp-1 font-semibold ">
              {productDetails.name}
            </h2>
            <div className="discount flex items-center   gap-2">

              {discount
                ? <p className="text-gray-400 line-through  font-semibold 	text-lg" >{productDetails?.price.toFixed(3)} TND</p>
                : <p className=" font-bold">
                  {productDetails?.price.toFixed(3)} TND
                </p>
              }

              {discount
                ? <p className="text-red-500 text-xl  font-bold"> {discount.newPrice.toFixed(3)} TND</p>
                : ""
              }
            </div>
          </div>
          <div className="Quantity flex items-center  space-x-2">
            <h3 className=" tracking-wider font-normal text-sm  capitalize text-primaryColor">
              Quantité:{" "}
            </h3>

            <div className="flex  items-center gap-2  divide-x-0  overflow-hidden ">
              <button
                type="button"
                className="bg-lightBeige hover:bg-secondaryColor transition-all w-fit h-fit  p-2  text-sm font-semibold cursor-pointer"
                disabled={quantity == 1}
                onClick={handleDecreaseQuantity}
              >
                <RiSubtractFill />
              </button>
              <button
                type="button"
                className="bg-transparent px-4  py-2 h-full border shadow-md font-semibold  text-[#333] text-md"
              >
                {quantity}
              </button>
              <button
                type="button"
                className={`${quantity === productDetails?.inventory && "opacity-45"}w-fit h-fit  bg-primaryColor text-white p-2 text-sm  font-semibold cursor-pointer`}
                disabled={quantity === productDetails?.inventory}
                onClick={handleIncreaseQuantity}
              >
                <FaPlus />
              </button>
            </div>
          </div>
          <div
            className={`flex items-center w-60 transition-colors ${productDetails.inventory <= 0 ? "cursor-not-allowed" : "cursor-pointer"} bg-secondaryColor hover:bg-secondaryColor`}
          >
            <button
              disabled={productDetails?.inventory <= 0}
              type="button"
              className=" text-white  py-3  w-full shadow-lg"
              onClick={() => {
                addToBasket(productDetails);
              }}
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default productDetailsDrawer;
