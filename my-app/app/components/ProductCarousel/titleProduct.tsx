import React from "react";

const TitleProduct = ({ title }: any) => {
  return (
    <div className="border-b-2 text-start text-base lg:text-xl border-primaryColor w-fit h-fit ">
      <p className=" w-fit pt-3  pb-2    capitalize tracking-wide">{title}</p>
    </div>
  );
};

export default TitleProduct;
