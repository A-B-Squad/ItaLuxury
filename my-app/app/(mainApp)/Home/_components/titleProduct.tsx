import React from "react";

const TitleProduct = ({ title }: any) => {
  return (
    <div className="border-t-2 border-strongBeige w-full mb-5">
      <p className="bg-strongBeige text-white w-fit p-3 text-xl capitalize">
        {title}
      </p>
    </div>
  );
};

export default TitleProduct;
