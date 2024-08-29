import { trackEvent } from "@/app/Helpers/_trackEvents";
import {
  useBasketStore,
  useDrawerBasketStore,
  useProductsInBasketStore,
} from "@/app/store/zustand";
import { useToast } from "@/components/ui/use-toast";
import { BASKET_QUERY, FETCH_USER_BY_ID } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
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
  const { toast } = useToast();
  const toggleIsUpdated = useBasketStore((state) => state.toggleIsUpdated);
  const { openBasketDrawer } = useDrawerBasketStore();
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);

  const { addProductToBasket, products } = useProductsInBasketStore(
    (state) => ({
      addProductToBasket: state.addProductToBasket,
      products: state.products,
    }),
  );

  const { data: userData } = useQuery(FETCH_USER_BY_ID, {
    variables: {
      userId: decodedToken?.userId,
    },
    skip: !decodedToken?.userId,
  });
  // Query the basket first
  const { data: basketData } = useQuery(BASKET_QUERY, {
    variables: { userId: decodedToken?.userId },
  });
  const AddToBasket = async (product: any) => {
    if (decodedToken) {
      try {
        // Find if the product is already in the basket
        const existingBasketItem = basketData.basketByUserId.find(
          (item: any) => item.Product.id === product.id,
        );

        const currentBasketQuantity = existingBasketItem
          ? existingBasketItem.quantity
          : 0;
        const totalQuantity = currentBasketQuantity + actualQuantity;

        // Check if the total quantity exceeds the inventory
        if (totalQuantity > product.inventory) {
          toast({
            title: "Quantité non disponible",
            description: `Désolé, nous n'avons que ${product.inventory} unités en stock. Votre panier contient déjà ${currentBasketQuantity} unités.`,
            className: "bg-red-600 text-white",
          });
          return;
        }

        // If everything is okay, proceed with adding to basket
        await addToBasket({
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
          onCompleted: () => {
            toast({
              title: "Produit ajouté au panier",
              description: `${actualQuantity} ${actualQuantity > 1 ? "unités" : "unité"} de "${productDetails?.name}" ${actualQuantity > 1 ? "ont été ajoutées" : "a été ajoutée"} à votre panier.`,
              className: "bg-primaryColor text-white",
            });
            // Track Add to Cart
            trackEvent("AddToCart", {
              em: userData?.fetchUsersById.email.toLowerCase(),
              fn: userData?.fetchUsersById.fullName,
              ph: userData?.fetchUsersById.number[0],
              country: "tn",
              content_name: productDetails.name,
              content_type: "product",
              content_ids: [productDetails.id],
              value:
                productDetails.productDiscounts.length > 0
                  ? productDetails.productDiscounts[0].newPrice
                  : productDetails.price,
              currency: "TND",
            });
          },
        });
      } catch (error) {
        console.error("Error adding to basket:", error);
        toast({
          title: "Erreur",
          description:
            "Une erreur s'est produite lors de l'ajout au panier. Veuillez réessayer.",
          className: "bg-red-600 text-white",
        });
      }
    } else {
      const isProductAlreadyInBasket = products.some(
        (p: any) => p.id === product?.id,
      );
      if (!isProductAlreadyInBasket) {
        if (actualQuantity > product.inventory) {
          toast({
            title: "Quantité non disponible",
            description: `Désolé, nous n'avons que ${product.inventory} unités en stock.`,
            className: "bg-red-600 text-white",
          });
          return;
        }
        addProductToBasket({
          ...product,
          price:
            product.productDiscounts.length > 0
              ? product?.productDiscounts[0]?.newPrice
              : product?.price,
          actualQuantity: actualQuantity,
        });
        toast({
          title: "Produit ajouté au panier",
          description: `${actualQuantity} ${actualQuantity > 1 ? "unités" : "unité"} de "${productDetails?.name}" ${actualQuantity > 1 ? "ont été ajoutées" : "a été ajoutée"} à votre panier.`,
          className: "bg-green-600 text-white",
        });
        // Track Add to Cart
        trackEvent("AddToCart", {
          em: userData?.fetchUsersById.email.toLowerCase(),
          fn: userData?.fetchUsersById.fullName,
          ph: userData?.fetchUsersById.number[0],
          country: "tn",
          content_name: productDetails.name,
          content_type: "product",
          content_ids: [productDetails.id],
          value:
            productDetails.productDiscounts.length > 0
              ? productDetails.productDiscounts[0].newPrice
              : productDetails.price,
          currency: "TND",
        });
      } else {
        toast({
          title: "Produit déjà dans le panier",
          description: `"${productDetails?.name}" est déjà dans votre panier. Vous pouvez modifier la quantité dans le panier.`,
          className: "bg-blue-600 text-white",
        });
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
            <h3 className=" tracking-wider font-normal text-sm  capitalize text-primaryColor">
              Quantité:{" "}
            </h3>

            <div className="flex  items-center gap-2  divide-x-0  overflow-hidden ">
              <button
                type="button"
                className="bg-lightBeige hover:bg-secondaryColor transition-all w-fit h-fit  p-2  text-sm font-semibold cursor-pointer"
                onClick={() => {
                  setActualQuantity(
                    actualQuantity > 1 ? actualQuantity - 1 : 1,
                  );
                }}
              >
                <RiSubtractFill />
              </button>
              <button
                type="button"
                className="bg-transparent px-4  py-2 h-full border shadow-md font-semibold  text-[#333] text-md"
              >
                {actualQuantity}
              </button>
              <button
                type="button"
                className={`${actualQuantity === productDetails?.inventory && "opacity-45"}w-fit h-fit  bg-primaryColor text-white p-2 text-sm  font-semibold cursor-pointer`}
                onClick={() => {
                  setActualQuantity(
                    actualQuantity < productDetails.inventory
                      ? actualQuantity + 1
                      : actualQuantity,
                  );
                }}
              >
                <FaPlus />
              </button>
            </div>
          </div>
          <div
            className={`flex items-center w-60 transition-colors ${productDetails.inventory <= 0 ? "cursor-not-allowed" : "cursor-pointer"} bg-primaryColor hover:bg-secondaryColor`}
          >
            <button
              disabled={productDetails?.inventory <= 0}
              type="button"
              className=" text-white  py-3  w-full shadow-lg"
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
