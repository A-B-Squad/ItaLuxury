import React from "react";

interface TitleProductProps {
  title: string;
}

const TitleProduct: React.FC<TitleProductProps> = ({ title }) => {
  return (
    <div className="relative group">
      <div className="flex items-center">
        <div className="w-1 h-6 bg-primaryColor rounded-full mr-3"></div>
        <h2 className="text-base lg:text-2xl font-bold tracking-wide capitalize">
          {title}
        </h2>
      </div>
      <div className="mt-2 flex items-center">
        <div className="h-[2px] w-16 bg-primaryColor rounded-full"></div>
        <div className="h-[2px] w-2 bg-primaryColor rounded-full mx-1 opacity-70"></div>
        <div className="h-[2px] w-1 bg-primaryColor rounded-full opacity-40"></div>
        <div className="h-[1px] flex-grow bg-gray-200 ml-2"></div>
      </div>
    </div>
  );
};

export default TitleProduct;
