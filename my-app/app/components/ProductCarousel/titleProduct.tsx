import React from "react";

const TitleProduct = ({ title }: any) => {
  return (
    <div className="border-b-2 text-start border-primaryColor w-fit h-fit mb-5">
      <p className=" w-fit pt-3 pr-9 pb-2   text-xl capitalize">{title}</p>
    </div>
  );
};

export default TitleProduct;
