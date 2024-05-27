"use client";
import React, { useState } from "react";
import { CiHome, CiSettings } from "react-icons/ci";
import { LuPackage2, LuUsers2, LuNewspaper } from "react-icons/lu";
import { TbPackages } from "react-icons/tb";
import { MdKeyboardDoubleArrowUp } from "react-icons/md";
import { FaRegChartBar } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import Link from "next/link";

const SideBar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`sideBar flex h-screen sticky top-0 left-0 z-50 bg-mainColorAdminDash  transition-all duration-300 ${isExpanded ? "w-1/5" : " w-[5%]"}`}
    >
      <div
        className={` shadow md:h-full flex-col justify-between w-full transition-width duration-300`}
      >
        <div>
          <ul className="mt-4">
            <li className="flex w-full py-4 px-4 justify-between text-white cursor-pointer outline-none items-center transition">
              <button
                
                className="flex items-center focus:outline-none focus:ring-2 outline-none focus:ring-white"
                onClick={toggleSidebar}
              >
                <IoMenu size={30} />
                {isExpanded && <span className="text-lg ml-2">MaisonNg</span>}
              </button>
            </li>
            <li className="flex w-full py-4 px-4 justify-between text-white rounded-l-full hover:text-blue-900 hover:bg-gray-100 cursor-pointer items-center transition">
              <Link
                href="/"
                className="flex items-center focus:outline-none focus:ring-2 focus:ring-white"
              >
                <CiHome size={24} />
                {isExpanded && (
                  <span className="text-md ml-2">Tableau de bord</span>
                )}
              </Link>
            </li>
            <li className="flex w-full py-4 px-4 justify-between text-white rounded-l-full hover:text-blue-900 hover:bg-gray-100 cursor-pointer items-center transition">
              <Link
                href="/"
                className="flex items-center focus:outline-none focus:ring-2 focus:ring-white"
              >
                <LuPackage2 size={24} />
                {isExpanded && <span className="text-md ml-2">Commandes</span>}
              </Link>
            </li>
            <li className="flex w-full py-4 px-4 justify-between text-white rounded-l-full hover:text-blue-900 hover:bg-gray-100 cursor-pointer items-center transition">
              <Link
                href="/"
                className="flex items-center focus:outline-none focus:ring-2 focus:ring-white"
              >
                <TbPackages size={24} />
                {isExpanded && <span className="text-md ml-2">Poduits</span>}
              </Link>
            </li>
            <li className="flex w-full py-4 px-4 justify-between text-white rounded-l-full hover:text-blue-900 hover:bg-gray-100 cursor-pointer items-center transition">
              <Link
                href="/"
                className="flex items-center focus:outline-none focus:ring-2 focus:ring-white"
              >
                <MdKeyboardDoubleArrowUp size={24} />
                {isExpanded && <span className="text-md ml-2">Up Sells</span>}
              </Link>
            </li>
            <li className="flex w-full py-4 px-4 justify-between text-white rounded-l-full hover:text-blue-900 hover:bg-gray-100 cursor-pointer items-center transition">
              <Link
                href="/"
                className="flex items-center focus:outline-none focus:ring-2 focus:ring-white"
              >
                <LuUsers2 size={24} />
                {isExpanded && <span className="text-md ml-2">Clients</span>}
              </Link>
            </li>
            <li className="flex w-full py-4 px-4 justify-between text-white rounded-l-full hover:text-blue-900 hover:bg-gray-100 cursor-pointer items-center transition">
              <Link
                href="/"
                className="flex items-center focus:outline-none focus:ring-2 focus:ring-white"
              >
                <FaRegChartBar size={24} />
                {isExpanded && (
                  <span className="text-md ml-2">Statistiques</span>
                )}
              </Link>
            </li>
            <li className="flex w-full py-4 px-4 justify-between text-white rounded-l-full hover:text-blue-900 hover:bg-gray-100 cursor-pointer items-center transition">
              <Link
                href="/"
                className="flex items-center focus:outline-none focus:ring-2 focus:ring-white"
              >
                <LuNewspaper size={24} />
                {isExpanded && <span className="text-md ml-2">Factures</span>}
              </Link>
            </li>
            <li className="flex absolute bottom-0 w-full py-4 px-4 justify-between text-white rounded-l-full hover:text-blue-900 hover:bg-gray-100 cursor-pointer items-center transition">
              <Link
                href="/"
                className="flex items-center focus:outline-none focus:ring-2 focus:ring-white"
              >
                <CiSettings size={24} />
                {isExpanded && <span className="text-md ml-2">Réglages</span>}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
