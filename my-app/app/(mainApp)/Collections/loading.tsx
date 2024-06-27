"use client";
import React from "react";

const Loading = () => {
  return (
    <div className=" fixed flex items-center z-[1000]  top-0 left-0  justify-center h-screen w-full bg-white ">
      <div className="loader"></div>
    </div>
  );
};

export default Loading;
