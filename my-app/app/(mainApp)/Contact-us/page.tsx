import React from "react";
import Breadcumb from "../../components/Breadcumb";
import { useQuery } from "@apollo/client";
import { COMPANY_INFO_QUERY } from "../../../graphql/queries";
import { CiLocationOn, CiPhone } from "react-icons/ci";
import { AiOutlineMail } from "react-icons/ai";
import CompanyInfoBar from "./componants/companyInfoBar";
import ContactUsForm from "./componants/contactUsForm";
const ContactUsPage = () => {
  return (
    <div className="contactUs flex  items-center justify-center  ">
      <div className=" container flex flex-col gap-10  py-10">
        <CompanyInfoBar />
        <ContactUsForm />
      </div>
    </div>
  );
};

export default ContactUsPage;
