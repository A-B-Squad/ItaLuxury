import React from "react";

const Loading = () => {
  return (
    <div className=" flex items-center z-[1000] fixed justify-center h-screen w-full bg-white ">
      <div className="loader"></div>
    </div>
  );
};

export default Loading;
