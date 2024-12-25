"use client";
import React from "react";
import { IoHome } from "react-icons/io5";
import Link from "next/link";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

interface BreadcrumbItem {
  href?: string;
  label: string;
}

interface BreadcrumbProps {
  Path: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ Path }) => {

  return (
    <div className="flex gap-2 justify-center py-5 w-full flex-wrap items-center text-sm  tracking-[1.5px]">
      {Path.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className=""><MdOutlineKeyboardArrowRight size={16} />
          </span>}
          <div
            className={`transition-all flex items-center  gap-2 ${index === Path.length - 1 ? "text-blueColor" : "text-black"
              }`}
          >
            {item.href && index !== Path.length - 1 ? (
              <Link href={item.href} className="font-normal hover:font-medium transition-all">
                {index === 0 && <IoHome className="inline mr-1" />}
                {item.label}
              </Link>
            ) : (
              <span className="cursor-default font-medium">{item.label}</span>
            )}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;
