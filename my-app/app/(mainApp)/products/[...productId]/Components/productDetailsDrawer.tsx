import {
  useBasketStore,
  useComparedProductsStore,
  useDrawerBasketStore,
  useProductsInBasketStore,
} from "@/app/store/zustand";
import { BASKET_QUERY } from "@/graphql/queries";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { RiSubtractFill } from "react-icons/ri";

interface DecodedToken extends JwtPayload {
  userId: string;
}
const productDetailsDrawer = ({
  isBottom,
  productDetails,
  addToBasket,
  productId,
  discount,
  actualQuantity,
  setActualQuantity,
}: any) => {
  const toggleIsUpdated = useBasketStore((state) => state.toggleIsUpdated);
  const { openBasketDrawer } = useDrawerBasketStore();

  const { addProductToBasket, products } = useProductsInBasketStore(
    (state) => ({
      addProductToBasket: state.addProductToBasket,
      products: state.products,
    })
  );

  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const AddToBasket = (product: any) => {
    if (decodedToken) {
      addToBasket({
        variables: {
          input: {
            userId: decodedToken?.userId,
            quantity: actualQuantity,
            productId: product.id,
          },
        },
        refetchQueries: [
          {
            query: BASKET_QUERY,
            variables: { userId: decodedToken?.userId },
          },
        ],
      });
    } else {
      const isProductAlreadyInBasket = products.some(
        (p: any) => p.id === product?.id
      );
      if (!isProductAlreadyInBasket) {
        addProductToBasket({
          ...product,
          price:
            product.productDiscounts.length > 0
              ? product?.productDiscounts[0]?.newPrice
              : product?.price,
          actualQuantity: 1,
        });
      } else {
        console.log("Product is already in the basket");
      }
    }
    toggleIsUpdated();
    openBasketDrawer();
  };
  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
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
            <h2 className="product_name tracking-wider text-xl font-semibold ">
              {productDetails.name}
            </h2>
            <div className="discount flex flex-col  gap-1 mt-2">
              <p className="text-primaryColor  tracking-wide text-2xl font-bold">
                {discount
                  ? discount.newPrice.toFixed(3)
                  : productDetails.price.toFixed(3)}{" "}
                <span className="text-xl ">TND</span>
              </p>
            </div>
          </div>
          <div className="Quantity flex items-center  space-x-2">
            <h3 className="text-lg tracking-wider font-semibold  capitalize text-primaryColor">
              Quantité
            </h3>
            <div className="flex divide-x border w-max overflow-hidden rounded-md">
              <button
                type="button"
                className="bg-lightBeige hover:bg-secondaryColor transition-all  px-3 py-1 font-semibold cursor-pointer"
                onClick={() => {
                  setActualQuantity(
                    actualQuantity > 1 ? actualQuantity - 1 : 1
                  );
                }}
              >
                <RiSubtractFill />
              </button>
              <button
                type="button"
                className="bg-transparent px-3 py-1 font-semibold text-[#333] text-md"
              >
                {actualQuantity}
              </button>
              <button
                type="button"
                className={`${actualQuantity === productDetails?.inventory && "opacity-45"} bg-primaryColor text-white px-3 py-1 font-semibold cursor-pointer`}
                onClick={() => {
                  setActualQuantity(
                    actualQuantity < productDetails.inventory
                      ? actualQuantity + 1
                      : actualQuantity
                  );
                }}
              >
                <FaPlus />
              </button>
            </div>
          </div>
          <div className="flex items-center w-60">
            <button
              type="button"
              className="bg-primaryColor text-white px-4 py-2 rounded"
              onClick={() => {
                AddToBasket(productDetails);
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
