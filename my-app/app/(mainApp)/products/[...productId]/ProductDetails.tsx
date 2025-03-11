"use client";

import { useToast } from "@/components/ui/use-toast";
import triggerEvents from "@/utlils/trackEvents";
import { useMutation, useQuery } from "@apollo/client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ADD_DELETE_PRODUCT_FAVORITE_MUTATION,
  ADD_TO_BASKET_MUTATION,
} from "../../../../graphql/mutations";
import {
  BASKET_QUERY,
  FETCH_USER_BY_ID,
  TAKE_10_PRODUCTS_BY_CATEGORY,
} from "../../../../graphql/queries";
import Breadcumb from "../../../components/Breadcumb";
import {
  useBasketStore,
  useProductComparisonStore,
  useProductsInBasketStore,
  usePruchaseOptions,
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

// Pre-fetch critical components
const ProductInfo = dynamic(() => import("./Components/ProductInfo"), {
  ssr: true,
});


// Defer non-critical components
const ProductDetailsDrawer = dynamic(
  () => import("./Components/productDetailsDrawer"),
  {
    ssr: false,
  }
);

import CustomInnerZoom from "./Components/CustomInnerZoom";
import ActionButton from "./Components/ActionButton";
import ProductAttrLaptop from "./Components/ProductAttrLaptop";
import { sendGTMEvent } from "@next/third-parties/google";
import { useAuth } from "@/lib/auth/useAuth";


const ProductDetails = ({ productDetails, productId }: any) => {
  const { toast } = useToast();

  const mainImage = useMemo(
    () => productDetails?.images[0] || "",
    [productDetails]
  );

  const [smallImages, setSmallImages] = useState<any>(null);
  const { decodedToken, isAuthenticated } = useAuth();
  const [discount, setDiscount] = useState<any>(null);
  const [attributes, setAttributes] = useState<any>(null);

  const [quantity, setQuantity] = useState<number>(1);


  const [addToBasket] = useMutation(ADD_TO_BASKET_MUTATION);

  const { loading: loadingProductByCategiry, data: Products_10_by_category } =
    useQuery(TAKE_10_PRODUCTS_BY_CATEGORY, {
      variables: {
        limit: 10,
        categoryName: productDetails?.categories[1]?.name,
      },
    });

  // Query the basket first

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


  // Fixed store destructuring to match actual property names
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
    if (productDetails?.images) {
      setSmallImages(productDetails.images);
    }
  }, [productDetails]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const {
      name,
      id,
      price,
      productDiscounts,
      categories,
      Brand,
      inventory,
      description,
      Colors,
      attributes,
    } = productDetails;

    const discount = productDiscounts?.[0];
    const brandName = Brand?.name || "Unknown Brand";
    const colorName = Colors?.color || "No Color";
    const finalPrice = discount?.newPrice ?? price;
    const reference = productDetails.reference;

    sendGTMEvent({
      event: "view_item",
      ecommerce: {
        currency: "TND",
        value: finalPrice,
        items: [{
          item_id: id,
          item_name: name,
          item_brand: brandName,
          item_category: categories[0]?.name,
          item_category2: categories[1]?.name,
          item_category3: categories[2]?.name,
          item_variant: colorName,
          price: price,
          quantity: 1
        }]
      },
      user_data: {
        em: [userData?.fetchUsersById.email.toLowerCase()],
        fn: [userData?.fetchUsersById.fullName],
        ph: [userData?.fetchUsersById?.number],
        country: ["tn"],
        ct: "",
        external_id: decodedToken?.userId
      },
      facebook_data: {
        content_name: name,
        content_type: "product details",
        content_ids: [id],
        content_category: categoryNames,
        contents: [{
          id: id,
          reference: reference,
          name: name,
          value: finalPrice,
          quantity: 1,
          price: price,
          brand: brandName,
          category: categories[0]?.name,
          category2: categories[1]?.name,
          category3: categories[2]?.name,
          availability: inventory > 0 ? "in stock" : "out of stock",
          description: description,
          variant: colorName,
          attributes: attributes?.map(
            (attr: { name: string; value: string }) =>
              attr.name + " " + attr.value
          )
        }]
      }
    });


    triggerEvents("PageView", {
      user_data: {
        em: [userData?.fetchUsersById?.email.toLowerCase()],
        fn: [userData?.fetchUsersById?.fullName],
        ph: [userData?.fetchUsersById?.number],
        country: ["tn"],
        ct: "",
        external_id: decodedToken?.userId,
      },
      custom_data: {
        content_name: name,
        content_type: "product details",
        content_ids: [id],
        value: finalPrice,
        currency: "TND",
        content_category: categoryNames,
        contents: [
          {
            item_id: id,
            reference,
            item_name: name,
            value: finalPrice,
            quantity: 1,
            item_price: price,
            item_brand: brandName,
            item_category: categories[0]?.name,
            item_category2: categories[1]?.name,
            item_category3: categories[2]?.name,
            availability: inventory > 0 ? "in stock" : "out of stock",
            item_description: description,
            item_variant: colorName,
            item_Att: attributes?.map(
              (attr: { name: string; value: string }) =>
                attr.name + " " + attr.value
            ),
          },
        ],
      },
    });

    setDiscount(productDetails.productDiscounts[0]);
    setAttributes(productDetails.attributes);
  }, [productId]);

  const productInBasket = useMemo(() => {
    if (decodedToken?.userId && basketData?.basketByUserId) {
      return basketData.basketByUserId.find(
        (item: any) => item.Product.id === productId
      );
    }
    return storedProducts.find((product: any) => product.id === productId);
  }, [decodedToken, productId]);

  const toggleIsUpdated = useBasketStore((state) => state.toggleIsUpdated);

  const [addToFavorite] = useMutation(ADD_DELETE_PRODUCT_FAVORITE_MUTATION);

  const AddToBasket = useCallback(async (product: any) => {
    const price =
      product.productDiscounts.length > 0
        ? product.productDiscounts[0].newPrice
        : product.price;
    const addToCartData = {
      user_data: {
        user_email: [userData?.fetchUsersById.email.toLowerCase()],
        user_fullName: [userData?.fetchUsersById.fullName],
        user_phone: [userData?.fetchUsersById?.number],
        user_country: ["tn"],
        user_city: "",
        user_id: decodedToken?.userId,
      },
      custom_data: {
        content_name: product.name,
        content_type: "product",
        content_ids: [product.id],
        currency: "TND",
        contents: [
          {
            item_id: product.id,
            reference: product.reference,
            item_name: product.name,
            item_category: product.categories[0]?.name,
            item_category2: product.categories[1]?.name,
            item_category3: product.categories[2]?.name,
            item_variant: product?.Colors?.color,
            item_price: product.productDiscounts?.length
              ? product.productDiscounts[0].newPrice.toFixed(3)
              : product.price.toFixed(3),
            item_description: product.description,
            item_Att: attributes?.map(
              (attr: { name: string; value: string }) =>
                attr.name + " " + attr.value
            ),
            quantity: product.actualQuantity || product.quantity,

          },
        ],
        value: price * (product.actualQuantity || product.quantity)
      },
    };

    const cartEventDataGTM = {
      event: "add_to_cart",
      ecommerce: {
        currency: "TND",
        items: [
          {
            item_id: product.id,
            reference: product.reference,
            item_name: product.name,
            item_category: product.categories[0]?.name,
            item_category2: product.categories[1]?.name,
            item_category3: product.categories[2]?.name,
            item_variant: product?.Colors?.color,
            item_price: product.productDiscounts?.length
              ? product.productDiscounts[0].newPrice.toFixed(3)
              : product.price.toFixed(3),
            item_description: product.description,
            item_Att: attributes?.map(
              (attr: { name: string; value: string; }) => attr.name + " " + attr.value
            ),
            quantity: product.actualQuantity || product.quantity
          }
        ],
        value: product.productDiscounts?.length
          ? product.productDiscounts[0].newPrice * (product.actualQuantity || product.quantity)
          : product.price * (product.actualQuantity || product.quantity)
      },
      user_data: {
        em: [userData?.fetchUsersById.email.toLowerCase()],
        fn: [userData?.fetchUsersById.fullName],
        ph: [userData?.fetchUsersById?.number],
        country: ["tn"],
        ct: "",
        external_id: decodedToken?.userId
      },
      facebook_data: {
        content_name: product.name,
        content_type: "product",
        content_ids: [product.id],
        contents: {
          id: product.id,
          quantity: product.actualQuantity || product.quantity
        },
        value: product.productDiscounts?.length
          ? product.productDiscounts[0].newPrice * (product.actualQuantity || product.quantity)
          : product.price * (product.actualQuantity || product.quantity),
        currency: "TND"
      }
    };
    // Track Add to Cart
    triggerEvents("AddToCart", addToCartData);
    sendGTMEvent(cartEventDataGTM);
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

        // If everything is okay, proceed with adding to basket
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
          onCompleted: () => {
            toast({
              title: "Produit ajouté au panier",
              description: `${quantity} ${quantity > 1 ? "unités" : "unité"} de "${productDetails?.name}" ${quantity > 1 ? "ont été ajoutées" : "a été ajoutée"} à votre panier.`,
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
      const filteredProduct = storedProducts.filter(
        (p: any) => p.id === product?.id
      )[0];

      if (
        (filteredProduct &&
          filteredProduct.actualQuantity >= product.inventory) ||
        filteredProduct?.actualQuantity + quantity >= product.inventory
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
        description: `${quantity} ${quantity > 1 ? "unités" : "unité"} de "${productDetails?.name}" ${quantity > 1 ? "ont été ajoutées" : "a été ajoutée"} à votre panier.`,
        className: "bg-green-600 text-white",
      });
    }
    toggleIsUpdated();
  }, [decodedToken, productInBasket, quantity, productDetails?.name, userData, attributes, toast, toggleIsUpdated, storedProducts, increaseProductInQtBasket, addProductToBasket]);

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
    ...categoryNames.map((category: string | number | boolean, index: any) => ({
      href: `/Collections/tunisie?category=${encodeURIComponent(category)}`,
      label: category,
    })),
    {
      href: `/products/tunisie?${productDetails.id}`,
      label: productDetails?.name,
    },
  ], [categoryNames, productDetails?.id, productDetails?.name]);


  const handleToggleFavorite = useCallback(() => {
    if (decodedToken?.userId) {
      const userId = decodedToken.userId;

      addToFavorite({
        variables: {
          input: { userId, productId },
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
    productId,
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
    // In the return statement, update the main container styling
    <div className="productDetails bg-gray-50 py-6">
      <div className="container relative  mx-auto px-4 sm:px-6">
        {!productDetails ? (
          <Loading />
        ) : (
          <div className="space-y-6">
            <Breadcumb Path={categoriesPath} />
    
            <div className="grid items-start mx-auto grid-cols-12 w-full place-items-center lg:place-content-between bg-white md:p-6 border border-gray-200 rounded-lg shadow-sm gap-4">
              <div className="lg:sticky top-0 lg:top-5 gap-3 z-50 items-center bg-white col-span-12 lg:col-span-5 w-full text-center">
                <div className="relative">
                  <CustomInnerZoom
                    images={smallImages}
                  />
                  <span
                    className={`absolute top-2 right-2 p-2 rounded-md ${
                      productDetails?.inventory > 1 
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
              
              {/* Rest of the product info section */}
              <ProductInfo
                productDetails={productDetails}
                attributes={attributes}
                userId={decodedToken?.userId}
                discount={discount}
                productId={productId}
                AddToBasket={AddToBasket}
                quantity={quantity}
                handleIncreaseQuantity={handleIncreaseQuantity}
                handleDecreaseQuantity={handleDecreaseQuantity}
                handleToggleFavorite={handleToggleFavorite}
                isProductInCompare={isProductInCompare}
                addToCompare={addToCompare}
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
            
            <ProductAttrLaptop 
              attributes={attributes}
              productId={productDetails.id}
              userId={decodedToken?.userId || ""}
              toast={toast}
            />
          </div>
        )}
        
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-6 mt-8 mb-[15%]">
          <TitleProduct title={"Produits apparentés"} />
          <div>
            <ProductTabs
              data={Products_10_by_category?.productsByCategory}
              loadingProduct={loadingProductByCategiry}
            />
          </div>
        </div>
        
        <ProductDetailsDrawer
          productId={productId}
          productDetails={productDetails}
          addToBasket={AddToBasket}
          discount={discount}
          quantity={quantity}
          handleIncreaseQuantity={handleIncreaseQuantity}
          handleDecreaseQuantity={handleDecreaseQuantity}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
