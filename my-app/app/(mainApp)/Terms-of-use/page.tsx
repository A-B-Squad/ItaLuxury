import Breadcumb from "@/app/components/Breadcumb";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import React from "react";

const PrivacyPolicy = dynamic(() => import("./Terms-of-use"));

export const metadata: Metadata = {
  title: "Conditions d'Utilisation",
  description:
    "Consultez nos conditions d'utilisation pour utiliser notre site ecommerce en toute sécurité.",
};
const pageTermsOfUse = () => {
  return (
    <>
      <Breadcumb pageName={"Conditions d'Utilisation"} pageLink={"Terms-of-use"} />
      <PrivacyPolicy />;
    </>
  );
};

export default pageTermsOfUse;
