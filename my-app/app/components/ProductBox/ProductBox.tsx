import { BASKET_QUERY } from "@/graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useMemo, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ADD_TO_BASKET_MUTATION } from "@/graphql/mutations";
import {
  useAllProductViewStore,
  useBasketStore,
  useProductsInBasketStore,
  usePruchaseOptions,
} from "@/app/store/zustand";
import { useAuth } from "@/app/hooks/useAuth";
import CompactViewDetails from "./CompactViewDetails";
import FullViewDetails from "./FullViewDetails";
import ProductImage from "./ProductImage";
import ProductLabels from "./ProductLabels";
import ProductName from "./ProductName";
import { trackAddToCart } from "@/utils/facebookEvents";

interface ProductBoxProps {
  product: any;
  userData: any;
  index?: number;
  priority?: boolean;
}

const ProductBox: React.FC<ProductBoxProps> = ({
  product,
  userData,
  index,
}) => {
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

  // Set view based on route
  useEffect(() => {
    if (typeof window !== "undefined" && globalThis.location.pathname !== "/Collections/tunisie") {
      changeProductView(3);
    }
  }, [changeProductView]);

  // Find product in basket
  const productInBasket = useMemo(() => {
    if (isAuthenticated && basketData?.basketByUserId) {
      return basketData.basketByUserId.find(
        (item: any) => item.Product.id === product.id
      );
    }
    return storedProducts.find((p: any) => p.id === product.id);
  }, [isAuthenticated, basketData, storedProducts, product.id]);




  // Check inventory availability
  const checkInventory = useCallback((quantity: number) => {
    const currentBasketQuantity = productInBasket
      ? productInBasket.quantity || productInBasket.actualQuantity
      : 0;

    if (currentBasketQuantity + quantity > product.inventory) {
      toast({
        title: "Quantité non disponible",
        description: `Désolé, nous n'avons que ${product.inventory} unités en stock.`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  }, [productInBasket, product.inventory, toast]);

  // Handle authenticated user basket
  const handleAuthenticatedBasket = useCallback(async (quantity: number) => {
    try {
      await addToBasket({
        variables: {
          input: {
            userId: decodedToken?.userId,
            quantity,
            productId: product.id,
          },
        },
        refetchQueries: [{
          query: BASKET_QUERY,
          variables: { userId: decodedToken?.userId },
        }],
        onCompleted: () => {
          toast({
            title: "Produit ajouté au panier",
            description: `${quantity} ${quantity > 1 ? "unités" : "unité"} de "${product?.name}" ${quantity > 1 ? "ont été ajoutées" : "a été ajoutée"} à votre panier.`,
            className: "bg-green-600 text-white border-green-600",
          });
        },
      });
    } catch (error) {
      console.error("Error adding to basket:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'ajout au panier. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  }, [addToBasket, decodedToken?.userId, product.id, product.name, toast]);

  // Handle guest basket
  const handleGuestBasket = useCallback((quantity: number) => {
    const existingProduct = storedProducts.find((p: any) => p.id === product.id);

    if (existingProduct && existingProduct.actualQuantity + quantity > product.inventory) {
      toast({
        title: "Quantité non disponible",
        description: `Désolé, nous n'avons que ${product.inventory} unités en stock.`,
        variant: "destructive",
      });
      return;
    }

    if (existingProduct) {
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
      className: "bg-green-600 text-white border-green-600",
    });
  }, [storedProducts, product, toast, increaseProductInQtBasket, addProductToBasket]);

  // Main add to basket function
  const AddToBasket = useCallback(async (productToAdd: any, quantity: number = 1) => {
    if (!productToAdd) return;

    // Open purchase options modal
    openPruchaseOptions(productToAdd);

    // Check inventory
    if (!checkInventory(quantity)) return;

    // Prepare complete product data for tracking
    const trackingProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      description: product.description,
      Brand: product.Brand,
      Colors: product.Colors,
      categories: product.categories,
      productDiscounts: product.productDiscounts,
      inventory: product.inventory,
      isVisible: product.isVisible,
      reference: product.reference,
      images: product.images,
      quantity: product.actualQuantity || product.quantity,
      technicalDetails: product.technicalDetails,
    };

    // Prepare user data
    const user = userData ? {
      id: decodedToken?.userId,
      email: userData.email,
      firstName: userData.fullName?.split(' ')[0] || userData.fullName,
      lastName: userData.fullName?.split(' ').slice(1).join(' ') || '',
      phone: userData.number,
      country: "tn",
      city: userData.city || "",
    } : undefined;

    // Track the add to cart event with error handling
    try {
      console.log('🛒 Tracking AddToCart event:', {
        product_id: trackingProduct.id,
        product_name: trackingProduct.name,
        quantity: product.actualQuantity || product.quantity,
        user: user ? 'logged_in' : 'guest'
      });

      await trackAddToCart(trackingProduct, user);

      console.log('✅ AddToCart event tracked successfully');
    } catch (error) {
      console.error("❌ Error tracking add to cart:", error);
      // Don't block the user flow if tracking fails
    }


    // Handle basket addition based on auth status
    if (isAuthenticated) {
      await handleAuthenticatedBasket(quantity);
    } else {
      handleGuestBasket(quantity);
    }

    // Update basket state
    toggleIsUpdated();
  }, [
    openPruchaseOptions,
    checkInventory,
    isAuthenticated,
    handleAuthenticatedBasket,
    handleGuestBasket,
    toggleIsUpdated
  ]);

  // View-specific styling with CONSISTENT HEIGHTS
  const containerStyles = useMemo(() => {
    const baseStyles = "relative group bg-white transition-all duration-300 ease-out";
    const hoverStyles = "hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]";

    if (view === 1) {
      return `${baseStyles} ${hoverStyles} h-40 md:h-48 rounded-xl overflow-hidden`;
    }

    return `${baseStyles} ${hoverStyles} h-full rounded-2xl overflow-hidden border border-gray-100`;
  }, [view]);

  const contentStyles = useMemo(() => {
    if (view === 1) {
      return "h-full flex flex-row items-center";
    }
    return "flex flex-col h-full";
  }, [view]);

  const detailsStyles = useMemo(() => {
    if (view === 1) {
      return "flex-1 p-4 flex flex-col justify-center";
    }
    return "flex-1 p-2 flex flex-col justify-between";
  }, [view]);

  const imageContainerStyles = useMemo(() => {
    if (view === 1) {
      return "w-32 md:w-40 h-full flex-shrink-0";
    }
    return "aspect-square w-full flex-shrink-0 overflow-hidden";
  }, [view]);

  return (
    <div className={containerStyles}>
      <div className={contentStyles}>
        <div className={imageContainerStyles}>
          <ProductLabels product={product} />
          <ProductImage
            product={product}
            onAddToBasket={AddToBasket}
            view={view}
            priority={typeof index === "number" ? index === 0 : false}
          />
        </div>

        {/* Product Details with consistent layout */}
        <div className={detailsStyles}>
          {view !== 1 ? (
            <div className="flex flex-col flex-1">
              {/* Product Name - fixed height area */}
              <div className="min-h-[3rem] md:mb-3">
                <ProductName product={product} />
              </div>

              {/* Details section - takes remaining space */}
              <div className="flex-1 flex flex-col justify-center">
                <FullViewDetails
                  product={product}
                  onAddToBasket={AddToBasket}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center h-full">
              <ProductName product={product} />
              <div className="mt-2">
                <CompactViewDetails
                  product={product}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductBox);