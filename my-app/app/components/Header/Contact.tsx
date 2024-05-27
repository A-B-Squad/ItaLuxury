import React from "react";
import { CiDeliveryTruck } from "react-icons/ci";

const Contact = ({ CompanyInfoData }: any) => {
  
  const Phone = CompanyInfoData?.companyInfo?.phone;
  
  return (
    <div className="bg-TopBanner-gradient w-full flex justify-evenly h-10 items-center text-white">
      <p>
        INFOLINE: {Phone && Phone[0]} {Phone && Phone[1] && ` / ${Phone[1]}`}
      </p>
      <div className="flex items-center gap-2">
        <CiDeliveryTruck size={25} />
        <p className="uppercase">livraison à domicile</p>
      </div>
    </div>
  );
};

export default Contact;
