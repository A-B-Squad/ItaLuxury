"use client";

import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "@apollo/client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ADD_DELETE_PRODUCT_FAVORITE_MUTATION,
  ADD_TO_BASKET_MUTATION,
} from "../../../../graphql/mutations";
import {
  BASKET_QUERY,
  TAKE_16_PRODUCTS_BY_CATEGORY,
} from "../../../../graphql/queries";
import Breadcumb from "../../../components/Breadcumb";
import {
  useBasketStore,
  useProductComparisonStore,
  useProductsInBasketStore,
} from "../../../store/zustand";

import Loading from "./loading";

const ProductTabs = dynamic(
  () => import("@/app/components/ProductCarousel/productTabs"),
  {
    loading: () => (
      <div className="h-[300px] animate-pulse bg-gray-100 rounded-md" />
    ),
    ssr: true,
  }
);

const TitleProduct = dynamic(
  () => import("@/app/components/ProductCarousel/titleProduct"),
  {
    ssr: true,
  }
);

const ProductDetailsDrawer = dynamic(
  () => import("./Components/productDetailsDrawer"),
  {
    ssr: false,
  }
);

import { useAuth } from "@/app/hooks/useAuth";
import ActionButton from "./Components/ActionButton";
import CustomInnerZoom from "./Components/CustomInnerZoom";
import ProductDetailsContainer from "./Components/ProductDetailsContainer";
import ProductInfo from "./Components/ProductInfo";
import { trackAddToCart, trackViewContent } from "@/utils/facebookEvents";
import BundlePromotions from "./Components/BundlePromotions";

