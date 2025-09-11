"use client";
import React, { memo } from "react";
import { IoHome } from "react-icons/io5";
import Link from "next/link";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { motion } from "framer-motion";

interface BreadcrumbItem {
  href?: string;
  label: string;
}

interface BreadcrumbProps {
  Path: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ Path }) => {
  return (
    <nav aria-label="Breadcrumb" className="w-full  -z-0 py-4">
      <motion.ol
        className="flex flex-wrap items-center justify-center gap-1 text-sm tracking-wide"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {Path.map((item, index) => (
          <li
            key={index}
            className="flex items-center"
          >
            {index > 0 && (
              <MdOutlineKeyboardArrowRight
                size={16}
                className="mx-1 text-gray-400"
                aria-hidden="true"
              />
            )}

            {item.href && index !== Path.length - 1 ? (
              <Link
                href={item.href}

                className={`
                  flex items-center hover:text-primaryColor transition-colors duration-200
                  ${index === 0 ? 'font-medium' : 'font-normal'}
                `}
              >
                {index === 0 && <IoHome className="mr-1.5" size={14} />}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span
                className="font-medium text-primaryColor"
                aria-current="page"
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </motion.ol>
    </nav>
  );
};

export default memo(Breadcrumb);
