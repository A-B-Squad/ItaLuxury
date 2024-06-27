import React, { useEffect, useState, useCallback } from "react";
import { useMutation } from "@apollo/client";
import { BASKET_QUERY } from "@/graphql/queries";
import { FaRegEye, FaBasketShopping } from "react-icons/fa6";
import { SlBasket } from "react-icons/sl";
import { IoGitCompare } from "react-icons/io5";
import Link from "next/link";
import Image from "next/legacy/image";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";

import { useToast } from "@/components/ui/use-toast";
import { ADD_TO_BASKET_MUTATION } from "@/graphql/mutations";
import FavoriteProduct from "../ProductCarousel/FavoriteProduct";
import calcDateForNewProduct from "../../Helpers/_calcDateForNewProduct";
import prepRoute from "@/app/Helpers/_prepRoute";
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

interface DecodedToken extends JwtPayload {
  userId: string;
}

interface ProductBoxProps {
  product: any;
}

const ProductBox: React.FC<ProductBoxProps> = React.memo(({ product }) => {
  const { toast } = useToast();
  const { view } = useAllProductViewStore();
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
    })
  );
  const { addProductToBasket, products } = useProductsInBasketStore();

  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
  }, []);

  const handleAddToBasket = useCallback(() => {
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
        },
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
  }, [
    decodedToken,
    product,
    addToBasket,
    addProductToBasket,
    products,
    toggleIsUpdated,
    openBasketDrawer,
    toast,
  ]);

  const handleAddToCompare = useCallback(() => {
    const isProductAlreadyInCompare = productsInCompare.some(
      (p: any) => p.id === product.id
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
  }

  const QuickActionButton: React.FC<QuickActionButtonProps> = ({
    icon,
    onClick,
    title,
  }) => (
    <div
      className="relative w-fit cursor-crosshair"
      title={title}
      onClick={onClick}
    >
      <li className="bg-primaryColor rounded-full delay-100 lg:translate-x-20 group-hover:translate-x-0 transition-all p-2 shadow-md hover:bg-secondaryColor">
        {icon}
      </li>
    </div>
  );

  return (
    <div className={`product-box w-full h-full flex  ${view===1 ?" flex-row":"flex-col  justify-around"}  `}>
      {/* Quick action buttons */}
      <ul
        className={`plus_button ${view === 1 ? "top-5 hidden md:flex" : "flex top-14"} items-center lg:opacity-0 group-hover:opacity-100 absolute right-3 z-30 justify-between flex-col gap-3`}
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
      <div className={`${view !== 1 ? "border-t" : ""} mt-4 px-2 pb-5 w-full`}>
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

ProductBox.displayName = "ProductBox";

export default ProductBox;

// Helper components (QuickActionButton, ProductLabels, ProductImage, ProductName, FullViewDetails, CompactViewDetails)
// should be implemented separately for better organization
