import React from "react";
import "./globals.css";

const Loading = () => {
  return (
    <div className=" flex fixed items-center justify-center z-50 h-screen w-full bg-white ">
      <div className="loader"></div>
    </div>
  );
};

export default Loading;
