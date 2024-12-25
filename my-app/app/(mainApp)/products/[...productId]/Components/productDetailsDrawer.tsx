import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { RiSubtractFill } from "react-icons/ri";

const productDetailsDrawer = ({
  productDetails,
  addToBasket,
  discount,
  handleDecreaseQuantity,
  quantity,
  handleIncreaseQuantity,
}: any) => {
  const [isBottom, setIsBottom] = useState<Boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const scrollPosition = window.scrollY;

      // Calculate the position halfway through the window
      const halfwayPosition = windowHeight / 2;

      // Check if the scroll position is greater than or equal to halfway
      const isHalfway = scrollPosition >= halfwayPosition;

      setIsBottom(isHalfway);
    };
    // Attach the scroll event listener
    window.addEventListener("scroll", handleScroll);
    // Detach the scroll event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
              {productDetails?.name}
            </h2>
            <div className="discount flex items-center   gap-2">
              {discount ? (
                <p className="text-gray-400 line-through  font-semibold 	text-lg">
                  {productDetails?.price.toFixed(3)} TND
                </p>
              ) : (
                <p className=" font-bold">
                  {productDetails?.price.toFixed(3)} TND
                </p>
              )}

              {discount ? (
                <p className="text-red-500 text-xl  font-bold">
                  {" "}
                  {discount.newPrice.toFixed(3)} TND
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="Quantity flex items-center  space-x-2">
            <h3 className=" tracking-wider font-normal text-sm  capitalize text-primaryColor">
              Quantité:{" "}
            </h3>


            <div className="flex items-center gap-2 di rounded border border-gray-300">
              <button
                type="button"
                className="px-3 py-1 text-lg font-semibold border-r border-gray-300 cursor-pointer"
                disabled={quantity === 1}
                onClick={handleDecreaseQuantity}
              >
                <RiSubtractFill className="text-gray-600" />
              </button>
              <span
                className="px-4 py-2 text-md 300 font-semibold"
              >
                {quantity}
              </span>
              <button
                type="button"
                className={`${quantity === productDetails.inventory ? "opacity-50" : ""} px-3 py-1 text-lg border-l border-gray-300 font-semibold cursor-pointer`}
                disabled={quantity === productDetails.inventory}
                onClick={handleIncreaseQuantity}
              >
                <FaPlus className="text-gray-600" />
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
