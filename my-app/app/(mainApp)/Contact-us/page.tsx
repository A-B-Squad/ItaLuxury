import React from "react";
import { Metadata } from "next";
import Breadcumb from "@/app/components/Breadcumb";
import CompanyInfoBar from "./componants/companyInfoBar";
import ContactUsForm from "./componants/contactUsForm";

export const metadata: Metadata = {
  title: "Contactez-Nous | MaisonNg - Votre boutique en ligne en Tunisie",
  description: "Besoin d'aide ou d'informations ? Contactez l'équipe MaisonNg. Nous sommes là pour répondre à toutes vos questions sur nos produits et services.",
  openGraph: {
    title: "Contactez-Nous | MaisonNg",
    description: "Besoin d'aide ? Contactez l'équipe MaisonNg. Nous sommes là pour vous aider.",
    type: "website",
    url: "https://www.maisonng.com/Contact-us",
    images: [
      {
        url: "../../../public/images/logo.jpeg",
        width: 1200,
        height: 630,
        alt: "Contactez MaisonNg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contactez-Nous | MaisonNg",
    description: "Besoin d'aide ? Contactez l'équipe MaisonNg. Nous sommes là pour vous aider.",
    images: ["/images/contact-us-twitter.jpg"],
  },
  alternates: {
    canonical: "https://www.maisonng.com/Contact-us",
  },
};

const ContactUsPage = () => {
  return (
    <div className="contactUs flex flex-col items-center justify-center p-6">
      <Breadcumb pageName="Contactez-Nous" pageLink="contact-us" />
      <div className="container flex flex-col gap-10 py-10 border bg-white">
        <h1 className="text-3xl font-bold text-center mb-6">Contactez-Nous</h1>
        <CompanyInfoBar />
        <ContactUsForm />
      </div>
    </div>
  );
};

export default ContactUsPage;