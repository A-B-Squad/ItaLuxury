import React from "react";
import "./globals.css";

const Loading = () => {
  return (
    <div className=" flex fixed items-center z-[10000] justify-center h-screen w-full bg-white ">
      <div className="loader"></div>
    </div>
  );
};

export default Loading;
