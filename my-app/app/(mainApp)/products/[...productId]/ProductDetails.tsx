"use client";

import ProductTabs from "@/app/components/ProductCarousel/productTabs";
import TitleProduct from "@/app/components/ProductCarousel/titleProduct";
import { useToast } from "@/components/ui/use-toast";
import { pushToDataLayer } from "@/utlils/pushToDataLayer";
import triggerEvents from "@/utlils/trackEvents";
import { useMutation, useQuery } from "@apollo/client";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import moment from "moment-timezone";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaPlus,
  FaRegHeart
} from "react-icons/fa";
import { GoAlertFill, GoGitCompare } from "react-icons/go";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { MdAddShoppingCart } from "react-icons/md";
import { RiSubtractFill } from "react-icons/ri";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";
import {
  ADD_DELETE_PRODUCT_FAVORITE_MUTATION,
  ADD_TO_BASKET_MUTATION
} from "../../../../graphql/mutations";
import {
  BASKET_QUERY,
  FETCH_USER_BY_ID,
  TAKE_10_PRODUCTS_BY_CATEGORY
} from "../../../../graphql/queries";
import Breadcumb from "../../../components/Breadcumb";
import PopHover from "../../../components/PopHover";
import {
  useBasketStore,
  useComparedProductsStore,
  useProductsInBasketStore,
  usePruchaseOptions,
} from "../../../store/zustand";
import ProductAttr from "./Components/ProductAttr";
import ProductDetailsDrawer from "./Components/productDetailsDrawer";
import RatingStars from "./Components/RatingStars";
import SmallImageCarousel from "./Components/SmallImageCarousel";
import Loading from "./loading";
import OrderNow from "./Components/OrderNow";
const InnerImageZoom = dynamic(
  () => import('react-inner-image-zoom'),
  { ssr: false }
);
interface DecodedToken extends JwtPayload {
  userId: string;
}

