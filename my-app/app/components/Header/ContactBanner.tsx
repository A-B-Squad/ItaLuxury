import React from "react";
import { CiDeliveryTruck, CiPhone } from "react-icons/ci";

const ContactBanner = ({ CompanyInfoData }: any) => {
  const Phone = CompanyInfoData?.companyInfo?.phone;

  return (
    <div className="bg-TopBanner w-full flex justify-evenly text-xs md:text-base h-10 items-center text-white">
      <div className="flex items-center gap-1">
      <CiPhone size={25}/>

      <p>
        INFOLINE: {Phone && Phone[0]} {Phone && Phone[1] && ` / ${Phone[1]}`}
      </p>
      </div>
      <div className="flex items-center gap-2">
        <CiDeliveryTruck size={25} />
        <p className="uppercase">livraison à domicile</p>
      </div>
    </div>
  );
};

export default ContactBanner;
