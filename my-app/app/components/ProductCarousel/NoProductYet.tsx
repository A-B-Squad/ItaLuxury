"use client";
import Image from "next/image";

import React from "react";

const NoProductYet = () => {
  return (
    <div className="grid items-center w-full grid-cols-2 sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="bg-whie border rounded-md overflow-hidden">
          <div className="h-56 w-56   bg-gray-50 animate-pulse flex items-center justify-center">
            <Image
              src={"/images/ui/sale.webp"}
              width={100}
              height={100}
              alt="Product"
            />

          </div>
          <div className="p-3 bg-white">
            <div className="h-2 w-3/4 bg-gray-200 rounded-full mb-2 animate-pulse"></div>
            <div className="h-2 w-1/2 bg-gray-200 rounded-full mb-2 animate-pulse"></div>
            <div className="h-2 w-full bg-gray-200 rounded-full mb-2 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoProductYet;
