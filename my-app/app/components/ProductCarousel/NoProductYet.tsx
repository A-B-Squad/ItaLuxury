"use client";
import React from "react";

const NoProductYet = () => {
  return (
    <div className="pl-4 grid items-center grid-cols-2 sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {[...Array(12)].map((_, index) => (
        <div key={index} className="bg-whie border rounded-md overflow-hidden">
          <div className="h-32   bg-gray-50 animate-pulse"></div>
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
