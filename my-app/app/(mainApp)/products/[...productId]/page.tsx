"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useLazyQuery, gql, useMutation } from "@apollo/client";
import InnerImageZoom from "react-inner-image-zoom";
import { FaStar } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { RiSubtractFill } from "react-icons/ri";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { FaRegHeart } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";
import {
  useComparedProductsStore,
  useBasketStore,
} from "../../../store/zustand";
import { GoGitCompare } from "react-icons/go";
import PopHover from "../../../components/PopHover";
import ProductDetailsDrawer from "../../../components/productDetailsDrawer";
const ProductDetails = ({ params }: { params: { productId: string } }) => {
  const SearchParams = useSearchParams();
  const productId = SearchParams.get("productId");
  const [productDetails, setProductDetails] = useState<any>(null);
  const [bigImage, setBigImage] = useState<any>(null);
  const [smallImages, setSmallImages] = useState<any>(null);
  const [colors, setColors] = useState<any>(null);
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<any>(null);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [discount, setDiscount] = useState<any>(null);
  const [reviews, setReviews] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [attributes, setAttributes] = useState<any>(null);
  const [showPopover, setShowPopover] = useState(false);
  const [popoverTitle, setPopoverTitle] = useState("");
  const [isBottom, setIsBottom] = useState(false);
  const toggleIsUpdated = useBasketStore((state) => state.toggleIsUpdated);

  const handleMouseEnter = (title: any) => {
    setShowPopover(true);
    setPopoverTitle(title);
  };

  const handleMouseLeave = () => {
    setShowPopover(false);
    setPopoverTitle("");
  };

  const addProductToCompare = useComparedProductsStore(
    (state) => state.addProductToCompare
  );

  interface DecodedToken extends JwtPayload {
    userId: string;
  }

  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
    getReviews({
      variables: { productId: params.productId[0] },
      onCompleted: (data) => {
        setReviews(data.productReview.length);
      },
    });
  }, []);

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
    const handleScroll = () => {
      const isPageBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight;
      setIsBottom(isPageBottom);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const PRODUCT_BY_ID_QUERY = gql`
    query ProductById($productByIdId: ID!) {
      productById(id: $productByIdId) {
        id
        name
        price
        isVisible
        reference
        description
        inventory
        solde
        images
        createdAt
        productDiscounts {
          id
          price
          newPrice
          dateOfEnd
          dateOfStart
        }
        Colors {
          id
          color
          Hex
        }
        attributes {
          id
          name
          value
        }
      }
    }
  `;

  const GET_PRODUCT_IMAGES_QUERY = gql`
    query Query($productId: String!, $colorId: String!) {
      getProductImages(productId: $productId, colorId: $colorId)
    }
  `;

  const ADD_RATING_MUTATION = gql`
    mutation AddRating($productId: ID!, $userId: ID!, $rating: Int!) {
      addRating(productId: $productId, userId: $userId, rating: $rating)
    }
  `;
  const GET_REVIEW_QUERY = gql`
    query ProductReview($productId: ID!) {
      productReview(productId: $productId) {
        id
        rating
        userId
      }
    }
  `;

  const ADD_TO_BASKET = gql`
    mutation AddToBasket($input: CreateToBasketInput!) {
      addToBasket(input: $input) {
        id
        userId
        quantity
        productId
      }
    }
  `;

  const ADD_TO_FAVORITE = gql`
    mutation AddProductToFavorite($input: AddProductToFavoriteInput!) {
      addProductToFavorite(input: $input) {
        id
        userId
        productId
      }
    }
  `;

  const [getReviews] = useLazyQuery(GET_REVIEW_QUERY);
  const [getProductImages] = useLazyQuery(GET_PRODUCT_IMAGES_QUERY);
  const [addToBasket] = useMutation(ADD_TO_BASKET);
  const [addToFavorite] = useMutation(ADD_TO_FAVORITE);

  const productById = useQuery(PRODUCT_BY_ID_QUERY, {
    variables: { productByIdId: productId },
    onCompleted: (data) => {
      setProductDetails(data.productById);
      setBigImage(data.productById.images[0]);
      setSmallImages(data.productById.images);
      setColors(
        data.productById.ProductColorImage.map((image: any) => image.Colors)
      );
      console.log('====================================');
      console.log(data,"aaaa");
      console.log('====================================');
      setDiscount(data.productById.productDiscounts[0]);
      setAttributes(data.productById.attributes);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const [addRating] = useMutation(ADD_RATING_MUTATION);

  const addToCompare = (product: any) => {
    addProductToCompare(product);
    setSuccessMsg("Produit ajouté au comparaison !");
  };

  return (
    <>
      {!!productDetails ? (
        <>
          <div>
            {successMsg && (
              <div
                id="alert-3"
                className="flex items-center p-4 mb-4 text-green-800 rounded-lg bg-green-50 "
                role="alert"
              >
                <svg
                  className="flex-shrink-0 w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="sr-only">Info</span>
                <div className="ms-3 text-sm font-medium tracking-widest">
                  {successMsg}
                </div>
                <button
                  type="button"
                  className="ms-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8 "
                  onClick={() => setSuccessMsg("")}
                  data-dismiss-target="#alert-3"
                  aria-label="Close"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                </button>
              </div>
            )}
            <div className="p-6 lg:max-w-7xl max-w-2xl max-lg:mx-auto">
              <div className="grid items-start grid-cols-12 gap-10  ">
                <div className=" flex lg:flex-row flex-col gap-2 col-span-12 lg:col-span-7 w-full text-center">
                  <div className="relative shadow-xl  border-2  flex items-center justify-center px-5 py-10 rounded-xl">
                    <InnerImageZoom
                      className="w-4/5 rounded object-cover"
                      zoomSrc={bigImage}
                      src={bigImage}
                      zoomType="hover"
                      hideHint
                      zoomScale={1.5}
                    />
                    <span
                      className={
                        "absolute top-2 right-0 p-2  bg-strongBeige text-xs font-400 text-white"
                      }
                    >
                      {productDetails.inventory > 0
                        ? "EN STOCK"
                        : "STOCK EN RUPTURE "}
                    </span>
                  </div>
                  <div className="mt-6 flex lg:flex-col  justify-center gap-3 mx-auto">
                    {smallImages.map((image: string, index: number) => (
                      <div
                        key={index}
                        className="shadow-md w-fit h-fit rounded-md p-[7px]"
                      >
                        <img
                          src={image}
                          alt="Product2"
                          className="w-24 cursor-pointer"
                          onMouseEnter={() => {
                            setBigImage(image);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="product lg:col-span-5 col-span-12 ">
                  <h2 className="product_name tracking-wider text-2xl font-semibold ">
                    {productDetails.name}
                  </h2>

                  <div className="discount flex    flex-col  gap-1 mt-4">
                    <p className="text-strongBeige tracking-wide text-3xl font-bold">
                      {discount
                        ? discount.newPrice.toFixed(3)
                        : productDetails.price.toFixed(3)}{" "}
                      <span className="text-2xl ">TND</span>
                      {!discount && (
                        <span className="text-sm text-gray-400 ml-2 font-medium">
                          TTC
                        </span>
                      )}
                    </p>

                    {discount && (
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
                            setQuantity(quantity - 1);
                          }}
                        >
                          <RiSubtractFill />
                        </button>
                        <button
                          type="button"
                          className="bg-transparent px-3 py-1 font-semibold text-[#333] text-md"
                        >
                          {quantity}
                        </button>
                        <button
                          type="button"
                          className="bg-strongBeige text-white px-3 py-1 font-semibold cursor-pointer"
                          onClick={() => {
                            setQuantity(quantity + 1);
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
                        <li>{productDetails.description}</li>
                      </ul>
                    </div>
                  </div>

                  <div className="Add_to_basket flex items-center gap-4 mt-8">
                    <button
                      type="button"
                      className="min-w-[200px] transition-colors px-4 py-3 bg-strongBeige hover:bg-mediumBeige text-white text-sm font-bold rounded"
                      onClick={() => {
                        addToBasket({
                          variables: {
                            input: {
                              userId: decodedToken?.userId,
                              quantity: quantity,
                              productId: productId,
                            },
                          },
                        });

                        setSuccessMsg("Produit ajouté avec succès au panier !");
                        toggleIsUpdated();
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
                        onClick={() => {
                          addToFavorite({
                            variables: {
                              input: {
                                userId: decodedToken?.userId,
                                productId: productId,
                              },
                            },
                          });
                          setSuccessMsg(
                            "Produit ajouté avec succès au favoris !"
                          );
                        }}
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
                        onClick={() => addToCompare(productDetails)}
                      >
                        <GoGitCompare className="font-bold" />
                      </button>
                    </div>
                  </div>

                  <div className="Rating_stars flex space-x-2 mt-4 items-center">
                    {[...Array(5)].map((_, index) => {
                      const currentIndex = index + 1;
                      return (
                        <label key={currentIndex}>
                          <input
                            className="hidden"
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
                            size={20}
                            className="cursor-pointer"
                            color={
                              currentIndex <= (hover || rating)
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
                        Commentaires({reviews})
                      </h3>
                      <div className="space-y-3 mt-4">
                        <div className="flex items-center">
                          <p className="text-sm text-white font-bold">5.0</p>

                          <FaStar size={20} className="text-strongBeige" />

                          <div className="bg-gray-400 rounded w-full h-2 ml-3">
                            <div className="w-2/3 h-full rounded bg-strongBeige"></div>
                          </div>
                          <p className="text-sm text-white font-bold ml-3">
                            66%
                          </p>
                        </div>
                        <div className="flex items-center">
                          <p className="text-sm text-white font-bold">4.0</p>
                          <FaStar size={20} className="text-strongBeige" />

                          <div className="bg-gray-400 rounded w-full h-2 ml-3">
                            <div className="w-1/3 h-full rounded bg-strongBeige"></div>
                          </div>
                          <p className="text-sm text-white font-bold ml-3">
                            33%
                          </p>
                        </div>
                        <div className="flex items-center">
                          <p className="text-sm text-white font-bold">3.0</p>
                          <FaStar size={20} className="text-strongBeige" />

                          <div className="bg-gray-400 rounded w-full h-2 ml-3">
                            <div className="w-1/6 h-full rounded bg-strongBeige"></div>
                          </div>
                          <p className="text-sm text-white font-bold ml-3">
                            16%
                          </p>
                        </div>
                        <div className="flex items-center">
                          <p className="text-sm text-white font-bold">2.0</p>
                          <FaStar size={20} className="text-strongBeige" />

                          <div className="bg-gray-400 rounded w-full h-2 ml-3">
                            <div className="w-1/12 h-full rounded bg-strongBeige"></div>
                          </div>
                          <p className="text-sm text-white font-bold ml-3">
                            8%
                          </p>
                        </div>
                        <div className="flex items-center">
                          <p className="text-sm text-white font-bold">1.0</p>
                          <FaStar size={20} className="text-strongBeige" />

                          <div className="bg-gray-400 rounded w-full h-2 ml-3">
                            <div className="w-[6%] h-full rounded bg-strongBeige"></div>
                          </div>
                          <p className="text-sm text-white font-bold ml-3">
                            6%
                          </p>
                        </div>
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
                  {attributes.map((attribute: any) => (
                    <li className="text-sm pb-2 border-b">
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
          <ProductDetailsDrawer
            isBottom={isBottom}
            productId={productId}
            productDetails={productDetails}
            addToBasket={addToBasket}
            setSuccessMsg={setSuccessMsg}
            discount={discount}
            quantity={quantity}
            setQuantity={setQuantity}
          />
        </>
      ) : (
        <div
          role="status"
          className="flex items-center justify-center h-screen"
        >
          <svg
            aria-hidden="true"
            className="w-20 h-20 text-gray-200 animate-spin fill-strongBeige"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
