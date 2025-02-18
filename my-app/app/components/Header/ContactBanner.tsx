import React from "react";
import { CiDeliveryTruck, CiPhone } from "react-icons/ci";

const ContactBanner = ({ CompanyInfoData }: any) => {
  const Phone = CompanyInfoData?.companyInfo?.phone;

  return (
    <div className="bg-TopBar md:hidden bg-black w-full flex justify-center  text-xs md:text-base h-10 items-center text-white">
      <div className="flex justify-center  items-center gap-1">
        <CiPhone size={22} />

        <p className="tracking-wider">
          INFOLINE: {Phone && Phone[0]} {Phone && Phone[1] && ` / ${Phone[1]}`}
        </p>
      </div>
      {/* <div className="flex items-center gap-2">
        <CiDeliveryTruck size={25} />
        <p className="uppercase">livraison à domicile</p>
      </div> */}
    </div>
  );
};

export default ContactBanner;
