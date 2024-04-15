import PopHover from "@/app/components/PopHover";
import { gql, useQuery } from "@apollo/client";
import Image from "next/image";
import React, { useState } from "react";

const TopDeals = () => {
  const [showPopover, setShowPopover] = useState(false);
  const [popoverTitle, setPopoverTitle] = useState("");
  const [popoverIndex, setPopoverIndex] = useState<number>(0);
  const handleMouseEnter = (title: string, index: number) => {
    setShowPopover(true);
    setPopoverTitle(title);
    setPopoverIndex(index);
  };

  const handleMouseLeave = () => {
    setShowPopover(false);
    setPopoverTitle("");
    setPopoverIndex(0);
  };

  const TOP_DEALS = gql`
    query AllDeals {
      allDeals {
        product {
          id
          name
          price
          reference
          description
          createdAt
          inventory
          images
          attributes {
            name
            value
          }
          categories {
            name
          }
          Colors {
            color
            Hex
          }
          productDiscounts {
            price
            newPrice
            Discount {
              percentage
            }
          }
        }
      }
    }
  `;
  const { loading: loadingNewDeals, data: topDeals } = useQuery(TOP_DEALS);

  return (
    <div className="md:grid grid-cols-2 gap-3 grid-flow-col  block">
      {topDeals?.allDeals.map((products: any, index: number) => {

        return (
          <div
            key={index}
            className="grid lg:grid-cols-3 grid-cols-1 rounded-lg p-2 h-4/5 md:h-full  lg:h-80 min-h-80 w-full lg:w-11/12 grid-flow-col grid-rows-2 lg:grid-rows-1 lg:grid-flow-row  place-self-center  items-center gap-5 shadow-lg relative"
          >
            <span className="absolute left-5 top-5 z-50 text-white bg-green-600 px-4 font-semibold text-sm py-1 rounded-md">
              {products?.product?.productDiscounts[0]?.Discount.percentage}%
            </span>

            <div className="relative lg:col-span-1 row-span-1 lg:row-span-1 h-56 lg:h-full  w-full">
              <Image
                layout="fill"
                objectFit="contain"
                className="h-full w-full"
                src={products?.product?.images[0]}
                alt="product"
              />
            </div>

            <div className="lg:col-span-2 row-span-1 lg:row-span-1  place-self-stretch lg:mt-3 flex flex-col justify-around ">
              <h2 className="tracking-wider">{products?.product?.name}</h2>
              <div className="prices flex gap-3 text-lg lg:mt-3">
                <span className="text-strongBeige font-semibold">
                  {products?.product?.productDiscounts[0]?.newPrice.toFixed(3)}
                  TND
                </span>
                <span className="line-through text-gray-400">
                  {products?.product?.price.toFixed(3)}TND
                </span>
              </div>

              <ul className=" text-xs md:text-sm text-gray-500 tracking-wider mt-2">
                {products?.product?.attributes
                  .slice(0, 4)
                  .map((attribute: any, i: number) => (
                    <li key={i}>
                      <span className="text-sm font-semibold">
                        {attribute.name}
                      </span>{" "}
                      : <span className="text-base">{attribute.value}</span>
                    </li>
                  ))}
              </ul>

              <div
                className="Color relative w-fit cursor-crosshair my-3 lg:my-0"
                onMouseEnter={() =>
                  handleMouseEnter(products?.product?.Colors?.color, index)
                }
                onMouseLeave={handleMouseLeave}
              >
                {showPopover &&
                  popoverTitle === products?.product?.Colors?.color &&
                  popoverIndex == index && (
                    <PopHover title={products?.product?.Colors?.color} />
                  )}
                {products?.product.Colors && (
                  <div
                    className="colors_available items-center   lg:mt-2 w-5 h-5  border-black border-2 rounded-sm shadow-gray-400 shadow-sm"
                    style={{
                      backgroundColor: products?.product?.Colors?.Hex,
                    }}
                  />
                )}
              </div>

              <button className=" rounded-lg bg-strongBeige w-full py-2 text-white lg:mt-3 hover:bg-mediumBeige transition-colors">
                Acheter maintenant
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TopDeals;
