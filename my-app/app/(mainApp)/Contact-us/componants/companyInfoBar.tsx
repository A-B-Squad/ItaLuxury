"use client";
import React, { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { CiLocationOn, CiPhone } from "react-icons/ci";
import { AiOutlineMail } from "react-icons/ai";
import { COMPANY_INFO_QUERY } from "@/graphql/queries";

const CompanyInfoBar = () => {
  const { data: companyInfoData, loading } = useQuery(COMPANY_INFO_QUERY);
  
  // Memoize company info to prevent unnecessary re-renders
  const companyInfo = useMemo(() => companyInfoData?.companyInfo, [companyInfoData]);
  
  return (
    <div className="w-full border rounded-lg shadow-lg overflow-hidden">
      <h2 className="py-4 px-6 border-b text-xl font-semibold text-primaryColor bg-gray-50">
        Informations de contact
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 min-h-52 h-full divide-y md:divide-y-0 md:divide-x">
        <div className="location flex flex-col text-center justify-center items-center p-6 hover:bg-gray-50 transition-colors">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <CiLocationOn className="text-primaryColor" size={30} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Notre adresse</h3>
          {loading ? (
            <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          ) : (
            <p className="text-gray-600">{companyInfo?.location || "Adresse non disponible"}</p>
          )}
        </div>
        
        <div className="phone flex flex-col justify-center items-center p-6 hover:bg-gray-50 transition-colors">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <CiPhone className="text-primaryColor" size={30} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Appelez-nous</h3>
          {loading ? (
            <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          ) : (
            <p className="text-gray-600">
              {companyInfo?.phone ? (
                <>
                  (+216) {companyInfo.phone[0]}
                  {companyInfo.phone[1] && <> / (+216) {companyInfo.phone[1]}</>}
                </>
              ) : (
                "Numéro non disponible"
              )}
            </p>
          )}
        </div>
        
        <div className="email flex flex-col justify-center items-center p-6 hover:bg-gray-50 transition-colors">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <AiOutlineMail className="text-primaryColor" size={30} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Envoyez-nous un email</h3>
          {loading ? (
            <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          ) : (
            <p className="text-gray-600">{companyInfo?.email || "Email non disponible"}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoBar;
