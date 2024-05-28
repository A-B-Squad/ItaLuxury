"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import { CiLocationOn, CiPhone } from "react-icons/ci";
import { AiOutlineMail } from "react-icons/ai";
import { COMPANY_INFO_QUERY } from "../../../../graphql/queries";

const CompanyInfoBar = () => {
  const { data: CompanyInfoData } = useQuery(COMPANY_INFO_QUERY);
  const phone = CompanyInfoData?.companyInfo?.phone;
  const location = CompanyInfoData?.companyInfo?.location;
  const email = CompanyInfoData?.companyInfo?.email;
  return (
    <div className="w-full border  shadow-lg">
      <h1 className="py-4 px-2 border-b text-xl capitalize bg-gray-50">Informations </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 min-h-52 h-full divide-y md:divide-x">
        <div className="location flex flex-col text-center justify-center items-center p-4">
          <CiLocationOn className="text-gray-600" size={35} />
          <p className=" text-gray-600">{location}</p>
        </div>
        <div className="phone flex flex-col justify-center items-center p-4">
          <CiPhone className="text-gray-600" size={35} />
          <h3 className="font-semibold  text-gray-900">Appelez-nous :</h3>
          <p className=" text-gray-600">(+216) {phone}</p>
        </div>
        <div className="email flex flex-col justify-center items-center p-4">
          <AiOutlineMail className="text-gray-600" size={35} />
          <h3 className="font-semibold text-gray-900">
            Envoyez-nous un email :
          </h3>
          <p className=" text-gray-600">{email}</p>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoBar;
