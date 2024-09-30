import SideAds from "@/app/components/adverstissment/sideAds";
import Breadcumb from "@/app/components/Breadcumb";
import keywords from "@/public/keywords";
import { Metadata } from "next";
import React from "react";
import DeliveryPage from "./DeliveryPage";

export const metadata: Metadata = {
  title: "Livraison",
  description: "ita-luxury.tn",
  keywords: keywords,
};
const page = () => {
  return (
    <div className="flex flex-col  items-center  justify-center  h-max mb-16 py-10 px-2 relative ">
      <Breadcumb pageName={"Expéditions et retours"} pageLink={"Delivery"} />
      <DeliveryPage />
    </div>
  );
};

export default page;
