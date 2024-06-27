import React from "react";
import Breadcumb from "@/app/components/Breadcumb";
import CompanyInfoBar from "./componants/companyInfoBar";
import ContactUsForm from "./componants/contactUsForm";
const ContactUsPage = () => {
  return (
    <div className="contactUs flex flex-col items-center justify-center p-6  ">
      <Breadcumb pageName={"Contactez-Nous"} pageLink={"Contact-us"} />
      <div className=" container flex flex-col gap-10  py-10 border bg-white">
        <CompanyInfoBar />
        <ContactUsForm />
      </div>
    </div>
  );
};

export default ContactUsPage;
