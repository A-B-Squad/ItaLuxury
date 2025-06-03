import React from "react";
import { CiDeliveryTruck, CiPhone } from "react-icons/ci";
import { usePathname } from "next/navigation";

const ContactBanner = ({ CompanyInfoData }: any) => {
  const Phone = CompanyInfoData?.companyInfo?.phone;
  const pathname = usePathname();

  // Don't show on checkout page
  if (pathname === "/Checkout") {
    return null;
  }

  return (
    <div className="bg-black w-full flex justify-center text-xs md:text-sm h-10 items-center text-white shadow-sm">
      <div className="container mx-auto px-4 flex justify-center md:justify-between items-center">
        <div className="flex justify-center items-center gap-2">
          <CiPhone size={18} className="text-blue-500" />
          <p className="tracking-wider font-light">
            INFOLINE: <span className="font-medium">{Phone && Phone[0]}</span>
            {Phone && Phone[1] && <span> / <span className="font-medium">{Phone[1]}</span></span>}
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <CiDeliveryTruck size={20} className="text-blue-500" />
          <p className="uppercase font-light tracking-wide">Livraison à domicile <span className="text-blue-400 font-medium">24h-48h</span></p>
        </div>
      </div>
    </div>
  );
};

export default ContactBanner;
