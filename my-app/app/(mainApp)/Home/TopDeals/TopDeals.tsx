import PopHover from "@/app/components/PopHover";
import React, { useState } from "react";

const TopDeals = ({ data }: any) => {
  const [showPopover, setShowPopover] = useState(false);
  const [popoverTitle, setPopoverTitle] = useState("");
  const [popoverIndex, setPopoverIndex] = useState("");
  const handleMouseEnter = (title: string, index: string) => {
    setShowPopover(true);
    setPopoverTitle(title);
    setPopoverIndex(index);
  };

  const handleMouseLeave = () => {
    setShowPopover(false);
    setPopoverTitle("");
    setPopoverIndex("");
  };
  return (
    <div className="md:grid grid-cols-2 gap-3 grid-flow-col  block">
      {[1, 2].map((i: number) => {
        return (
          <div
            key={i}
            className="grid grid-cols-3 rounded-md p-2 h-72  items-center gap-5 shadow-lg relative"
          >
            <span className="absolute left-5 top-5 text-white bg-green-600 px-4 font-thin text-sm py-1 rounded-md">
              -5%
            </span>
            <div className="bg-red-400 col-span-1 h-full w-full">IMG</div>
            <div className="col-span-2 items-start place-content-start">
              <h2>Apple iPhone 11 Pro 256GB Gris Sidéral – Débloqué</h2>
              <div className="prices flex gap-5 text-lg">
                <span className="text-strongBeige">999,99 $</span>
                <span className="line-through text-gray-400">999,99 $</span>
              </div>
              {/* <div
                      className="relative w-fit cursor-crosshair"
                      onMouseEnter={() =>
                        handleMouseEnter(product?.Colors?.color, index)
                      }
                      onMouseLeave={handleMouseLeave}
                    >
                      {showPopover &&
                        popoverTitle === product?.Colors?.color &&
                        popoverIndex == index && (
                          <PopHover title={product?.Colors?.color} />
                        )}
                      {product.Colors && (
                        <div
                          className="colors_available items-center   mt-2 w-5 h-5  border-black border-2 rounded-sm shadow-gray-400 shadow-sm"
                          style={{
                            backgroundColor: product?.Colors?.Hex,
                          }}
                        />
                      )}
                    </div> */}
              <ul className="list-disc text-xs md:text-base text-gray-600 ">
                <li>Taille de l'écran : 10,9 pouces</li>
                <li>Taille de l'écran : 10,9 pouces</li>
                <li>Taille de l'écran : 10,9 pouces</li>
              </ul>
              <button className="rounded-lg bg-strongBeige w-full py-2 text-white">
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