const ProductDetailsSection = ({ productDetails, slug, userData }: any) => {
  const { toast } = useToast();

  const [smallImages, setSmallImages] = useState<any>(null);
  const { decodedToken, isAuthenticated } = useAuth();
  const [discount, setDiscount] = useState<any>(null);
  const [technicalDetails, setTechnicalDetails] = useState<any>(null);
  const [showQuantityMessage, setShowQuantityMessage] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);

  const [addToBasket] = useMutation(ADD_TO_BASKET_MUTATION);

  // useEffect to handle scroll
  useEffect(() => {
    const handleScroll = () => {
      if (globalThis.scrollY >= 4000) {
        setShowQuantityMessage(true);
      } else {
        setShowQuantityMessage(false);
      }
    };

    globalThis.addEventListener('scroll', handleScroll);
    return () => globalThis.removeEventListener('scroll', handleScroll);
  }, []);

  const { loading: loadingProductByCategiry, data: Products_10_by_category } =
    useQuery(TAKE_16_PRODUCTS_BY_CATEGORY, {
      variables: {
        limit: 16,
        categoryName: productDetails?.categories[1]?.name,
      },
      skip: typeof window === 'undefined',
      fetchPolicy: 'cache-first'
    });

  const { data: basketData } = useQuery(BASKET_QUERY, {
    variables: { userId: decodedToken?.userId },
    skip: !isAuthenticated,
  });

  const { addToComparison, comparisonList } = useProductComparisonStore();

  const isProductInCompare = useMemo(
    () => comparisonList.some((p: any) => p.id === productDetails?.id),
    [comparisonList, productDetails?.id]
  );

  const {
    products: storedProducts,
    addProductToBasket,
    increaseProductInQtBasket,
  } = useProductsInBasketStore();

  useEffect(() => {
    globalThis.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!productDetails?.id) return;

    const trackingProduct = {
      id: productDetails.id,
      name: productDetails.name,
      slug: productDetails.slug,
      price: Number(productDetails.price),
      description: productDetails.description,
      Brand: productDetails.Brand,
      Colors: productDetails.Colors,
      categories: productDetails.categories,
      productDiscounts: productDetails.productDiscounts,
      inventory: productDetails.inventory,
      isVisible: productDetails.isVisible,
      reference: productDetails.reference,
      images: productDetails.images,
      technicalDetails: productDetails.technicalDetails,
    };

    const user = userData ? {
      id: decodedToken?.userId,
      email: userData.email,
      firstName: userData.fullName?.split(' ')[0] || userData.fullName,
      lastName: userData.fullName?.split(' ').slice(1).join(' ') || '',
      phone: userData.number,
      country: "tn",
      city: userData.city || "",
    } : undefined;

    console.log('👀 Tracking ViewContent event:', {
      product_id: trackingProduct.id,
      product_name: trackingProduct.name,
      has_images: !!trackingProduct.images?.length,
      user: user ? 'logged_in' : 'guest'
    });

    trackViewContent(trackingProduct, user)
      .then(() => {
        console.log('✅ ViewContent event tracked successfully');
      })
      .catch(error => {
        console.error("❌ Error tracking view content:", error);
      });

    if (productDetails.productDiscounts?.[0]) {
      setDiscount(productDetails.productDiscounts[0]);
    }
    setTechnicalDetails(productDetails.technicalDetails);
    if (productDetails?.images) {
      setSmallImages(productDetails.images);
    }
  }, [productDetails, slug, userData, decodedToken]);

  const productInBasket = useMemo(() => {
    if (decodedToken?.userId && basketData?.basketByUserId) {
      return basketData.basketByUserId.find(
        (item: any) => item.Product.slug === slug
      );
    }
    return storedProducts.find((product: any) => product.slug === slug);
  }, [decodedToken, slug, basketData, storedProducts]);

  const toggleIsUpdated = useBasketStore((state) => state.toggleIsUpdated);
  const [addToFavorite] = useMutation(ADD_DELETE_PRODUCT_FAVORITE_MUTATION);

  // Helper: Prepare tracking product data
  const prepareTrackingProduct = useCallback((product: any) => ({
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
  }), []);

  // Helper: Prepare user data
  const prepareUserData = useCallback(() => {
    if (!userData) return undefined;

    return {
      id: decodedToken?.userId,
      email: userData.email,
      firstName: userData.fullName?.split(' ')[0] || userData.fullName,
      lastName: userData.fullName?.split(' ').slice(1).join(' ') || '',
      phone: userData.number,
      country: "tn",
      city: userData.city || "",
    };
  }, [userData, decodedToken]);

  // Helper: Track add to cart event
  const trackAddToCartEvent = useCallback(async (trackingProduct: any, user: any) => {
    try {
      console.log('🛒 Tracking AddToCart event:', {
        product_id: trackingProduct.id,
        product_name: trackingProduct.name,
        quantity: trackingProduct.quantity,
        user: user ? 'logged_in' : 'guest'
      });

      await trackAddToCart(trackingProduct, user);
      console.log('✅ AddToCart event tracked successfully');
    } catch (error) {
      console.error("❌ Error tracking add to cart:", error);
    }
  }, []);

  // Helper: Check inventory and show error
  const checkInventoryAvailability = useCallback((currentQty: number, requestedQty: number, inventory: number) => {
    if (currentQty + requestedQty > inventory) {
      if (showQuantityMessage) {
        toast({
          title: "Quantité non disponible",
          description: `Désolé, nous n'avons que ${inventory} unités en stock.`,
          className: "bg-red-600 text-white",
        });
      }
      return false;
    }
    return true;
  }, [showQuantityMessage, toast]);

  // Helper: Show error toast
  const showErrorToast = useCallback(() => {
    toast({
      title: "Erreur",
      description: "Une erreur s'est produite lors de l'ajout au panier. Veuillez réessayer.",
      className: "bg-red-600 text-white",
    });
  }, [toast]);

  // Helper: Show success toast
  const showSuccessToast = useCallback((productName: string, qty: number) => {
    const unit = qty > 1 ? "unités" : "unité";
    const verb = qty > 1 ? "ont été ajoutées" : "a été ajoutée";

    toast({
      title: "Produit ajouté au panier",
      description: `${qty} ${unit} de "${productName}" ${verb} à votre panier.`,
      className: "bg-green-600 text-white",
    });
  }, [toast]);

  // Helper: Handle authenticated user basket addition
  const handleAuthenticatedBasketAdd = useCallback(async (product: any) => {
    const currentBasketQuantity = productInBasket
      ? productInBasket.quantity || productInBasket.actualQuantity
      : 0;

    if (!checkInventoryAvailability(currentBasketQuantity, quantity, product.inventory)) {
      return;
    }

    try {
      await addToBasket({
        variables: {
          input: {
            userId: decodedToken?.userId,
            quantity: quantity,
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
    } catch (error) {
      console.error("Error adding to basket:", error);
      showErrorToast();
    }
  }, [productInBasket, quantity, decodedToken, addToBasket, checkInventoryAvailability, showErrorToast]);

  // Helper: Handle guest user basket addition
  const handleGuestBasketAdd = useCallback((product: any) => {
    const filteredProduct = storedProducts.find((p: any) => p.id === product?.id);
    const currentQuantity = filteredProduct?.actualQuantity || 0;

    if (currentQuantity >= product.inventory || currentQuantity + quantity >= product.inventory) {
      toast({
        title: "Quantité non disponible",
        description: `Désolé, nous n'avons que ${product.inventory} unités en stock.`,
        className: "bg-red-600 text-white",
      });
      return;
    }

    if (filteredProduct) {
      increaseProductInQtBasket(product.id, quantity);
    } else {
      addProductToBasket({
        ...product,
        price: product.price,
        discountedPrice: product.productDiscounts.length > 0 ? product.productDiscounts : null,
        actualQuantity: quantity,
      });
    }

    showSuccessToast(productDetails?.name, quantity);
  }, [storedProducts, quantity, productDetails, increaseProductInQtBasket, addProductToBasket, toast, showSuccessToast]);

  const AddToBasket = useCallback(async (product: any) => {
    const trackingProduct = prepareTrackingProduct(product);
    const user = prepareUserData();

    await trackAddToCartEvent(trackingProduct, user);

    if (decodedToken) {
      await handleAuthenticatedBasketAdd(product);
    } else {
      handleGuestBasketAdd(product);
    }

    toggleIsUpdated();
  }, [
    prepareTrackingProduct,
    prepareUserData,
    trackAddToCartEvent,
    decodedToken,
    handleAuthenticatedBasketAdd,
    handleGuestBasketAdd,
    toggleIsUpdated
  ]);

  const handleIncreaseQuantity = useCallback(() => {
    if (quantity < productDetails.inventory) {
      setQuantity((prev) => prev + 1);
    }
  }, [quantity, productDetails.inventory]);

  const handleDecreaseQuantity = useCallback(() => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  }, [quantity]);

  const categoryNames = useMemo(() =>
    productDetails?.categories?.map((cat: { name: string }) => cat.name),
    [productDetails?.categories]
  );

  const categoriesPath = useMemo(() => [
    { href: "/", label: "Accueil" },
    ...categoryNames.map((category: string) => ({
      href: `/Collections?${new URLSearchParams({
        category: category,
      })}`,
      label: String(category),
    })),
    {
      href: `/products/${productDetails.slug}`,
      label: productDetails?.name,
    },
  ], [categoryNames, productDetails?.id, productDetails?.name]);

  const handleToggleFavorite = useCallback(() => {
    if (decodedToken?.userId) {
      const userId = decodedToken.userId;

      addToFavorite({
        variables: {
          input: { userId, productId: productDetails.id }
        },
        onCompleted: () => {
          toast({
            title: "Produit ajouté aux favoris",
            description: `Le produit "${productDetails?.name}" a été ajouté à vos favoris.`,
            className: "bg-primaryColor text-white",
          });
        },
        onError: (error) => {
          toast({
            title: "Erreur",
            description: `Une erreur est survenue en ajoutant le produit "${productDetails?.name}" aux favoris.`,
            className: "bg-red-500 text-white",
          });
        },
      });
    } else {
      toast({
        title: "Veuillez vous connecter",
        description:
          "Vous devez être connecté pour ajouter ce produit à vos favoris.",
        className: "bg-yellow-500 text-black",
      });
    }
  }, [
    decodedToken?.userId,
    slug,
    productDetails?.name,
    addToFavorite,
    toast,
  ]);

  const addToCompare = useCallback(
    (product: any) => {
      const isProductAlreadyInCompare = comparisonList.some(
        (p: any) => p.id === product.id
      );

      if (!isProductAlreadyInCompare) {
        addToComparison(product);
      } else {
        toast({
          title: "Produit ajouté à la comparaison",
          description: `Le produit "${productDetails?.name}" a été ajouté à la comparaison.`,
          className: "bg-primaryColor text-white",
        });
      }
    },
    [comparisonList, addToComparison, productDetails?.name, toast]
  );

  return (
    <div className="productDetails container relative  bg-gray-50 w-full mx-auto md:px-4 ">
      {!productDetails ? (
        <Loading />
      ) : (
        <div className=" space-y-6 w-full ">
          <Breadcumb Path={categoriesPath} />

          <div className=" flex flex-col lg:flex-row items-start mx-auto  w-full bg-white py-8 md:p-6 border border-gray-200 rounded-lg shadow-sm">

            <div className="lg:sticky  top-0 lg:top-5 gap-3   bg-white w-full text-center">
              <div className="relative">
                <CustomInnerZoom images={smallImages} />
                <span
                  className={`absolute top-2 right-2 p-2 rounded-md ${productDetails?.inventory > 1
                    ? "bg-green-600"
                    : productDetails?.inventory === 1
                      ? "bg-amber-500"
                      : "bg-red-500"
                    } text-xs font-medium text-white`}
                >
                  {productDetails?.inventory > 1
                    ? "EN STOCK"
                    : productDetails?.inventory === 1
                      ? "DERNIER ARTICLE EN STOCK"
                      : "RUPTURE DE STOCK"}
                </span>
              </div>
            </div>

            <ProductInfo
              userData={userData}
              productDetails={productDetails}
              technicalDetails={technicalDetails}
              userId={decodedToken?.userId}
              discount={discount}
              productId={productDetails.id}
              AddToBasket={AddToBasket}
              quantity={quantity}
              handleIncreaseQuantity={handleIncreaseQuantity}
              handleDecreaseQuantity={handleDecreaseQuantity}
            />

            <div className="hidden lg:block lg:w-[90%] lg:max-w-[300px]">
              <BundlePromotions
                price={productDetails?.price}
                productName={productDetails?.name}
                productRef={productDetails?.reference}
                currentQuantity={quantity}
              />
              <ActionButton
                productDetails={productDetails}
                AddToBasket={AddToBasket}
                quantity={quantity}
                handleIncreaseQuantity={handleIncreaseQuantity}
                handleDecreaseQuantity={handleDecreaseQuantity}
                handleToggleFavorite={handleToggleFavorite}
                isProductInCompare={isProductInCompare}
                addToCompare={addToCompare}
              />


            </div>
          </div>

        </div>
      )}

      <ProductDetailsContainer
        productId={productDetails.id}
        userId={decodedToken?.userId}
        toast={toast}
        technicalDetails={technicalDetails}
      />

      <div className="bg-white border border-gray-200 rounded-lg  shadow-sm px-4 py-6 mt-8 ">
        <TitleProduct title={"Produits apparentés"} />
        <div className="py-2">
          <ProductTabs
            data={Products_10_by_category?.productsByCategory}
            loadingProduct={loadingProductByCategiry}
            userData={userData}
            className={"basis-1/2 md:basis-1/5 lg:basis-1/5"}
          />
        </div>
      </div>

      <ProductDetailsDrawer
        productDetails={productDetails}
        addToBasket={AddToBasket}
        discount={discount}
        quantity={quantity}
        handleIncreaseQuantity={handleIncreaseQuantity}
        handleDecreaseQuantity={handleDecreaseQuantity}
      />
    </div>
  );
};

export default ProductDetailsSection;