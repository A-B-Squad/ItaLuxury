"use client";
import React, { useEffect } from "react";
import { IoHome } from "react-icons/io5";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const Breadcrumb = ({ pageName, pageLink }: any) => {
  const params = useSearchParams();
  const categoryParams = params?.get("categories") ?? "";
  const categories = categoryParams.split(",").filter(Boolean);
  const section = params?.get("section") ?? "";

  const breadcrumbItems = [
    { name: "Accueil", link: "/" },
    ...(pageName ? [{ name: pageName, link: `/${pageLink}` }] : []),
    ...(section
      ? [
        {
          name: section,
          link: `/Collections/tunisie/?section=${encodeURIComponent(section)}`,
        },
      ]
      : []),
    ...categories.map((category, index) => ({
      name: category,
      link:
        index === categories.length - 1
          ? null
          : `/Collections/tunisie/?category=${encodeURIComponent(category)}&categories=${encodeURIComponent(categories.slice(0, index + 1).join(","))}`,
    })),
  ];

  return (
    <div className="flex gap-2 justify-center  py-5 justify-self-center w-full flex-wrap items-center text-sm md:text-sm  tracking-[2px]">
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-gray-500">/</span>}
          <div
            className={`transition-all flex items-center gap-2 ${index === breadcrumbItems.length - 1
              ? "text-secondaryColor"
              : "hover:text-primaryColor"
              }`}
          >
            {item.link ? (
              <Link rel="preload" href={item.link}>
                {index === 0 && <IoHome className="inline mr-1" />}
                {item.name}
              </Link>
            ) : (
              <span className="cursor-default">{item.name}</span>
            )}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;
