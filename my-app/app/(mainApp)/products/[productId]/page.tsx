"use client";

import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";

const ProductDetails = ({ params }: { params: { productId: string } }) => {
  console.log("====================================");
  console.log(params.productId);
  console.log("====================================");
  const [productDetails, setProductDetails] = useState<any>(null);
  const [bigImage, setBigImage] = useState<any>(null);
  const [smallImages, setSmallImages] = useState<any>(null);


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
      }
    }
  `;

  const productById = useQuery(PRODUCT_BY_ID_QUERY, {
    variables: { productByIdId: params.productId },
    onCompleted: (data) => {
      console.log(data.productById);
      setProductDetails(data.productById);
      setBigImage(data.productById.images[0]);
      setSmallImages(data.productById.images);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return (
    <>
      {!!productDetails ? (
        <div className="font-[sans-serif]">
          <div className="p-6 lg:max-w-7xl max-w-2xl max-lg:mx-auto">
            <div className="grid items-start grid-cols-1 lg:grid-cols-5 gap-12">
              <div className="lg:col-span-3 w-full lg:sticky top-0 text-center">
                <div className="bg-lightBeige px-4 py-10 rounded-xl">
                  <img
                    src={bigImage}
                    alt="Product"
                    className="w-4/5 rounded object-cover"
                  />
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-x-10 gap-y-6 mx-auto">
                  {smallImages.map((image:string) => (
                    <div className="bg-lightBeige rounded-xl p-4">
                      <img
                        src={image}
                        alt="Product2"
                        className="w-24 cursor-pointer"
                        onClick={()=>{
                          setBigImage(image)
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
                    {productDetails.price} DT
                  </p>
                  {/* <p className="text-gray-400 text-xl">
                    <p className="line-through">16 DT</p>{" "}
                    <span className="text-sm ml-1">Tax inclus</span>
                  </p> */}
                </div>
                <div className="flex space-x-2 mt-4">
                  <svg
                    className="w-5 fill-strongBeige"
                    viewBox="0 0 14 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                  </svg>
                  <svg
                    className="w-5 fill-strongBeige"
                    viewBox="0 0 14 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                  </svg>
                  <svg
                    className="w-5 fill-strongBeige"
                    viewBox="0 0 14 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                  </svg>
                  <svg
                    className="w-5 fill-strongBeige"
                    viewBox="0 0 14 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                  </svg>
                  <svg
                    className="w-5 fill-[#CED5D8]"
                    viewBox="0 0 14 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                  </svg>
                  <h4 className="text-strongBeige text-base">500 Reviews</h4>
                </div>
                <div className="flex flex-wrap gap-4 mt-8">
                  <button
                    type="button"
                    className="min-w-[200px] px-4 py-3 bg-strongBeige hover:bg-mediumBeige text-white text-sm font-bold rounded"
                  >
                    Ajouter au panier
                  </button>
                  <button
                    type="button"
                    className="min-w-[200px] px-4 py-2.5 border border-strongBeige bg-transparent text-strongBeige hover:bg-strongBeige hover:text-white text-sm font-bold rounded"
                  >
                    Ajouter au favoris
                  </button>
                </div>
                <div className="mt-8">
                  <div className="mt-10">
                    <h3 className="text-lg font-bold text-strongBeige">
                      Choisir une couleur
                    </h3>
                    <div className="flex flex-wrap gap-4 mt-4">
                      <button
                        type="button"
                        className="w-12 h-12 bg-black border-2 border-white hover:border-gray-800 rounded-full shrink-0"
                      ></button>
                      <button
                        type="button"
                        className="w-12 h-12 bg-gray-300 border-2 border-white hover:border-gray-800 rounded-full shrink-0"
                      ></button>
                      <button
                        type="button"
                        className="w-12 h-12 bg-gray-100 border-2 border-white hover:border-gray-800 rounded-full shrink-0"
                      ></button>
                      <button
                        type="button"
                        className="w-12 h-12 bg-blue-400 border-2 border-white hover:border-gray-800 rounded-full shrink-0"
                      ></button>
                    </div>
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
                      Commentaires(10)
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
          {/* <div className="mt-16 mb-10 mx-10 shadow-2xl p-6">
            <h3 className="text-lg font-bold text-[#333]">Information de produit</h3>
            <ul className="mt-6 space-y-6 text-[#333]">
              <li className="text-sm pb-2 border-b">
                TYPE <span className="ml-4 float-right">LAPTOP</span>
              </li>
              <li className="text-sm pb-2 border-b">
                RAM <span className="ml-4 float-right">16 BG</span>
              </li>
              <li className="text-sm pb-2 border-b">
                SSD <span className="ml-4 float-right">1000 BG</span>
              </li>
              <li className="text-sm pb-2 border-b">
                PROCESSOR TYPE{" "}
                <span className="ml-4 float-right">INTEL CORE I7-12700H</span>
              </li>
              <li className="text-sm pb-2 border-b">
                PROCESSOR SPEED{" "}
                <span className="ml-4 float-right">2.3 - 4.7 GHz</span>
              </li>
              <li className="text-sm pb-2 border-b">
                DISPLAY SIZE INCH <span className="ml-4 float-right">16.0</span>
              </li>
              <li className="text-sm pb-2 border-b">
                DISPLAY SIZE SM <span className="ml-4 float-right">40.64 cm</span>
              </li>
              <li className="text-sm pb-2 border-b">
                DISPLAY TYPE{" "}
                <span className="ml-4 float-right">OLED, TOUCHSCREEN, 120 Hz</span>
              </li>
              <li className="text-sm pb-2 border-b">
                DISPLAY RESOLUTION{" "}
                <span className="ml-4 float-right">2880x1620</span>
              </li>
            </ul>
          </div> */}
        </div>
      ) : (
        <div> Loading ... </div>
      )}
    </>
  );
};

export default ProductDetails;
