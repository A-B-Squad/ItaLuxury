"use client";
import React from "react";
import { IoHome } from "react-icons/io5";
import Link from "next/link";

interface BreadcrumbItem {
  href?: string;
  label: string;
}

interface BreadcrumbProps {
  Path: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ Path }) => {

  return (
    <div className="flex gap-2 justify-center py-5 w-full flex-wrap items-center text-sm tracking-[2px]">
      {Path.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-gray-500">/</span>}
          <div
            className={`transition-all flex items-center gap-2 ${
              index === Path.length - 1 ? "text-secondaryColor" : "hover:text-primaryColor"
            }`}
          >
            {item.href && index !== Path.length - 1 ? (
              <Link href={item.href}>
                {index === 0 && <IoHome className="inline mr-1" />}
                {item.label}
              </Link>
            ) : (
              <span className="cursor-default">{item.label}</span>
            )}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;
