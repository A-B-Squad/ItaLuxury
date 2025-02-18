
"use client";
import {
  useBasketStore,
  useProductDetails,
  useProductsInBasketStore,
} from "@/app/store/zustand";
import { useToast } from "@/components/ui/use-toast";
import { ADD_TO_BASKET_MUTATION } from "@/graphql/mutations";
import { BASKET_QUERY, FETCH_USER_BY_ID } from "@/graphql/queries";
import triggerEvents from "@/utlils/trackEvents";
import { useMutation, useQuery } from "@apollo/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { GoAlertFill } from "react-icons/go";
import { IoCloseOutline } from "react-icons/io5";
import { RiSubtractFill } from "react-icons/ri";
import { SlBasket } from "react-icons/sl";
import dynamic from "next/dynamic";
import { sendGTMEvent } from "@next/third-parties/google";
import { useAuth } from "@/lib/auth/useAuth";
import CustomInnerZoom from "./CustomInnerZoom";



const ProductInfo = () => {
  const [addToBasket] = useMutation(ADD_TO_BASKET_MUTATION);
  const { isOpen, productData, closeProductDetails } = useProductDetails();
  const [bigImage, setBigImage] = useState<any>("");
  const { decodedToken, isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState<number>(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  const { toast } = useToast();
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: basketData } = useQuery(BASKET_QUERY, {
    variables: { userId: decodedToken?.userId },
    skip: !isAuthenticated,
  });

  const { data: userData } = useQuery(FETCH_USER_BY_ID, {
    variables: {
      userId: decodedToken?.userId,
    },
    skip: !isAuthenticated,
  });

  const {
    products: storedProducts,
    addProductToBasket,
    increaseProductInQtBasket,
  } = useProductsInBasketStore();

  const toggleIsUpdated = useBasketStore((state) => state.toggleIsUpdated);

  const productsInBasket = useMemo(() => {
    if (isAuthenticated && basketData?.basketByUserId) {
      return basketData.basketByUserId.find(
        (item: any) => item.Product.id === productData?.id
      );
    }
    return storedProducts.find(
      (product: any) => product.id === productData?.id
    );
  }, [isAuthenticated, basketData, storedProducts]);

  const handleIncreaseQuantity = useCallback(() => {
    if (quantity < productData?.inventory) {
      setQuantity((prev) => prev + 1);
    }
  }, [quantity, productData?.inventory]);

  const handleDecreaseQuantity = useCallback(() => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  }, [quantity]);

  const AddToBasket = async (product: any, quantity: number = 1) => {
    const price =
      product.productDiscounts.length > 0
        ? product.productDiscounts[0].newPrice
        : product.price;
    const addToCartData = {
      user_data: {
        em: [userData?.fetchUsersById.email.toLowerCase()],
        fn: [userData?.fetchUsersById.fullName],
        ph: [userData?.fetchUsersById?.number],
        country: ["tn"],
        external_id: userData?.fetchUsersById.id,
      },
      custom_data: {
        content_name: product.name,
        content_type: "product",
        content_ids: [product.id],
        value: price * quantity,
        currency: "TND",
      },
    };
    const cartEventData = {
      event: "add_to_cart",
      ecommerce: {
        currency: "TND",
        value: price * quantity,
        items: [{
          item_id: product.id,
          item_name: product.name,
          quantity: quantity,
          price: price
        }]
      },
      // User data for both events
      user_data: {
        em: [userData?.fetchUsersById.email.toLowerCase()],
        fn: [userData?.fetchUsersById.fullName],
        ph: [userData?.fetchUsersById?.number],
        country: ["tn"],
        external_id: userData?.fetchUsersById.id
      },
      // Facebook specific data
      facebook_data: {
        content_name: product.name,
        content_type: "product",
        content_ids: [product.id],
        value: price * quantity,
        currency: "TND"
      }
    };
    triggerEvents("AddToCart", addToCartData);
    sendGTMEvent(cartEventData);

    if (isAuthenticated) {
      try {
        const currentBasketQuantity = productsInBasket
          ? productsInBasket.quantity || productsInBasket.actualQuantity
          : 0;

        if (currentBasketQuantity + quantity > product.inventory) {
          toast({
            title: "Quantité non disponible",
            description: `Désolé, nous n'avons que ${product.inventory} unités en stock.`,
            className: "bg-red-600 text-white",
          });
          return;
        }

        await addToBasket({
          variables: {
            input: {
              userId: decodedToken?.userId,
              quantity,
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
              description: `${quantity} ${quantity > 1 ? "unités" : "unité"} de "${product?.name}" ${quantity > 1 ? "ont été ajoutées" : "a été ajoutée"} à votre panier.`,
              className: "bg-primaryColor text-white",
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
      const isProductAlreadyInBasket = storedProducts.some(
        (p: any) => p.id === product?.id
      );
      const filteredProduct = storedProducts.find(
        (p: any) => p.id === product?.id
      );

      if (
        filteredProduct &&
        filteredProduct.actualQuantity + quantity > product.inventory
      ) {
        toast({
          title: "Quantité non disponible",
          description: `Désolé, nous n'avons que ${product.inventory} unités en stock.`,
          className: "bg-red-600 text-white",
        });
        return;
      }

      if (isProductAlreadyInBasket) {
        increaseProductInQtBasket(product.id, quantity);
      } else {
        addProductToBasket({
          ...product,
          price,
          actualQuantity: quantity,
        });
      }

      toast({
        title: "Produit ajouté au panier",
        description: `${quantity} ${quantity > 1 ? "unités" : "unité"} de "${product?.name}" ${quantity > 1 ? "ont été ajoutées" : "a été ajoutée"} à votre panier.`,
        className: "bg-green-600 text-white",
      });

    }
    toggleIsUpdated();
  };
  useEffect(() => {
    setBigImage(productData?.images[0] || "");

    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", moveCursor);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, [productData]);

  if (!mounted || !isOpen) return null;
  return (
    <>
      <div
        onClick={closeProductDetails}
        className={`productData fixed cursor-none z-[11111111] 
          left-0 top-0 transition-all bg-lightBlack h-full flex justify-center items-center w-full
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <IoCloseOutline
          size={40}
          className="animate-pulse invisible lg:visible fixed"
          style={{ top: position.y, left: position.x }}
        />
      </div>

      <div
        className={`fixed overflow-y-auto pb-20 overflow-x-hidden h-5/6 z-[11111600] border 
          left-2/4 -translate-x-2/4 -translate-y-2/4 top-2/4 transition-all bg-white w-11/12 p-8 place-content-center
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <IoCloseOutline
          size={40}
          onClick={closeProductDetails}
          className="absolute bg-white rounded-full p-2  hover:rotate-180 transition-all cursor-pointer -right-0 -top-0"
        />
        <div className="details    flex flex-col justify-center items-start gap-3   lg:flex-row   ">
          <div className="lg:sticky flex justify-center self-center  top-0 lg:top-5 gap-3 z-50  items-center bg-white  text-center">
            <div className="">
              <CustomInnerZoom
                images={productData?.images}
              />
              <span
                className={`absolute top-2 right-2 p-2 ${productData?.inventory > 1 ? "bg-blueColor" : productData?.inventory === 1 ? "bg-gray-400 " : "bg-gray-400"} bg-blue text-xs font-400 text-white`}
              >
                {productData?.inventory > 1
                  ? "EN STOCK"
                  : productData?.inventory === 1
                    ? "DERNIER ARTICLE EN STOCK"
                    : "RUPTURE DE STOCK"}
              </span>
            </div>

          </div>


          <div className="productData lg:w-2/4 w-full ">
            <h2 className="product_name tracking-wider text-2xl font-semibold ">
              {productData?.name}
            </h2>
            <div className="flex flex-col gap-1 mt-4">
              <p className="text-primaryColor tracking-wide text-3xl font-bold">
                {productData?.productDiscounts[0]
                  ? productData?.productDiscounts[0].newPrice.toFixed(3)
                  : productData?.price.toFixed(3)}{" "}
                <span className="text-2xl">TND</span>
                {!productData?.productDiscounts[0] && (
                  <span className="text-sm text-lightBlack ml-2 font-medium">
                    TTC
                  </span>
                )}
              </p>
              {productData?.productDiscounts[0] && (
                <div className="text-gray-400  tracking-wide flex flex-col md:flex-row w-fit md:items-center text-lg gap-2">
                  <p className="line-through text-gray-700 font-semibold tracking-wider">
                    {productData?.productDiscounts[0].price.toFixed(3)} TND
                  </p>
                  <p className="text-sm bg-blue-800 text-white p-1">
                    Économisez{" "}
                    <span className="font-bold ml-1">
                      {(
                        productData?.productDiscounts[0].price -
                        productData?.productDiscounts[0].newPrice
                      ).toFixed(3)}{" "}
                      TND
                    </span>
                  </p>
                  <span className="text-sm text-lightBlack">TTC</span>
                </div>
              )}
            </div>
            <p className=" text-sm font-semibold">
              Reference : <span>{productData?.reference}</span>
            </p>

            <div className="border-t-2 mt-4">
              <div className="flex items-center mt-4  space-x-2">
                <h3 className="text-lg tracking-wider font-bold  capitalize ">
                  Quantité
                </h3>

                <div className="flex items-center gap-2 divide-x-0 overflow-hidden">
                  <button
                    type="button"
                    className="bg-secondaryColor opacity-80 hover:opacity-75 transition-opacity text-white w-fit h-fit p-2 text-sm font-semibold cursor-pointer"
                    disabled={quantity == 1}
                    onClick={handleDecreaseQuantity}
                  >
                    <RiSubtractFill />
                  </button>
                  <button
                    type="button"
                    className="bg-transparent px-4 py-2 h-full border shadow-md font-semibold text-[#333] text-md"
                  >
                    {quantity}
                  </button>
                  <button
                    type="button"
                    className={`${quantity === productData?.inventory ? "opacity-45" : ""} w-fit transition-opacity h-fit bg-secondaryColor text-white p-2 text-sm hover:opacity-75 font-semibold cursor-pointer`}
                    disabled={quantity === productData?.inventory}
                    onClick={handleIncreaseQuantity}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
              <div className="mt-3 ">
                <h3 className="text-lg tracking-wider font-bold capitalize ">
                  Description
                </h3>

                <p
                  className="product-description text-base text-[#000] tracking-wide  border-b-2 border-dashed pb-6"
                  dangerouslySetInnerHTML={{ __html: productData?.description }}
                />
              </div>
              <div className="mt-4">
                {productData?.Colors && (
                  <div
                    className="colors_available w-5 h-5 border-black border-2 shadow-gray-400 shadow-sm"
                    style={{ backgroundColor: productData?.Colors.Hex }}
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col justify-start items-start gap-4 mt-4">
              {/* <p
                className={`text-lg font-semibold flex gap-3 items-center ${productData?.inventory !== undefined && productData.inventory > 0 ? "text-green-600" : "text-red-600"}`}
              >
                {productData?.inventory !== undefined &&
                  productData?.inventory <= 0 ? (
                  <>
                    <IoMdCloseCircleOutline />
                    En Rupture
                  </>
                ) : (
                  "En Stock"
                )}
              </p> */}

              {quantity === productData?.inventory && (
                <div className="flex items-center text-sm gap-3 ">
                  <GoAlertFill color="red" size={20} />
                  <p className="text-red-600 font-semibold tracking-wider">
                    La quantité maximale de produits est de {quantity}.
                  </p>
                </div>
              )}

              <button
                disabled={productData?.inventory <= 0}
                type="button"
                className={`${productData?.inventory <= 0 ? "cursor-not-allowed" : "cursor-pointer"} min-w-[200px] transition-colors flex items-center gap-2 px-4 py-3 bg-primaryColor text-white text-sm lg:text-base rounded-sm font-bold  `}
                onClick={() => {
                  AddToBasket(productData, 1);
                }}
              >
                <SlBasket />
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductInfo;
