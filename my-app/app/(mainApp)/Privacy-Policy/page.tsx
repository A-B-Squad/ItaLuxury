import { Metadata } from "next";
import dynamic from "next/dynamic";
import React from "react";
const PrivacyPolicy = dynamic(() => import("./Privacy-Policy"));

export const metadata: Metadata = {
  title: "Politique de Confidentialité",
  description:
    "Consultez notre politique de confidentialité pour comprendre comment nous traitons vos données personnelles.",
};

const page = () => {
  return <PrivacyPolicy />;
};

export default page;
