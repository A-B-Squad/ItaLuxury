"use client";
import { COMPANY_INFO_QUERY } from "@/graphql/queries";
import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { CiDeliveryTruck } from "react-icons/ci";

const Contact = () => {
  const [phone, setPhone] = useState<string>("");

  const [getPhone] = useLazyQuery(COMPANY_INFO_QUERY);

  useEffect(() => {
    getPhone({
      onCompleted: (data) => {
        setPhone(data.companyInfo.phone);
      },
    });
  }, []);
  return (
    <div className="bg-TopBanner-gradient w-full flex justify-evenly h-10 items-center text-white">
      <p>
        INFOLINE: {phone[0] && phone[0]} {phone[1] && ` / ${phone[1]}`}
      </p>
      <div className="flex items-center gap-2">
        <CiDeliveryTruck size={25} />
        <p className="uppercase">livraison à domicile</p>
      </div>
    </div>
  );
};

export default Contact;
