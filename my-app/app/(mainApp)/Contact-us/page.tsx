import React from "react";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import Breadcumb from "@/app/components/Breadcumb";
import CompanyInfoBar from "./componants/companyInfoBar";
import ContactFormSkeleton from "./componants/ContactFormSkeleton";
const ContactUsForm = dynamic(() => import("./componants/contactUsForm"), {
  loading: () => <ContactFormSkeleton />,
  ssr: false
});
export const metadata: Metadata = {
  title: "Contactez-Nous | ita-luxury - Votre boutique en ligne en Tunisie",
  description:
    "Besoin d'aide ou d'informations ? Contactez l'équipe ita-luxury. Nous sommes là pour répondre à toutes vos questions sur nos produits et services.",
  openGraph: {
    title: "Contactez-Nous | ita-luxury",
    description:
      "Besoin d'aide ? Contactez l'équipe ita-luxury. Nous sommes là pour vous aider.",
    type: "website",
    url: "https://www.ita-luxury.com/Contact-us",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/images/logos/LOGO-WHITE-BG.webp`,
        width: 1200,
        height: 630,
        alt: "Contactez ita-luxury",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contactez-Nous | ita-luxury",
    description:
      "Besoin d'aide ? Contactez l'équipe ita-luxury. Nous sommes là pour vous aider.",
  },
  alternates: {
    canonical: "https://www.ita-luxury.com/Contact-us",
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
};


const ContactUsPage = () => {
  const breadcrumbPaths = [
    { href: "/", label: "Accueil" },
    { href: "/contact-us", label: "Contactez-Nous", }
  ];

  return (
    <div className="contactUs flex flex-col items-center justify-center p-6">
      <Breadcumb Path={breadcrumbPaths} />
      <div className="container flex flex-col items-center justify-center gap-10 py-10 border bg-white">
        <h1 className="text-3xl font-bold text-center ">Contactez-Nous</h1>
        <CompanyInfoBar />
        <ContactUsForm />
      </div>
    </div>
  );
};

export default ContactUsPage;
