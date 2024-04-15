import { useProductDetails } from "../../store/zustand";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import InnerImageZoom from "react-inner-image-zoom";
import { RiSubtractFill } from "react-icons/ri";
import { IoCloseOutline } from "react-icons/io5";

const ProductDetails = () => {
  const { isOpen, productData, closeProductDetails } = useProductDetails();
  const [bigImage, setBigImage] = useState<any>(productData?.images[0]);
  const [quantity, setQuantity] = useState<number>(1);

  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const moveCursor = (e: any) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <>
      <div
        onClick={closeProductDetails}
        className={`fixed cursor-none z-50  ${isOpen ? "translate-y-0 opacity-100 z-50" : "translate-y-96 opacity-0 -z-50"} left-0 top-0 transition-all bg-lightBlack h-full flex justify-center items-center w-full`}
      >
        <IoCloseOutline
          size={40}
          className="animate-pulse"
          style={{ position: "fixed", top: position.y, left: position.x }}
        />
      </div>


      <div
        className={`fixed  z-50  ${isOpen ? "-translate-y-2/4 opacity-100 z-50" : "translate-y-96 opacity-0 -z-50" }  grid grid-flow-row grid-cols-4 cursor-default left-2/4 -translate-x-2/4  top-2/4 transition-all bg-white w-4/5 shadow-xl p-8 place-content-center rounded-md  `}
      >

        <IoCloseOutline
          size={40}
          onClick={closeProductDetails}
          className="absolute bg-white rounded-full p-2 hover:rotate-180 transition-all cursor-pointer -right-2 -top-3"
        />
        <div className="flex relative  col-span-2 justify-center items-start flex-col gap-2 text-center">
          <div className="shadow-xl relative  border-2 max-w-xs flex items-center justify-center p-1 rounded-xl">
            <InnerImageZoom
              className="relative w-full rounded object-cover"
              zoomSrc={bigImage}
              src={bigImage}
              zoomType="hover"
              hideHint
              zoomScale={1.5}
            />
          </div>
          <div className="mt-6 flex justify-center gap-3">
            {productData?.images.map((image: string, index: number) => (
              <div
                key={index}
                className={`shadow-md w-24 h-24 rounded-md p-[7px] ${
                  image === bigImage ? "border-2 border-mediumBeige" : ""
                }`}
              >
                <Image
                  src={image}
                  alt={`Product Image ${index + 1}`}
                  layout="responsive"
                  height={30}
                  width={30}
                  className="w-8 h-8 cursor-pointer"
                  onMouseEnter={() => {
                    setBigImage(image);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="product col-span-2 ">
          <h2 className="product_name tracking-wider text-2xl font-semibold ">
            {productData?.name}
          </h2>
          <div className="flex flex-col gap-1 mt-4">
            <p className="text-strongBeige tracking-wide text-3xl font-bold">
              {productData?.productDiscounts[0]
                ? productData?.productDiscounts[0].newPrice.toFixed(3)
                : productData?.price.toFixed(3)}{" "}
              <span className="text-2xl">TND</span>
              {!productData?.productDiscounts[0] && (
                <span className="text-sm text-gray-400 ml-2 font-medium">
                  TTC
                </span>
              )}
            </p>
            {productData?.productDiscounts[0] && (
              <div className="text-gray-400 tracking-wide flex items-center text-lg gap-2">
                <p className="line-through">
                  {productData?.productDiscounts[0].price.toFixed(3)} TND
                </p>
                <p className="text-sm bg-violet-700 text-white p-1">
                  Économisez{" "}
                  <span className="font-bold ml-1">
                    {(
                      productData?.productDiscounts[0].price -
                      productData?.productDiscounts[0].newPrice
                    ).toFixed(3)}{" "}
                    TND
                  </span>
                </p>
                <span className="text-sm">TTC</span>
              </div>
            )}
          </div>
          <p className=" text-sm">Reference:{productData?.reference}</p>

          <div className="border-t-2 mt-4">
            <div className="flex items-center mt-4  space-x-2">
              <h3 className="text-lg tracking-wider font-bold  capitalize text-strongBeige">
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
            <div className="mt-3">
              <h3 className="text-lg tracking-wider font-bold capitalize text-strongBeige">
                Description
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                {productData?.description}
              </p>
            </div>
            <div className="mt-4">
              {productData?.Colors && (
                <div
                  className="colors_available w-5 h-5 border-black border-2 shadow-gray-400 shadow-sm"
                  style={{ backgroundColor: productData?.Colors.Hex }}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col justify-start items-start gap-4 mt-8">
            <p
              className={` text-xl font-bold  ${productData?.inventory > 0 ? "text-green-600" : "text-red-700"}`}
            >
              {productData?.inventory > 0 ? "En Stock" : "En Rupture"}
            </p>
            <button
              type="button"
              className="min-w-[200px] transition-colors px-4 py-3 bg-strongBeige hover:bg-mediumBeige text-white text-sm font-bold rounded"
              // onClick={() => {
              //   addToBasket({
              //     variables: {
              //       input: {
              //         userId: decodedToken?.userId,
              //         quantity: quantity,
              //         productId: productData?.id,
              //       },
              //     },
              //   });
              //   setSuccessMsg("Produit ajouté avec succès au panier !");
              // }}
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
