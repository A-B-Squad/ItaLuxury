import React from "react";
import { CiDeliveryTruck, CiPhone } from "react-icons/ci";

const ContactBanner = ({ companyData }: any) => {
  const phones: string[] = companyData?.phone ?? [];

  return (
    <div className="bg-black w-full flex justify-center text-xs md:text-sm h-10 items-center text-white shadow-sm">
      <div className="container mx-auto px-4 flex justify-center md:justify-between items-center">

        {/* Phone numbers */}
        <div className="flex justify-center items-center gap-2">
          <CiPhone size={18} className="text-blue-500" />
          <p className="tracking-wider font-light flex gap-1">
            <span>INFOLINE:</span>
            {phones.length > 0 ? (
              <>
                <span className="font-medium">{phones[0]}</span>
                {phones[1] && (
                  <>
                    <span>/</span>
                    <span className="font-medium">{phones[1]}</span>
                  </>
                )}
              </>
            ) : (
              <span className="italic text-gray-400">Non disponible</span>
            )}
          </p>
        </div>

        {/* Delivery info */}
        <div className="hidden md:flex items-center gap-2">
          <CiDeliveryTruck size={20} className="text-blue-500" />
          <p className="uppercase font-light tracking-wide">
            Livraison à domicile{" "}
            <span className="text-blue-400 font-medium">24h-48h</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactBanner;