const ProductDetails = ({ productDetails, productId }: any) => {
  const DEFAULT_TIMEZONE = "Africa/Tunis";
  const { toast } = useToast();
  const [bigImage, setBigImage] = useState<any>(null);
  const [smallImages, setSmallImages] = useState<any>(null);

  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [discount, setDiscount] = useState<any>(null);
  const [attributes, setAttributes] = useState<any>(null);
  const [showPopover, setShowPopover] = useState<Boolean>(false);
  const [popoverTitle, setPopoverTitle] = useState("");
  const [isBottom, setIsBottom] = useState<Boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);



  const { openPruchaseOptions } = usePruchaseOptions();

  const [addToBasket] = useMutation(ADD_TO_BASKET_MUTATION);
  const [addToFavorite] = useMutation(ADD_DELETE_PRODUCT_FAVORITE_MUTATION);

  const { loading: loadingProductByCategiry, data: Products_10_by_category } =
    useQuery(TAKE_10_PRODUCTS_BY_CATEGORY, {
      variables: {
        limit: 10,
        categoryName: productDetails?.categories[1]?.name
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
    increaseProductInQtBasket
  } = useProductsInBasketStore();

  useEffect(() => {
    setBigImage(productDetails.images[0]);
    setSmallImages(productDetails.images);
    setDiscount(productDetails.productDiscounts[0]);
    setAttributes(productDetails.attributes);
  }, []);

  useEffect(() => {
    if (!productDetails) return;
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
        em: [userData?.fetchUsersById.email.toLowerCase()],
        fn: [userData?.fetchUsersById.fullName],
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
                attr.name.toLowerCase().includes("size"),
              )
              .map((attr: { value: any }) => attr.value),
          },
        ],
      },
    });
    pushToDataLayer("ViewContent");
  }, [productDetails]);

  const productInBasket = useMemo(() => {
    if (decodedToken?.userId && basketData?.basketByUserId) {
      return basketData.basketByUserId.find(
        (item: any) => item.Product.id === productId
      );
    }
    return storedProducts.find((product: any) => product.id === productId);
  }, [decodedToken, basketData, storedProducts, productId]);



  const handleMouseEnter = (title: any) => {
    setShowPopover(true);
    setPopoverTitle(title);
  };

  const handleMouseLeave = () => {
    setShowPopover(false);
    setPopoverTitle("");
  };

  const toggleIsUpdated = useBasketStore((state) => state.toggleIsUpdated);

  const { addProductToCompare, productsInCompare } = useComparedProductsStore(
    (state) => ({
      addProductToCompare: state.addProductToCompare,
      productsInCompare: state.products,
    }),
  );


  const AddToBasket = async (product: any) => {
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
        content_name: productDetails.name,
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
      const isProductAlreadyInBasket = storedProducts.some((p: any) => p.id === product?.id);
      const filteredProduct = storedProducts.filter((p: any) => p.id === product?.id)[0];

      if (filteredProduct && filteredProduct.actualQuantity >= product.inventory || (filteredProduct?.actualQuantity + quantity) >= product.inventory) {
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
      setQuantity(prev => prev + 1);
    }
  }, [quantity, productDetails.inventory]);

  const handleDecreaseQuantity = useCallback(() => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  }, [quantity]);






  useEffect(() => {
    const interval = setInterval(() => {
      const currentIndex = smallImages?.indexOf(bigImage);
      if (currentIndex !== -1 && currentIndex < smallImages?.length - 1) {
        setBigImage(smallImages[currentIndex + 1]);
      } else {
        setBigImage(smallImages[0]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [bigImage, smallImages]);

  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const scrollPosition = window.scrollY;

      // Calculate the position halfway through the window
      const halfwayPosition = windowHeight / 2;

      // Check if the scroll position is greater than or equal to halfway
      const isHalfway = scrollPosition >= halfwayPosition;

      setIsBottom(isHalfway);
    };

    // Attach the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Detach the scroll event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      if (discount) {
        const now = moment().tz(DEFAULT_TIMEZONE);
        const targetDate = moment.tz(
          parseInt(discount.dateOfEnd),
          DEFAULT_TIMEZONE,
        );
        targetDate.subtract(1, "hours");

        const timeUntilTarget = targetDate.diff(now);
        setCountdown(timeUntilTarget > 0 ? timeUntilTarget : 0);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [discount]);

  const addToCompare = (product: any) => {
    const isProductAlreadyInCompare = productsInCompare.some(
      (p: any) => p.id === product.id,
    );

    if (!isProductAlreadyInCompare) {
      addProductToCompare(product);
    } else {
      toast({
        title: "Produit ajouté à la comparaison",
        description: `Le produit "${productDetails?.name}" a été ajouté à la comparaison.`,
        className: "bg-primaryColor text-white",
      });
    }
  };

  const handleToggleFavorite = () => {
    if (!decodedToken?.userId) {
      toast({
        title: "Produit ajouté aux favoris",
        description:
          "Vous devez vous connecter pour ajouter un produit aux favoris.",
        className: "bg-red-800 text-white",
      });
      return;
    }
    addToFavorite({
      variables: {
        input: {
          userId: decodedToken?.userId,
          productId: productId,
        },
      },
      onCompleted: () => {
        toast({
          title: "Produit ajouté aux favoris",
          description: `Le produit "${productDetails?.name}" a été ajouté à vos favoris.`,
          className: "bg-primaryColor text-white",
        });
      },
    });
  };

  return (
    <div className="productDetails">

      <div className="container relative  ">
        {!productDetails ? (
          <Loading />
        ) : (
          <div>
            <Breadcumb />

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

              <div className="product  lg:col-span-6 col-span-12 p-3 w-full ">


                <h2 className="product_name tracking-wider text-xl lg:text-2xl w-fit font-semibold ">
                  {productDetails?.name}
                </h2>

                <div className="prices discount flex    flex-col  gap-3  mt-2">
                  <div className=" text-primaryColor flex items-center gap-3 tracking-wide text-2xl font-bold">


                    {discount
                      ? <p className="text-gray-400 line-through font-semibold text-lg" >{productDetails?.price.toFixed(3)} TND</p>
                      : <p className=" font-bold">
                        {productDetails?.price.toFixed(3)} TND
                      </p>
                    }

                    {discount
                      ? <p className="text-red-500  font-bold"> {discount.newPrice.toFixed(3)} TND</p>
                      : ""
                    }



                    {!discount && (
                      <span className="text-sm text-gray-400 ml-2 font-medium">
                        TTC
                      </span>
                    )
                    }
                  </div>

                  {discount && countdown && (
                    <>
                      <div className="text-gray-400 tracking-wide flex items-center text-xl gap-2">

                        <p className="text-sm bg-blue-800 text-white p-1">
                          Économisez
                          <span className="font-bold ml-1 ">
                            {(discount.price - discount.newPrice).toFixed(3)}{" "}
                            TND
                          </span>
                        </p>
                        <span className="text-sm">TTC</span>
                      </div>
                      <div className="text-sm text-green-400">
                        {countdown ? (
                          <>
                            La réduction se termine dans :{" "}
                            <span className="font-semibold text-lg">
                              {Math.floor(countdown / (1000 * 60 * 60 * 24))}{" "}
                              jrs,{" "}
                              {Math.floor(
                                (countdown % (1000 * 60 * 60 * 24)) /
                                (1000 * 60 * 60),
                              )}{" "}
                              hrs :{" "}
                              {Math.floor(
                                (countdown % (1000 * 60 * 60)) / (1000 * 60),
                              )}{" "}
                              mins :{" "}
                              {Math.floor((countdown % (1000 * 60)) / 1000)}{" "}
                              secs
                            </span>
                          </>
                        ) : (
                          "La réduction a expiré"
                        )}
                      </div>
                    </>
                  )}
                </div>

                <div className="Infomation_Details ">
                  <div className="Reference mt-1 flex items-center gap-1">
                    <h3 className="text-sm tracking-wider font-semibold  capitalize  ">
                      Reference :
                    </h3>
                    <p className="text-gray-600">{productDetails?.reference}</p>
                  </div>

                  <div className="Description">
                    <h3 className="text-lg tracking-wider font-bold capitalize  text-primaryColor mt-3">
                      Description
                    </h3>

                    <div
                      className="product-description text-sm tracking-wide font-extralight border-b-2 border-dashed pb-6"
                      dangerouslySetInnerHTML={{
                        __html: productDetails?.description,
                      }}
                    />
                  </div>
                </div>

                <div className={` user_interaction flex flex-col gap-2 mt-4`}>
                  {quantity === productDetails?.inventory && (
                    <div className="flex items-center text-sm gap-3 ">
                      <GoAlertFill color="red" size={20} />
                      <p className="text-red-600 font-semibold tracking-wider">
                        La quantité maximale de produits est de {quantity}
                        .
                      </p>
                    </div>
                  )}
                  {productDetails?.inventory == 1 && (
                    <div className="flex text-sm items-center gap-3">
                      <HiOutlineBellAlert color="orange" size={20} />
                      <p className="text-red-600 font-semibold tracking-wider">
                        Attention: Il ne reste qu'un 1 article en stock.
                      </p>
                    </div>
                  )}
                  <div className="Quantity flex items-center mt-3   space-x-2">
                    <h3 className=" tracking-wider font-normal text-base  capitalize text-primaryColor">
                      Quantité:{" "}
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
                        className={`${quantity === productDetails.inventory ? "opacity-45" : ""} w-fit transition-opacity h-fit bg-secondaryColor text-white p-2 text-sm hover:opacity-75 font-semibold cursor-pointer`}
                        disabled={quantity === productDetails.inventory}
                        onClick={handleIncreaseQuantity}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                  <OrderNow ActualQuantity={quantity} productDetails={productDetails} />

                  <div className="addToBasket flex items-center mt-4  gap-2 md:gap-4  ">
                    <button
                      type="button"
                      className={`${productDetails?.inventory <= 0 ? "cursor-not-allowed" : "cursor-pointer"} min-w-[250px] w-4/5 transition-opacity  py-4  shadow-lg flex items-center justify-center gap-2 bg-secondaryColor hover:opacity-80 text-white text-sm  font-bold `}
                      onClick={() => {
                        AddToBasket(productDetails);
                      }}
                    >
                      <MdAddShoppingCart size={20} />
                      Ajouter au panier
                    </button>
                    <div
                      className="relative"
                      onMouseEnter={() =>
                        handleMouseEnter("Ajouter au favoris")
                      }
                      onMouseLeave={handleMouseLeave}
                    >
                      {showPopover && popoverTitle === "Ajouter au favoris" && (
                        <PopHover title={popoverTitle} />
                      )}

                      <button
                        type="button"
                        className="transition-colors bg-transparent text-primaryColor text-xl hover:text-black font-bold rounded"
                        onClick={handleToggleFavorite}
                      >
                        <FaRegHeart />
                      </button>
                    </div>

                    <div
                      className="relative"
                      onMouseEnter={() =>
                        handleMouseEnter("Ajouter au comparatif")
                      }
                      onMouseLeave={handleMouseLeave}
                    >
                      {showPopover &&
                        popoverTitle === "Ajouter au comparatif" && (
                          <PopHover title={popoverTitle} />
                        )}
                      <button
                        type="button"
                        className=" text-primaryColor hover:text-black transition-colors text-xl font-bold rounded"
                        onClick={() => {
                          addToCompare(productDetails);
                        }}
                      >
                        {productsInCompare.some(
                          (p: any) => p.id === productDetails.id,
                        ) ? (
                          <IoCheckmarkDoneOutline size={25} />
                        ) : (
                          <GoGitCompare className="font-bold" />
                        )}{" "}
                      </button>
                    </div>
                  </div>
                </div>

                <RatingStars productId={productId} userId={decodedToken?.userId} toast={toast} />
              </div>
            </div>
            <ProductAttr attributes={attributes} />
          </div>
        )}
        <div className="Carousel voir aussi px-2 md:px-10 mb-[15%] ">
          <TitleProduct title={"Produits apparentés"} />
          <div>
            <ProductTabs
              data={Products_10_by_category?.productsByCategory}
              loadingProduct={loadingProductByCategiry}
            />
          </div>
        </div>
        <ProductDetailsDrawer
          isBottom={isBottom}
          productId={productId}
          productDetails={productDetails}
          addToBasket={AddToBasket}
          discount={discount}
          quantity={quantity}
          handleIncreaseQuantity={handleIncreaseQuantity}
          handleDecreaseQuantity={handleDecreaseQuantity}
          userData={userData}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
