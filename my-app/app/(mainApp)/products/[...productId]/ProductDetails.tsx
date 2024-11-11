"use client";

import { useToast } from "@/components/ui/use-toast";
import { pushToDataLayer } from "@/utlils/pushToDataLayer";
import triggerEvents from "@/utlils/trackEvents";
import { useMutation, useQuery } from "@apollo/client";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";
import { ADD_TO_BASKET_MUTATION } from "../../../../graphql/mutations";
import {
  BASKET_QUERY,
  FETCH_USER_BY_ID,
  TAKE_10_PRODUCTS_BY_CATEGORY,
} from "../../../../graphql/queries";
import Breadcumb from "../../../components/Breadcumb";
import {
  useBasketStore,
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

const SmallImageCarousel = dynamic(
  () => import("./Components/SmallImageCarousel"),
  {
    ssr: true,
  }
);

// Defer non-critical components
const ProductDetailsDrawer = dynamic(
  () => import("./Components/productDetailsDrawer"),
  {
    ssr: false,
  }
);

const InnerImageZoom = dynamic(() => import("react-inner-image-zoom"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full animate-pulse bg-gray-100 rounded-md" />
  ),
});
interface DecodedToken extends JwtPayload {
  userId: string;
}

const ProductDetails = ({ productDetails, productId }: any) => {
  const { toast } = useToast();

  const mainImage = useMemo(
    () => productDetails?.images[0] || "",
    [productDetails]
  );

  const [bigImage, setBigImage] = useState<any>(mainImage);

  const [smallImages, setSmallImages] = useState<any>(null);

  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [discount, setDiscount] = useState<any>(null);
  const [attributes, setAttributes] = useState<any>(null);

  const [quantity, setQuantity] = useState<number>(1);

  const { openPruchaseOptions } = usePruchaseOptions();

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
    skip: !decodedToken?.userId,
  });

  const { data: userData } = useQuery(FETCH_USER_BY_ID, {
    variables: {
      userId: decodedToken?.userId,
    },
    skip: !decodedToken?.userId,
  });

  const {
    products: storedProducts,
    addProductToBasket,
    increaseProductInQtBasket,
  } = useProductsInBasketStore();

  useEffect(() => {
    if (productDetails?.images) {
      setBigImage(productDetails.images[0]);
      setSmallImages(productDetails.images);
    }
  }, [productDetails]);



  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
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
    const categoryNames = categories
      ?.map((category: { name: any }) => category.name)
      .join(", ");

    const brandName = Brand?.name || "Unknown Brand";
    const colorName = Colors?.color || "No Color";
    const finalPrice = discount?.newPrice ?? price;

    triggerEvents("ViewContent", {
      user_data: {
        em: [userData?.fetchUsersById?.email.toLowerCase()],
        fn: [userData?.fetchUsersById?.fullName],
        ph: [userData?.fetchUsersById?.number],
        country: ["tn"],
        external_id: userData?.fetchUsersById.id,
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
            id,
            quantity: 1,
            item_price: price,
            brand: brandName,
            availability: inventory > 0 ? "in stock" : "out of stock",
            condition: "new",
            description,
            color: colorName,
            sizes: attributes
              ?.filter((attr: { name: string }) =>
                attr.name.toLowerCase().includes("size")
              )
              .map((attr: { value: any }) => attr.value),
          },
        ],
      },
    });
    pushToDataLayer("ViewContent");
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

  const AddToBasket = async (product: any) => {
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
        external_id: userData?.fetchUsersById.id,
      },
      custom_data: {
        content_name: productDetails?.name,
        content_type: "product",
        content_ids: [productDetails.id],
        value: price,
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
            // Track Add to Cart
            triggerEvents("AddToCart", addToCartData);
            pushToDataLayer("AddToCart");
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
      triggerEvents("AddToCart", addToCartData);
      pushToDataLayer("AddToCart");
    }
    toggleIsUpdated();
  };

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

  const categoryNames = productDetails?.categories?.map(
    (cat: { name: string }) => cat.name
  );
  const categoriesPath = [
    { href: "/", label: "Accueil" },
    ...categoryNames.map((category: string | number | boolean, index: any) => ({
      href: `/Collections/tunisie?category=${encodeURIComponent(category)}`,
      label: category,
    })),
    {
      href: `/products/tunisie?${productDetails.id}`,
      label: productDetails?.name,
    },
  ];

  return (
    <div className="productDetails">
      <div className="container relative  ">
        {!productDetails ? (
          <Loading />
        ) : (
          <div>
            <Breadcumb Path={categoriesPath} />

            <div className="grid items-start mx-auto grid-cols-12 w-full md:w-11/12 place-items-center lg:place-content-between bg-white md:p-4 border rounded-sm gap-2 ">
              <div className="lg:sticky top-0 lg:top-5 gap-3 z-50 flex lg:flex-row-reverse flex-col  items-center bg-white col-span-12 lg:col-span-6 w-full text-center">
                <div className="relative shadow-sm overflow-hidden   flex items-center justify-center w-full md:w-[556px] h-[400px] md:h-[556px] rounded-sm">
                  <InnerImageZoom
                    className=" h-fit flex items-center justify-center rounded "
                    zoomSrc={bigImage || ""}
                    src={bigImage || ""}
                    zoomType="hover"
                    zoomScale={1.5}
                    hideHint={true}
                  />
                  <span
                    className={`absolute top-2 right-2 p-2 ${productDetails?.inventory > 1 ? "bg-blueColor" : productDetails?.inventory === 1 ? "bg-gray-400 " : "bg-gray-400"} bg-blue text-xs font-400 text-white`}
                  >
                    {productDetails?.inventory > 1
                      ? "EN STOCK"
                      : productDetails?.inventory === 1
                        ? "DERNIER ARTICLE EN STOCK"
                        : "RUPTURE DE STOCK"}
                  </span>
                </div>
                <SmallImageCarousel
                  images={smallImages}
                  bigImage={bigImage}
                  setBigImage={setBigImage}
                />
              </div>

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
              />
            </div>
          </div>
        )}
        <div className="Carousel voir aussi px-2 md:px-10 my-8 mb-[15%] ">
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
