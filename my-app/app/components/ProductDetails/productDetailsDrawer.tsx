import { JwtPayload } from "jsonwebtoken";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { RiSubtractFill } from "react-icons/ri";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  userId: string;
}
const productDetailsDrawer = ({
  isBottom,
  productDetails,
  addToBasket,
  productId,
  setSuccessMsg,
  discount,
  quantity,
  setQuantity,
}: any) => {
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
  }, []);
  return (
    <div>
      {isBottom && !!productDetails && (
        <div className="fixed bottom-0 left-0 right-0 gap-8 bg-white p-4 h-[20%] border-t-2 flex items-center justify-center">
          <img
            src={productDetails.images[0]}
            className="max-h-full"
            alt="product image"
          />

          <div className="items-center ">
            <h2 className="product_name tracking-wider text-2xl font-semibold ">
              {productDetails.name}
            </h2>
            <div className="discount flex flex-col  gap-1 mt-2">
              <p className="text-strongBeige tracking-wide text-xl font-bold">
                {discount
                  ? discount.newPrice.toFixed(3)
                  : productDetails.price.toFixed(3)}{" "}
                <span className="text-xl ">TND</span>
              </p>
            </div>
          </div>
          <div className="Quantity flex items-center  space-x-2">
            <h3 className="text-lg tracking-wider font-semibold  capitalize text-strongBeige">
              Quantité
            </h3>
            <div className="flex divide-x border w-max overflow-hidden rounded-md">
              <button
                type="button"
                className="bg-lightBeige hover:bg-mediumBeige transition-all  px-3 py-1 font-semibold cursor-pointer"
                onClick={() => {
                  setQuantity(quantity - 1);
                }}
              >
                <RiSubtractFill />
              </button>
              <button
                type="button"
                className="bg-transparent px-3 py-1 font-semibold text-[#333] text-md"
              >
                {quantity}
              </button>
              <button
                type="button"
                className="bg-strongBeige text-white px-3 py-1 font-semibold cursor-pointer"
                onClick={() => {
                  setQuantity(quantity + 1);
                }}
              >
                <FaPlus />
              </button>
            </div>
          </div>
          <div className="flex items-center w-60">
            <button
              type="button"
              className="bg-strongBeige text-white px-4 py-2 rounded"
              onClick={() => {
                addToBasket({
                  variables: {
                    input: {
                      userId: decodedToken?.userId,
                      quantity: quantity,
                      productId: productId,
                    },
                  },
                });
                setSuccessMsg("Produit ajouté avec succès au panier !");
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
