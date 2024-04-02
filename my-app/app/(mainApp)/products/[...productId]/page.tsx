"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useLazyQuery, gql, useMutation } from "@apollo/client";
import ReactImageMagnify from "react-image-magnify";
import { FaStar } from "react-icons/fa";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { useComparedProductsStore } from "@/app/store/zustand";
import { GoGitCompare } from "react-icons/go";

const ProductDetails = ({ params }: { params: { productId: string } }) => {
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
    }, 1000);

    return () => clearInterval(interval);
  }, [bigImage, smallImages]);

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
        ProductColorImage {
          Colors {
            id
            color
            Hex
          }
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
    variables: { productByIdId: params.productId[0] },
    onCompleted: (data) => {
      setProductDetails(data.productById);
      setBigImage(data.productById.images[0]);
      setSmallImages(data.productById.images);
      setColors(
        data.productById.ProductColorImage.map((image: any) => image.Colors)
      );
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
        <div className="font-[sans-serif]">
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
              <div className="ms-3 text-sm font-medium">{successMsg}</div>
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
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>
          )}
          <div className="p-6 lg:max-w-7xl max-w-2xl max-lg:mx-auto">
            <div className="grid items-start grid-cols-1 lg:grid-cols-5 gap-12">
              <div className="lg:col-span-3 w-full lg:sticky top-0 text-center">
                <div className="bg-lightBeige flex items-center justify-center px-4 py-10 rounded-xl">
                  <ReactImageMagnify
                    className="w-4/5 rounded object-cover"
                    {...{
                      smallImage: {
                        alt: "product",
                        isFluidWidth: true,
                        src: bigImage,
                      },
                      largeImage: {
                        src: bigImage,
                        width: 1120,
                        height: 1800,
                      },
                    }}
                  />
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-x-10 gap-y-6 mx-auto">
                  {smallImages.map((image: string, index: number) => (
                    <div key={index} className="bg-lightBeige rounded-xl p-4">
                      <img
                        src={image}
                        alt="Product2"
                        className="w-24 cursor-pointer"
                        onClick={() => {
                          setBigImage(image);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-extrabold text-strongBeige">
                  {productDetails.name}
                </h2>
                <div className="flex flex-wrap gap-4 mt-4">
                  <p className="text-strongBeige text-4xl font-bold">
                    {discount ? discount.newPrice : productDetails.price} DT
                  </p>
                  {discount && (
                    <>
                      <p className="text-gray-400 text-xl">
                        <p className="line-through">{productDetails.price} DT</p>{" "}
                        <span className="text-sm ml-1">Tax inclus</span>
                      </p>
                      <span className="bg-strongBeige max-h-8 text-white p-2 flex items-center rounded-lg">
                        {productDetails.price - discount?.newPrice} DT ECONOMISÈ
                      </span>
                    </>
                  )}
                </div>
                <div className="flex space-x-2 mt-4 items-center">
                  {[...Array(5)].map((star, index) => {
                    const currentIndex = index + 1;
                    return (
                      <label>
                        <input
                          className="hidden"
                          type="radio"
                          name="rating"
                          value={currentIndex}
                          onClick={() => {
                            setRating(currentIndex);
                            addRating({
                              variables: {
                                productId: params.productId[0],
                                userId: "aaa",
                                rating: currentIndex,
                              },
                            });
                          }}
                        />
                        <FaStar
                          size={28}
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
                  <h4 className="text-strongBeige text-base">
                    {reviews} Commentaires
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2 mt-8">
                  <button
                    type="button"
                    className="min-w-[200px] px-4 py-3 bg-strongBeige hover:bg-mediumBeige text-white text-sm font-bold rounded"
                    onClick={() => {
                      addToBasket({
                        variables: {
                          input: {
                            userId: "aaa",
                            quantity: quantity,
                            productId: params.productId[0],
                          },
                        },
                      });
                      setSuccessMsg("Produit ajouté avec succès au panier !");
                    }}
                  >
                    Ajouter au panier
                  </button>
                  <button
                    type="button"
                    className="min-w-[200px] px-4 py-2.5 border border-strongBeige bg-transparent text-strongBeige hover:bg-strongBeige hover:text-white text-sm font-bold rounded"
                    onClick={() => {
                      addToFavorite({
                        variables: {
                          input: {
                            userId: "aaa",
                            productId: params.productId[0],
                          },
                        },
                      });
                      setSuccessMsg("Produit ajouté avec succès au favoris !");
                    }}
                  >
                    Ajouter au favoris
                  </button>
                  <button
                    className=" px-4 py-3 bg-strongBeige hover:bg-mediumBeige text-white text-sm font-bold rounded"
                    onClick={() => addToCompare(productDetails)}
                  >
                    <GoGitCompare className="font-bold" />
                  </button>
                </div>
                <div className="mt-8">
                  <div className="mt-10">
                    <h3 className="text-lg font-bold text-strongBeige">
                      Choisir une couleur
                    </h3>
                    <div className="flex flex-wrap gap-4 mt-4">
                      {colors.map((color: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => {
                            getProductImages({
                              variables: {
                                productId: params.productId[0],
                                colorId: color.id,
                              },
                              onCompleted: (data) => {
                                setSmallImages(data.getProductImages);
                                setBigImage(data.getProductImages[0]);
                              },
                            });
                          }}
                          type="button"
                          className={`w-12 h-12  bg-${color.color}-500 border-2 border-white hover:border-gray-800 rounded-lg shrink-0`}
                        ></button>
                      ))}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-strongBeige mt-10">
                    Quantité
                  </h3>
                  <div className="flex divide-x border w-max">
                    <button
                      type="button"
                      className="bg-lightBeige px-4 py-2 font-semibold cursor-pointer"
                      onClick={() => {
                        setQuantity(quantity > 1 ? quantity - 1 : 1);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3 fill-current cursor-pointer"
                        viewBox="0 0 124 124"
                      >
                        <path
                          d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
                          data-original="#000000"
                        ></path>
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="bg-transparent px-4 py-2 font-semibold text-[#333] text-md"
                    >
                      {quantity}
                    </button>
                    <button
                      type="button"
                      className="bg-strongBeige text-white px-4 py-2 font-semibold cursor-pointer"
                      onClick={() => {
                        setQuantity(quantity + 1);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3 fill-current cursor-pointer"
                        viewBox="0 0 42 42"
                      >
                        <path
                          d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                          data-original="#000000"
                        ></path>
                      </svg>
                    </button>
                  </div>
                  <h3 className="text-lg font-bold text-strongBeige mt-10">
                    Description
                  </h3>
                  <ul className="space-y-3 list-disc mt-4 pl-4 text-sm text-gray-600">
                    <li>{productDetails.description}</li>
                  </ul>
                </div>
                <div className="mt-8">
                  <ul className="flex">
                    <li className="text-white font-bold text-sm bg-mediumBeige py-3 px-8 pb-2 border-b-2 border-strongBeige cursor-pointer transition-all">
                      Commentaires
                    </li>
                  </ul>
                  <div className="mt-8">
                    <h3 className="text-lg font-bold text-strongBeige">
                      Commentaires({reviews})
                    </h3>
                    <div className="space-y-3 mt-4">
                      <div className="flex items-center">
                        <p className="text-sm text-white font-bold">5.0</p>
                        <svg
                          className="w-5 fill-strongBeige ml-1"
                          viewBox="0 0 14 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                        </svg>
                        <div className="bg-gray-400 rounded w-full h-2 ml-3">
                          <div className="w-2/3 h-full rounded bg-strongBeige"></div>
                        </div>
                        <p className="text-sm text-white font-bold ml-3">66%</p>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm text-white font-bold">4.0</p>
                        <svg
                          className="w-5 fill-strongBeige ml-1"
                          viewBox="0 0 14 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                        </svg>
                        <div className="bg-gray-400 rounded w-full h-2 ml-3">
                          <div className="w-1/3 h-full rounded bg-strongBeige"></div>
                        </div>
                        <p className="text-sm text-white font-bold ml-3">33%</p>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm text-white font-bold">3.0</p>
                        <svg
                          className="w-5 fill-strongBeige ml-1"
                          viewBox="0 0 14 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                        </svg>
                        <div className="bg-gray-400 rounded w-full h-2 ml-3">
                          <div className="w-1/6 h-full rounded bg-strongBeige"></div>
                        </div>
                        <p className="text-sm text-white font-bold ml-3">16%</p>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm text-white font-bold">2.0</p>
                        <svg
                          className="w-5 fill-strongBeige ml-1"
                          viewBox="0 0 14 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                        </svg>
                        <div className="bg-gray-400 rounded w-full h-2 ml-3">
                          <div className="w-1/12 h-full rounded bg-strongBeige"></div>
                        </div>
                        <p className="text-sm text-white font-bold ml-3">8%</p>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm text-white font-bold">1.0</p>
                        <svg
                          className="w-5 fill-strongBeige ml-1"
                          viewBox="0 0 14 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                        </svg>
                        <div className="bg-gray-400 rounded w-full h-2 ml-3">
                          <div className="w-[6%] h-full rounded bg-strongBeige"></div>
                        </div>
                        <p className="text-sm text-white font-bold ml-3">6%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {attributes && (
            <div className="mt-16 mb-10 mx-10 shadow-2xl p-6">
              <h3 className="text-lg font-bold text-[#333]">
                Information de produit
              </h3>
              <ul className="mt-6 space-y-6 text-[#333]">
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
