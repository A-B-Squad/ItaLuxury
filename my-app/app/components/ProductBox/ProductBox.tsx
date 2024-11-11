import { BASKET_QUERY, FETCH_USER_BY_ID } from "@/graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useMemo, useState } from "react";


import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";

import { useToast } from "@/components/ui/use-toast";
import { ADD_TO_BASKET_MUTATION } from "@/graphql/mutations";

import {
  useAllProductViewStore,
  useBasketStore,
  useProductsInBasketStore,
  usePruchaseOptions
} from "@/app/store/zustand";
import { pushToDataLayer } from "@/utlils/pushToDataLayer";
import triggerEvents from "@/utlils/trackEvents";
import CompactViewDetails from "./CompactViewDetails";
import FullViewDetails from "./FullViewDetails";
import ProductImage from "./ProductImage";
import ProductLabels from "./ProductLabels";
import ProductName from "./ProductName";

interface DecodedToken extends JwtPayload {
  userId: string;
}

interface ProductBoxProps {
  product: any;
}

const ProductBox: React.FC<ProductBoxProps> = React.memo(({ product }) => {
  const { toast } = useToast();
  const { view, changeProductView } = useAllProductViewStore();
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [addToBasket] = useMutation(ADD_TO_BASKET_MUTATION);

  const toggleIsUpdated = useBasketStore((state) => state.toggleIsUpdated);
  const { data: basketData } = useQuery(BASKET_QUERY, {
    variables: { userId: decodedToken?.userId },
    skip: !decodedToken?.userId
  });

  const {
    products: storedProducts,
    addProductToBasket,
    increaseProductInQtBasket
  } = useProductsInBasketStore();
  const { openPruchaseOptions } = usePruchaseOptions();

  const { data: userData } = useQuery(FETCH_USER_BY_ID, {
    variables: {
      userId: decodedToken?.userId,
    },
    skip: !decodedToken?.userId,
  });

  useEffect(() => {
    if (window.location.pathname !== "/Collections/tunisie") {
      changeProductView(3);
    }
  }, [window.location]);
  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
  }, []);


  const productInBasket = useMemo(() => {
    if (decodedToken?.userId && basketData?.basketByUserId) {
      return basketData.basketByUserId.find(
        (item: any) => item.Product.id === product.id
      );
    }
    return storedProducts.find((product: any) => product.id === product.id);
  }, [decodedToken, basketData, storedProducts, product.id]);



  const AddToBasket = async (product: any, quantity: number = 1) => {
    openPruchaseOptions(product)

    const price = product.productDiscounts.length > 0
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

    if (decodedToken) {
      try {
        const currentBasketQuantity = productInBasket
          ? productInBasket.quantity || productInBasket.actualQuantity
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
            triggerEvents("AddToCart", addToCartData);
            pushToDataLayer("AddToCart");
          },
        });
      } catch (error) {
        console.error("Error adding to basket:", error);
        toast({
          title: "Erreur",
          description: "Une erreur s'est produite lors de l'ajout au panier. Veuillez réessayer.",
          className: "bg-red-600 text-white",
        });
      }
    } else {
      const isProductAlreadyInBasket = storedProducts.some((p: any) => p.id === product?.id);
      const filteredProduct = storedProducts.find((p: any) => p.id === product?.id);

      if (filteredProduct && filteredProduct.actualQuantity + quantity > product.inventory) {
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
      triggerEvents("AddToCart", addToCartData);
      pushToDataLayer("AddToCart");
    }
    toggleIsUpdated();
  };


  return (
    <>
      <div
        className={`product-box w-full relative group  flex items-center overflow-hidden    ${view === 1 ? " justify-start h-[215px]" : "justify-center h-[344px]"}    bg-white    `}
      >

        {/* Product labels */}
        <ProductLabels product={product} />

        <div className={`product flex   ${view === 1 ? " flex-row" : "flex-col  "} `}>

          {/* Product image */}
          <ProductImage product={product} onAddToBasket={AddToBasket} decodedToken={decodedToken} view={view} />

          {/* Product details */}
          <div className={`${view !== 1 ? "border-t" : ""} mt-2 px-4 lg:px-2  w-full`}>
            <ProductName product={product} />
            {view !== 1 ? (
              <FullViewDetails
                product={product}
                onAddToBasket={AddToBasket}
              />
            ) : (
              <CompactViewDetails product={product} />
            )}
          </div>
        </div>

      </div>
    </>

  );
});

export default ProductBox;
