"use client"
import React, { useState } from "react";
import { CiHome, CiSettings } from "react-icons/ci";
import { LuPackage2, LuUsers2, LuNewspaper } from "react-icons/lu";
import { TbPackages } from "react-icons/tb";
import { MdKeyboardDoubleArrowUp } from "react-icons/md";
import { FaRegChartBar } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";

const SideBar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`flex h-screen fixed top-0 left-0 z-50 transition-transform duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}>
      <div className={`bg-blue-900 shadow md:h-full flex-col justify-between ${isExpanded ? 'w-64' : 'w-20'} transition-width duration-300`}>
        <div>
          <ul className="mt-4">
            <li className="flex w-full py-4 px-4 justify-between text-white cursor-pointer items-center transition">
              <a
                href="javascript:void(0)"
                className="flex items-center focus:outline-none focus:ring-2 focus:ring-white"
                onClick={toggleSidebar}
              >
                <IoMenu size={30} />
                {isExpanded && <span className="text-lg ml-2">MaisonNg</span>}
              </a>
            </li>
            <li className="flex w-full py-4 px-4 justify-between text-white rounded-l-full hover:text-blue-900 hover:bg-gray-100 cursor-pointer items-center transition">
              <a href="javascript:void(0)" className="flex items-center focus:outline-none focus:ring-2 focus:ring-white">
                <CiHome size={24} />
                {isExpanded && <span className="text-md ml-2">Tableau de bord</span>}
              </a>
            </li>
            <li className="flex w-full py-4 px-4 justify-between text-white rounded-l-full hover:text-blue-900 hover:bg-gray-100 cursor-pointer items-center transition">
              <a href="javascript:void(0)" className="flex items-center focus:outline-none focus:ring-2 focus:ring-white">
                <LuPackage2 size={24} />
                {isExpanded && <span className="text-md ml-2">Commandes</span>}
              </a>
            </li>
            <li className="flex w-full py-4 px-4 justify-between text-white rounded-l-full hover:text-blue-900 hover:bg-gray-100 cursor-pointer items-center transition">
              <a href="javascript:void(0)" className="flex items-center focus:outline-none focus:ring-2 focus:ring-white">
                <TbPackages size={24} />
                {isExpanded && <span className="text-md ml-2">Poduits</span>}
              </a>
            </li>
            <li className="flex w-full py-4 px-4 justify-between text-white rounded-l-full hover:text-blue-900 hover:bg-gray-100 cursor-pointer items-center transition">
              <a href="javascript:void(0)" className="flex items-center focus:outline-none focus:ring-2 focus:ring-white">
                <MdKeyboardDoubleArrowUp size={24} />
                {isExpanded && <span className="text-md ml-2">Up Sells</span>}
              </a>
            </li>
            <li className="flex w-full py-4 px-4 justify-between text-white rounded-l-full hover:text-blue-900 hover:bg-gray-100 cursor-pointer items-center transition">
              <a href="javascript:void(0)" className="flex items-center focus:outline-none focus:ring-2 focus:ring-white">
                <LuUsers2 size={24} />
                {isExpanded && <span className="text-md ml-2">Clients</span>}
              </a>
            </li>
            <li className="flex w-full py-4 px-4 justify-between text-white rounded-l-full hover:text-blue-900 hover:bg-gray-100 cursor-pointer items-center transition">
              <a href="javascript:void(0)" className="flex items-center focus:outline-none focus:ring-2 focus:ring-white">
                <FaRegChartBar size={24} />
                {isExpanded && <span className="text-md ml-2">Statistiques</span>}
              </a>
            </li>
            <li className="flex w-full py-4 px-4 justify-between text-white rounded-l-full hover:text-blue-900 hover:bg-gray-100 cursor-pointer items-center transition">
              <a href="javascript:void(0)" className="flex items-center focus:outline-none focus:ring-2 focus:ring-white">
                <LuNewspaper size={24} />
                {isExpanded && <span className="text-md ml-2">Factures</span>}
              </a>
            </li>
            <li className="flex absolute bottom-0 w-full py-4 px-4 justify-between text-white rounded-l-full hover:text-blue-900 hover:bg-gray-100 cursor-pointer items-center transition">
              <a href="javascript:void(0)" className="flex items-center focus:outline-none focus:ring-2 focus:ring-white">
                <CiSettings size={24} />
                {isExpanded && <span className="text-md ml-2">Réglages</span>}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
