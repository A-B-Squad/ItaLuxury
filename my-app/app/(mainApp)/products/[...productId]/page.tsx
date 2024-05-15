"use client";

import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaPlus, FaRegHeart, FaStar } from "react-icons/fa";
import { RiSubtractFill } from "react-icons/ri";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";
import {
  BASKET_QUERY,
  GET_PRODUCT_IMAGES_QUERY,
  GET_REVIEW_QUERY,
  PRODUCT_BY_ID_QUERY,
  TAKE_10_PRODUCTS,
  GET_USER_REVIEW_QUERY,
} from "../../../../graphql/queries";

import ProductTabs from "@/app/components/ProductCarousel/productTabs";
import TitleProduct from "@/app/components/ProductCarousel/titleProduct";
import { GoAlertFill, GoGitCompare } from "react-icons/go";
import {
  ADD_RATING_MUTATION,
  ADD_TO_BASKET_MUTATION,
  ADD_TO_FAVORITE_MUTATION,
} from "../../../../graphql/mutations";
import Breadcumb from "../../../components/Breadcumb";
import PopHover from "../../../components/PopHover";
import ProductDetailsDrawer from "../../../components/ProductInfo/productDetailsDrawer";
import { useToast } from "@/components/ui/use-toast";
import Loading from "./loading";
import {
  useBasketStore,
  useComparedProductsStore,
  useDrawerBasketStore,
  useProductsInBasketStore,
} from "../../../store/zustand";
import Image from "next/image";
interface DecodedToken extends JwtPayload {
  userId: string;
}
const ProductDetails = ({ params }: { params: { productId: string } }) => {
  const SearchParams = useSearchParams();
  const productId = SearchParams?.get("productId");
  const { toast } = useToast();
  const [productDetails, setProductDetails] = useState<any>(null);
  const [bigImage, setBigImage] = useState<any>(null);
  const [smallImages, setSmallImages] = useState<any>(null);
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<any>(null);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [discount, setDiscount] = useState<any>(null);
  const [reviews, setReviews] = useState<number>(0);
  const [userReviews, setUserReviews] = useState<number>(0);
  const [oneStar, setOneStar] = useState<number>(0);
  const [twoStar, setTwoStar] = useState<number>(0);
  const [threeStar, setThreeStar] = useState<number>(0);
  const [fourStar, setFourStar] = useState<number>(0);
  const [fiveStar, setFiveStar] = useState<number>(0);
  const [actualQuantity, setActualQuantity] = useState<number>(1);
  const [quantity, setQuantity] = useState<number>(0);
  const [attributes, setAttributes] = useState<any>(null);
  const [showPopover, setShowPopover] = useState<Boolean>(false);
  const [popoverTitle, setPopoverTitle] = useState("");
  const [isBottom, setIsBottom] = useState<Boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const { openBasketDrawer } = useDrawerBasketStore();
  const [getReviews] = useLazyQuery(GET_REVIEW_QUERY);
  const [getUserReviews] = useLazyQuery(GET_USER_REVIEW_QUERY);
  const [addToBasket] = useMutation(ADD_TO_BASKET_MUTATION);
  const [addToFavorite] = useMutation(ADD_TO_FAVORITE_MUTATION);

  const { loading: loadingNewProduct, data: Products_10 } = useQuery(
    TAKE_10_PRODUCTS,
    {
      variables: { limit: 10 },
    }
  );
  const { loading } = useQuery(PRODUCT_BY_ID_QUERY, {
    variables: { productByIdId: productId },
    onCompleted: (data) => {
      setProductDetails(data.productById);
      setBigImage(data.productById.images[0]);
      setSmallImages(data.productById.images);
      setDiscount(data.productById.productDiscounts[0]);
      setAttributes(data.productById.attributes);
      setQuantity(data.productById.inventory);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const [addRating] = useMutation(ADD_RATING_MUTATION);

  const handleMouseEnter = (title: any) => {
    setShowPopover(true);
    setPopoverTitle(title);
  };

  const handleMouseLeave = () => {
    setShowPopover(false);
    setPopoverTitle("");
  };
  const toggleIsUpdated = useBasketStore((state) => state.toggleIsUpdated);

  const addProductToCompare = useComparedProductsStore(
    (state) => state.addProductToCompare
  );

  const { addProductToBasket, products } = useProductsInBasketStore(
    (state) => ({
      addProductToBasket: state.addProductToBasket,
      products: state.products,
    })
  );

  const AddToBasket = (product: any) => {
    if (decodedToken) {
      addToBasket({
        variables: {
          input: {
            userId: decodedToken?.userId,
            quantity: actualQuantity,
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
  };

  useEffect(() => {
    getReviews({
      variables: { productId: productId },
      onCompleted: (data) => {
        setReviews(data.productReview.length);
        setOneStar(
          data.productReview.filter(
            (review: { rating: number }) => review.rating === 1
          ).length
        );
        setTwoStar(
          data.productReview.filter(
            (review: { rating: number }) => review.rating === 2
          ).length
        );
        setThreeStar(
          data.productReview.filter(
            (review: { rating: number }) => review.rating === 3
          ).length
        );
        setFourStar(
          data.productReview.filter(
            (review: { rating: number }) => review.rating === 4
          ).length
        );
        setFiveStar(
          data.productReview.filter(
            (review: { rating: number }) => review.rating === 5
          ).length
        );
      },
    });
    getUserReviews({
      variables: { productId: productId, userId: decodedToken?.userId },
      onCompleted: (data) => {
        setUserReviews(data.productReview[0].rating);
      },
    });
  }, [userReviews, rating]);

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
    if (discount && discount.dateOfEnd) {
      const endTime = discount.dateOfEnd;

      const now = new Date().getTime();
      const timeRemaining = endTime - now;
      setCountdown(timeRemaining > 0 ? timeRemaining : 0);

      const interval = setInterval(() => {
        const newTimeRemaining = endTime - new Date().getTime();
        setCountdown(newTimeRemaining > 0 ? newTimeRemaining : 0);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [discount]);

  const addToCompare = (product: any) => {
    addProductToCompare(product);
  };

  const handleToggleFavorite = () => {
    if (!decodedToken?.userId) {
      alert("Please login to add to favorites.");
      return;
    }
    addToFavorite({
      variables: {
        input: {
          userId: decodedToken?.userId,
          productId: productId,
        },
      },
    });
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="sm:flex sm:items-center sm:flex-col lg:block">
          <div className="p-6 lg:max-w-7xl max-w-2xl max-lg:mx-auto">
            <Breadcumb />

            <div className="grid items-star grid-cols-12 gap-10  ">
              <div className=" flex lg:flex-row flex-col gap-2 items-center col-span-10 lg:col-span-7 w-full text-center">
                <div className="relative shadow-xl  border-2  flex items-center justify-center w-4/5 h-4/5 rounded-xl">
                  <InnerImageZoom
                    className="w-4/5 rounded object-cover"
                    zoomSrc={bigImage || ""}
                    src={bigImage || ""}
                    zoomType="hover"
                    hideHint
                    zoomScale={1.5}
                  />
                  <span
                    className={
                      "absolute top-2 right-0 p-2  bg-strongBeige text-xs font-400 text-white"
                    }
                  >
                    {productDetails?.inventory > 0
                      ? "EN STOCK"
                      : "STOCK EN RUPTURE "}
                  </span>
                </div>
                <div className="mt-6 flex lg:flex-col  justify-center gap-3 px-2 py-2 mx-auto">
                  {smallImages?.map((image: string, index: number) => (
                    <div
                      key={index}
                      className={`${image === bigImage ? "border-black" : ""} cursor-pointer border  h-fit rounded-md p-1`}
                    >
                      <Image
                        width={90}
                        height={90}
                        objectFit="contain"
                        src={image}
                        alt="Product2"
                        onMouseEnter={() => {
                          setBigImage(image);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="product lg:col-span-5 col-span-10 ">
                <h2 className="product_name tracking-wider text-2xl w-fit font-semibold ">
                  {productDetails?.name}
                </h2>

                <div className="discount flex    flex-col  gap-1 mt-4">
                  <p className="text-strongBeige tracking-wide text-3xl font-bold">
                    {discount
                      ? discount.newPrice.toFixed(3)
                      : productDetails?.price.toFixed(3)}{" "}
                    <span className="text-2xl ">TND</span>
                    {!discount && (
                      <span className="text-sm text-gray-400 ml-2 font-medium">
                        TTC
                      </span>
                    )}
                  </p>

                  {discount && (
                    <>
                      <div className="text-gray-400 tracking-wide flex items-center text-lg gap-2">
                        <p className="line-through">
                          {discount.price.toFixed(3)} TND
                        </p>{" "}
                        <p className="text-sm bg-violet-700 text-white p-1">
                          Économisez
                          <span className="font-bold ml-1 ">
                            {(discount.price - discount.newPrice).toFixed(3)}{" "}
                            TND
                          </span>
                        </p>
                        <span className="text-sm">TTC</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {countdown ? (
                          <>
                            La réduction se termine dans :{" "}
                            <span className="font-semibold">
                              {Math.floor(countdown / (1000 * 60 * 60 * 24))}{" "}
                              jrs,{" "}
                              {Math.floor(
                                (countdown % (1000 * 60 * 60 * 24)) /
                                  (1000 * 60 * 60)
                              )}{" "}
                              hrs,{" "}
                              {Math.floor(
                                (countdown % (1000 * 60 * 60)) / (1000 * 60)
                              )}{" "}
                              mins,{" "}
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
                  <div className="Quantity flex items-center mt-4  space-x-2">
                    <h3 className="text-lg tracking-wider font-semibold  capitalize text-strongBeige">
                      Quantité
                    </h3>
                    <div className="flex divide-x border w-max overflow-hidden rounded-md">
                      <button
                        type="button"
                        className="bg-lightBeige hover:bg-mediumBeige transition-all  px-3 py-1 font-semibold cursor-pointer"
                        onClick={() => {
                          setActualQuantity(
                            actualQuantity > 1 ? actualQuantity - 1 : 1
                          );
                        }}
                      >
                        <RiSubtractFill />
                      </button>
                      <button
                        type="button"
                        className="bg-transparent px-3 py-1 font-semibold text-[#333] text-md"
                      >
                        {actualQuantity}
                      </button>
                      <button
                        type="button"
                        className={`${actualQuantity === quantity && "opacity-45"} bg-strongBeige text-white px-3 py-1 font-semibold cursor-pointer`}
                        disabled={actualQuantity === productDetails?.inventory}
                        onClick={() => {
                          setActualQuantity(
                            actualQuantity < productDetails?.inventory
                              ? actualQuantity + 1
                              : actualQuantity
                          );
                        }}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                  <div className="Description">
                    <h3 className="text-lg tracking-wider font-bold capitalize  text-strongBeige mt-5">
                      Description
                    </h3>
                    <ul className="space-y-3 tracking-widest list-disc mt-2 pl-4 text-sm text-gray-600">
                      <li>{productDetails?.description}</li>
                    </ul>
                  </div>
                </div>

                <div className={` user_interaction flex flex-col gap-2 mt-8`}>
                  {actualQuantity === quantity && (
                    <div className="flex items-center gap-3 ">
                      <GoAlertFill color="yellow" size={20} />
                      <p className="text-red-600 font-semibold tracking-wider">
                        La quantité maximale de produits est de {actualQuantity}
                        .
                      </p>
                    </div>
                  )}
                  <div className="flex items-center  gap-4  ">
                    <button
                      type="button"
                      className="min-w-[200px] transition-colors px-4 py-3 bg-strongBeige hover:bg-mediumBeige text-white text-sm font-bold rounded"
                      onClick={() => {
                        AddToBasket(productDetails);
                        toast({
                          title: "Notification de Panier",
                          description: `Le produit "${productDetails?.name}" a été ajouté au panier.`,
                          className: "bg-white",
                        });
                      }}
                    >
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
                        className="transition-colors bg-transparent text-strongBeige text-xl hover:text-black font-bold rounded"
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
                        className=" text-strongBeige hover:text-black transition-colors text-xl font-bold rounded"
                        onClick={() => {
                          addToCompare(productDetails);

                          toast({
                            title: "Produit ajouté à la comparaison",
                            description: `Le produit "${productDetails?.name}" a été ajouté à la comparaison.`,
                            className: "bg-white",
                          });
                        }}
                      >
                        <GoGitCompare className="font-bold" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="Rating_stars flex col-span-7 space-x-2 mt-4 items-center">
                  {[...Array(5)].map((_, index) => {
                    const currentIndex = index + 1;
                    return (
                      <label key={currentIndex}>
                        <input
                          className="hidden "
                          type="radio"
                          name="rating"
                          value={currentIndex}
                          onClick={() => {
                            setRating(currentIndex);
                            addRating({
                              variables: {
                                productId: productId,
                                userId: decodedToken?.userId,
                                rating: currentIndex,
                              },
                            });
                          }}
                        />
                        <FaStar
                          size={18}
                          className="cursor-pointer"
                          color={
                            currentIndex <= (hover || rating || userReviews)
                              ? "#f17e7e"
                              : "grey"
                          }
                          onMouseEnter={() => setHover(currentIndex)}
                          onMouseLeave={() => setHover(null)}
                        />
                      </label>
                    );
                  })}
                  <h4 className="text-strongBeige text-sm">
                    {reviews} Commentaires
                  </h4>
                </div>

                <div className="Rating mt-8">
                  <div className="mt-8">
                    <h3 className="text-lg font-bold text-strongBeige">
                      Note globale ({reviews})
                    </h3>
                    <div className="space-y-4 mt-6">
                      {[
                        { rating: 5, value: fiveStar },
                        { rating: 4, value: fourStar },
                        { rating: 3, value: threeStar },
                        { rating: 2, value: twoStar },
                        { rating: 1, value: oneStar },
                      ].map(({ rating, value }) => (
                        <div className="flex items-center gap-3" key={rating}>
                          <div className="flex items-center ">

                          <p className="text-sm font-bold">{rating}.0</p>
                          <FaStar size={20} className="text-strongBeige ml-1" />
                          </div>
                          <div className="relative bg-gray-400 rounded-md w-full h-2 ml-3">
                            <div
                              style={{ width: `${(value / reviews) * 100}%` }}
                              className="h-full rounded bg-strongBeige"
                            ></div>
                            
                          </div>
                          <p className="text-sm font-bold ">
                            {((value / reviews) * 100)}%
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {attributes && (
            <div className=" my-10 mx-5 lg:mx-auto max-w-7xl m-auto  shadow-2xl ">
              <h3 className="text-lg font-bold  text-white w-fit p-3 bg-strongBeige">
                Information de produit
              </h3>
              <ul className="mt-6 space-y-6 text-[#333] p-6">
                {attributes?.map((attribute: any, index: number) => (
                  <li key={index} className="text-sm pb-2 border-b">
                    {attribute.name.toUpperCase()}{" "}
                    <span className="ml-4 float-right">
                      {attribute.value.toUpperCase()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <div className="Carousel voir aussi px-10 mb-[15%]">
        <TitleProduct title={"Voir aussi"} />
        <div>
          <ProductTabs
            data={Products_10?.products}
            loadingNewProduct={loadingNewProduct}
            carouselWidthClass={
              Products_10?.productsLessThen20?.length < 5
                ? " basis-full   md:basis-1/2  "
                : " basis-full  md:basis-1/2 lg:basis-1/3 xl:basis-1/4   xxl:basis-1/5"
            }
          />
        </div>
      </div>
      <ProductDetailsDrawer
        isBottom={isBottom}
        productId={productId}
        productDetails={productDetails}
        addToBasket={addToBasket}
        discount={discount}
        actualQuantity={actualQuantity}
        setActualQuantity={setActualQuantity}
      />
    </>
  );
};

export default ProductDetails;
