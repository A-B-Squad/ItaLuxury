"use client";

import React, { useEffect, useState } from "react";
import {
  FaDribbbleSquare,
  FaFacebookSquare,
  FaGithubSquare,
  FaInstagram,
  FaTwitterSquare,
} from "react-icons/fa";
import { useLazyQuery } from "@apollo/client";
import { COMPANY_INFO_QUERY } from "@/graphql/queries";

// Reusable SocialIcon component with hover effect
const SocialIcon = ({ icon: Icon }) => (
  <Icon className="social-icon hover:text-[#00df9a]" size={30} />
);
// Footer component
const Footer = () => {
  const [instagramLink, setInstagramLink] = useState<string>("");
  const [facebookLink, setFacebookLink] = useState<string>("");

  const [getSocialLinks] = useLazyQuery(COMPANY_INFO_QUERY);

  useEffect(() => {
    getSocialLinks({
      onCompleted(data) {
        setInstagramLink(data.companyInfo.instagram);
        setFacebookLink(data.companyInfo.facebook);
      },
    });
  }, []);

  // Array defining the content and structure of the footer
  const items = [
    // Social media icons
    { type: "icon", icon: FaFacebookSquare, link: facebookLink },
    { type: "icon", icon: FaInstagram, link: instagramLink },

    // Footer sections
    {
      type: "section",
      title: "Solutions",
      items: ["Analytics", "Marketing", "Commerce", "Insights"],
    },
    {
      type: "section",
      title: "Support",
      items: ["Pricing", "Documentation", "Guides", "API Status"],
    },
    {
      type: "section",
      title: "Company",
      items: ["About", "Blog", "Jobs", "Press", "Careers"],
    },
    { type: "section", title: "Legal", items: ["Claim", "Policy", "Terms"] },
  ];
  // JSX structure of the footer
  return (
    <div className="bg-mediumBeige shadow-xl shadow-black mx-auto py-16 px-4 grid lg:grid-cols-3 gap-8 text-white">
      {/* Left section with brand and social icons */}
      <div>
        <h1 className="w-full text-3xl lg:text-4xl xl:text-5xl font-bold text-white   ">
          MAISON NG
        </h1>
        <h1 className="w-full text-3xl lg:text-4xl xl:text-5xl font-bold text-white   ">
          Informations
        </h1>
        <p className="py-4">
          43 Avenue Fattouma Bourguiba Sidi Fraj Sokra 2036 La Soukra Tunisie
          Ariana Tunisie.
        </p>
        <div className="flex gap-5 md:w-[75%] my-6">
          {/* Mapping over social icons and rendering the SocialIcon component */}
          {items.map((item, index) =>
            item.type === "icon" ? (
              <>
                <a  href={item.link} target="_blank" onClick={()=>{
                  console.log('====================================');
                  console.log(item);
                  console.log('====================================');
                }}>
                  <SocialIcon key={index} icon={item.icon} />
                </a>
              </>
            ) : null
          )}
        </div>
      </div>
      {/* Right section with footer content organized in sections */}
      <div className="lg:col-span-2 flex justify-between mt-6">
        {/* Mapping over sections and rendering content */}
        {items.map((item, index) =>
          item.type === "section" ? (
            <div key={index}>
              <h6 className="font-medium text-gray-100 text-xl">
                {item.title}
              </h6>
              <ul>
                {/* Mapping over items in each section */}
                {item?.items?.map((subItem, subIndex) => (
                  <li key={subIndex} className="py-2 text-sm">
                    {subItem}
                  </li>
                ))}
              </ul>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};
export default Footer;
