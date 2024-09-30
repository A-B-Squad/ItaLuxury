import React, { useEffect, useState, useCallback } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { BASKET_QUERY, FETCH_USER_BY_ID } from "@/graphql/queries";
import { FaRegEye, FaBasketShopping } from "react-icons/fa6";
import { IoGitCompare } from "react-icons/io5";

import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";

import { useToast } from "@/components/ui/use-toast";
import { ADD_TO_BASKET_MUTATION } from "@/graphql/mutations";

import {
  useAllProductViewStore,
  useBasketStore,
  useComparedProductsStore,
  useDrawerBasketStore,
  useProductDetails,
  useProductsInBasketStore,
} from "@/app/store/zustand";
import FavoriteProductButton from "./FavoriteProductButton";
import ProductLabels from "./ProductLabels";
import ProductImage from "./ProductImage";
import ProductName from "./ProductName";
import FullViewDetails from "./FullViewDetails";
import CompactViewDetails from "./CompactViewDetails";
import triggenrEvents from "@/utlils/trackEvents";
import { pushToDataLayer } from "@/utlils/pushToDataLayer";

interface DecodedToken extends JwtPayload {
  userId: string;
}

interface ProductBoxProps {
  product: any;
}

const ProductBox: React.FC<ProductBoxProps> = React.memo(({ product }) => {
  const { toast } = useToast();
  const { view, changeProductView } = useAllProductViewStore();
  const { openBasketDrawer } = useDrawerBasketStore();
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [addToBasket] = useMutation(ADD_TO_BASKET_MUTATION);
  const toggleIsUpdated = useBasketStore((state) => state.toggleIsUpdated);
  const { openProductDetails } = useProductDetails();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const { addProductToCompare, productsInCompare } = useComparedProductsStore(
    (state) => ({
      addProductToCompare: state.addProductToCompare,
      productsInCompare: state.products,
    }),
  );
  const { addProductToBasket, products, increaseProductInQtBasket } =
    useProductsInBasketStore();

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

  const handleAddToBasket = useCallback(async () => {
    // Check if the product quantity in basket exceeds the available inventory
    const existingProduct = products.find((p: any) => p.id === product.id);
    const newQuantity = existingProduct
      ? existingProduct.quantityInBasket + 1
      : 1;

    if (product.inventory <= 0) {
      toast({
        title: "Produit non disponible",
        description: `Le produit "${product?.name}" est actuellement en rupture de stock.`,
        className: "bg-red-500 text-white",
      });
      return;
    }

    if (newQuantity > product.inventory) {
      toast({
        title: "Quantité non disponible",
        description: `Il ne reste que ${product.inventory} ${product.inventory > 1 ? "unités" : "unité"} de "${product?.name}" en stock.`,
        className: "bg-red-500 text-white",
      });
      return;
    }

    if (decodedToken) {
      addToBasket({
        variables: {
          input: {
            userId: decodedToken?.userId,
            quantity: 1,
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
            title: "Notification de Panier",
            description: `Le produit "${product?.name}" a été ajouté au panier.`,
            className: "bg-primaryColor text-white",
          });
          // Track Add to Cart
          triggenrEvents("AddToCart", {
            user_data: {
              em: [userData?.fetchUsersById.email.toLowerCase()],
              fn: [userData?.fetchUsersById.fullName],
              ph: [userData?.fetchUsersById?.number.join("")],
              country: ["tn"],
              external_id: userData?.fetchUsersById.id,
            },
            custom_data: {
              content_name: product.name,
              content_type: "product",
              currency: "TND",
              content_ids: [product.id],
              value:
                product.productDiscounts.length > 0
                  ? product.productDiscounts[0].newPrice
                  : product.price,
            },
          });
          pushToDataLayer("AddToCart");
        },
      });
    } else {
      if (!products.some((p: any) => p.id === product.id)) {
        addProductToBasket({
          ...product,
          price:
            product.productDiscounts.length > 0
              ? product?.productDiscounts[0]?.newPrice
              : product?.price,
          actualQuantity: 1,
        });

        toast({
          title: "Notification de Panier",
          description: `Le produit "${product?.name}" a été ajouté au panier.`,
          className: "bg-primaryColor text-white",
        });
      } else {
        increaseProductInQtBasket(product.id);

        toast({
          title: "Notification de Panier",
          description: `Product is already in the basket`,
          className: "bg-primaryColor text-white",
        });
      }
      // Track Add to Cart
      triggenrEvents("AddToCart", {
        user_data: {
          em: [userData?.fetchUsersById.email.toLowerCase()],
          fn: [userData?.fetchUsersById.fullName],
          ph: [userData?.fetchUsersById?.number.join("")],
          country: ["tn"],
          external_id: userData?.fetchUsersById.id,
        },

        custom_data: {
          content_name: product.name,
          content_type: "product",
          currency: "TND",
          content_ids: [product.id],
          contents: product,
          value:
            product.productDiscounts.length > 0
              ? product.productDiscounts[0].newPrice
              : product.price,
        },
      });
      pushToDataLayer("AddToCart");
    }

    toggleIsUpdated();
  }, [
    decodedToken,
    product,
    addToBasket,
    addProductToBasket,
    products,
    toggleIsUpdated,
    openBasketDrawer,
    toast,
    triggenrEvents,
  ]);

  const handleAddToCompare = useCallback(() => {
    const isProductAlreadyInCompare = productsInCompare.some(
      (p: any) => p.id === product.id,
    );
    if (!isProductAlreadyInCompare) {
      addProductToCompare(product);
    } else {
      toast({
        title: "Produit ajouté à la comparaison",
        description: `Le produit "${product?.name}" a été ajouté à la comparaison.`,
        className: "bg-primaryColor text-white",
      });
    }
  }, [product, productsInCompare, addProductToCompare, toast]);

  interface QuickActionButtonProps {
    icon: React.ReactNode;
    onClick: () => void;
    title: string;
    disabled?: boolean;
  }

  const QuickActionButton: React.FC<QuickActionButtonProps> = ({
    icon,
    onClick,
    title,
    disabled = false,
  }) => (
    <div
      className={`relative w-fit cursor-crosshair ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      title={title}
      onClick={!disabled ? onClick : undefined}
    >
      <li
        className={`bg-primaryColor rounded-full delay-100 lg:translate-x-20 group-hover:translate-x-0 transition-all p-2 shadow-md hover:bg-secondaryColor ${disabled ? "opacity-50" : ""}`}
      >
        {icon}
      </li>
    </div>
  );

  return (
    <div
      className={`product-box w-full relative group  flex items-center h-[365px]  bg-white  ${view === 1 ? " flex-row" : "flex-col  justify-around"}  `}
    >
      {/* Quick action buttons */}
      <ul
        className={`plus_button h-fit absolute ${view === 1 ? " top-[85px] lg:top-24 right-5   flex lg:flex-col" : "flex  bottom-36  lg:bottom-full lg:left-[85%] lg:flex-col lg:top-12"} items-center lg:opacity-0 lg:group-hover:opacity-100   z-30 justify-between gap-2  md:gap-3`}
      >
        <QuickActionButton
          icon={<FaRegEye color="white" />}
          onClick={() => openProductDetails(product)}
          title="aperçu rapide"
        />
        <QuickActionButton
          icon={<FaBasketShopping color="white" />}
          onClick={handleAddToBasket}
          title="Ajouter au panier"
          disabled={product.inventory <= 0}
        />
        <QuickActionButton
          icon={<IoGitCompare color="white" />}
          onClick={handleAddToCompare}
          title="Ajouter au comparatif"
        />
        <FavoriteProductButton
          isFavorite={isFavorite}
          setIsFavorite={setIsFavorite}
          productId={product?.id}
          userId={decodedToken?.userId}
          productName={product?.name}
        />
      </ul>

      {/* Product labels */}
      <ProductLabels product={product} />

      {/* Product image */}
      <ProductImage product={product} />

      {/* Product details */}
      <div className={`${view !== 1 ? "border-t" : ""} mt-4 px-2  w-full`}>
        <ProductName product={product} />
        {view !== 1 ? (
          <FullViewDetails
            product={product}
            onAddToBasket={handleAddToBasket}
          />
        ) : (
          <CompactViewDetails product={product} />
        )}
      </div>
    </div>
  );
});

export default ProductBox;
