import React from "react";
import Link from "next/link";
import { CiDeliveryTruck, CiPhone } from "react-icons/ci";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const ContactBanner = ({ companyData }: any) => {
  const phones: string[] = companyData?.phone ?? [];

  return (
    <div className="bg-black w-full flex justify-center text-xs md:text-sm h-10 items-center text-white shadow-sm">
      <div className="container mx-auto px-4 flex justify-center md:justify-between items-center">

        {/* Left side: Phone numbers and Contact link */}
        <div className="flex items-center gap-4">
          {/* Phone numbers */}
          <div className="flex justify-center items-center gap-2">
            <CiPhone size={18} className="text-blue-500" />
            <p className="tracking-wider font-light flex gap-1">
              <span>INFOLINE:</span>
              {phones.length > 0 ? (
                <>
                  <span className="font-medium">{phones[0]}</span>
                  {phones[1] && (
                    <>
                      <span>/</span>
                      <span className="font-medium">{phones[1]}</span>
                    </>
                  )}
                </>
              ) : (
                <span className="italic text-gray-400">Non disponible</span>
              )}
            </p>
          </div>

          {/* Contact Us Link */}
          <Link
            href="/Contact-us"
            className="hidden md:flex items-center gap-1 hover:text-blue-400 transition-colors border-l border-gray-700 pl-4"
          >
            <MdEmail size={16} className="text-blue-500" />
            <span className="font-light tracking-wide">Contactez-nous</span>
          </Link>
        </div>

        {/* Right side: Social media and delivery info */}
        <div className="hidden md:flex items-center gap-4">
          {/* Social media icons */}
          <div className="flex items-center gap-3">
            {companyData?.facebook && (
              <Link
                href={companyData.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF size={16} />
              </Link>
            )}
            {companyData?.instagram && (
              <Link
                href={companyData.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-400 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={16} />
              </Link>
            )}
            <Link
              href="https://www.tiktok.com/@ita_luxury?lang=en"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
              aria-label="TikTok"
            >
              <FaTiktok size={16} />
            </Link>
          </div>

          {/* Delivery info */}
          <div className="flex items-center gap-2 border-l border-gray-700 pl-4">
            <CiDeliveryTruck size={20} className="text-blue-500" />
            <p className="uppercase font-light tracking-wide">
              Livraison à domicile{" "}
              <span className="text-blue-400 font-medium">24h-48h</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactBanner;