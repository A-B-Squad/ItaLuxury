import { BASKET_QUERY, FETCH_USER_BY_ID } from "@/graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useMemo } from "react";

import { useToast } from "@/components/ui/use-toast";
import { ADD_TO_BASKET_MUTATION } from "@/graphql/mutations";

import {
  useAllProductViewStore,
  useBasketStore,
  useProductsInBasketStore,
  usePruchaseOptions,
} from "@/app/store/zustand";
import { useAuth } from "@/lib/auth/useAuth";
import triggerEvents from "@/utlils/trackEvents";
import { sendGTMEvent } from "@next/third-parties/google";
import CompactViewDetails from "./CompactViewDetails";
import FullViewDetails from "./FullViewDetails";
import ProductImage from "./ProductImage";
import ProductLabels from "./ProductLabels";
import ProductName from "./ProductName";


interface ProductBoxProps {
  product: any;
}

const ProductBox: React.FC<ProductBoxProps> = React.memo(({ product }) => {
  const { toast } = useToast();
  const { view, changeProductView } = useAllProductViewStore();
  const { decodedToken, isAuthenticated } = useAuth();
  const [addToBasket] = useMutation(ADD_TO_BASKET_MUTATION);

  const toggleIsUpdated = useBasketStore((state) => state.toggleIsUpdated);
  const { data: basketData } = useQuery(BASKET_QUERY, {
    variables: { userId: decodedToken?.userId },
    skip: !isAuthenticated,
  });

  const {
    products: storedProducts,
    addProductToBasket,
    increaseProductInQtBasket,
  } = useProductsInBasketStore();
  const { openPruchaseOptions } = usePruchaseOptions();

  const { data: userData } = useQuery(FETCH_USER_BY_ID, {
    variables: {
      userId: decodedToken?.userId,
    },
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (window.location.pathname !== "/Collections/tunisie") {
      changeProductView(3);
    }
  }, [window.location]);


  const productInBasket = useMemo(() => {
    if (isAuthenticated && basketData?.basketByUserId) {
      return basketData.basketByUserId.find(
        (item: any) => item.Product.id === product.id
      );
    }
    return storedProducts.find((product: any) => product.id === product.id);
  }, [isAuthenticated, basketData, storedProducts, product.id]);




  const AddToBasket = async (product: any, quantity: number = 1) => {
    if (!product) return

    openPruchaseOptions(product);

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
        ct: "",
        external_id: decodedToken?.userId,
      },
      custom_data: {
        content_name: product.name,
        content_type: "product",
        content_ids: [product.id],
        currency: "TND",
        contents: [
          {
            id: product.id,
            quantity: product.actualQuantity || product.quantity,
            item_price: product.productDiscounts?.length
              ? parseFloat(product.productDiscounts[0].newPrice.toFixed(3))
              : parseFloat(product.price.toFixed(3))
          }
        ],
        value: price * quantity,
        content_category: product.categories?.[0]?.name || '',
      },
    };


    triggerEvents("AddToCart", addToCartData);
    sendGTMEvent({
      event: "add_to_cart",
      ecommerce: {
        currency: "TND",
        value: price * quantity,
        items: [{
          item_id: product.id,
          item_name: product.name,
          quantity: product.actualQuantity || product.quantity,
          price: price
        }]
      },
      user_data: {
        em: [userData?.fetchUsersById.email.toLowerCase()],
        fn: [userData?.fetchUsersById.fullName],
        ph: [userData?.fetchUsersById?.number],
        country: ["tn"],
        external_id: userData?.fetchUsersById.email.id
      },
      facebook_data: {
        content_name: product.name,
        content_type: "product",
        content_ids: [product.id],
        contents: [
          {
            id: product.id,
            quantity: product.actualQuantity || product.quantity,
            item_price: product.productDiscounts?.length
              ? parseFloat(product.productDiscounts[0].newPrice.toFixed(3))
              : parseFloat(product.price.toFixed(3))
          }
        ],
        value: price * quantity,
        currency: "TND"
      }
    });

    if (isAuthenticated) {
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
          price: product.price,
          discountedPrice: product.productDiscounts.length > 0 ? product.productDiscounts : null,
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


  return (
    <div className={`
      relative group   transition-all duration-300
      transform hover:scale-105  hover:shadow-lg
      ${view === 1 ? 'h-[180px] md:h-[200px]' : '  h-full max-h-[396px]]'}
      w-full overflow-hidden
      bg-white
    `}>
      <ProductLabels product={product} />

      <div className={`
          h-full w-full flex  
          ${view === 1 ? 'flex-row items-center' : 'flex-col'}
        `}>
        <ProductImage
          product={product}
          onAddToBasket={AddToBasket}
          decodedToken={decodedToken}
          view={view}
        />

        <div className={`
        relative
            flex-1 px-2
            ${view !== 1 ? 'border-t border-gray-100' : ''}
          `}>
          <ProductName product={product} />
          {view !== 1 ? (
            <FullViewDetails product={product} />
          ) : (
            <CompactViewDetails product={product} />
          )}
        </div>
      </div>
    </div>
  );
});

export default ProductBox;
