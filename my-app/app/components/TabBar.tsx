"use client";

import React, { useState } from "react";
import {
  Home,
  ShoppingBag,
  Users,
  Plus,
  X,
  Heart,
  BarChart2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoPackageDependents } from "react-icons/go";

const TabBar = () => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  const isActive = (path: string): boolean => {
    if (!pathname) return false;
    if (path === "/") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-2 md:hidden left-2 right-2 z-50 ">
      <div className="bg-gray-100 rounded-full shadow-lg  overflow-hidden">
        <div
          className={`flex justify-around items-center py-2 transition-all duration-300 ${isExpanded ? "opacity-0" : "opacity-100"}`}
        >
          <Link href="/" className="flex flex-col items-center">
            <div
              className={`p-2 rounded-full ${isActive("/") ? "bg-primaryColor text-white" : "text-gray-500"}`}
            >
              <Home size={24} />
            </div>
            <span
              className={`text-xs mt-1 ${isActive("/") ? "text-primaryColor" : "text-gray-500"}`}
            >
              Accueil
            </span>
          </Link>
          <Link
            href="/Collections/tunisie?page=1&section=Boutique"
            className="flex flex-col items-center"
          >
            <div
              className={`p-2 rounded-full ${isActive("/Collections") ? "bg-primaryColor text-white" : "text-gray-500"}`}
            >
              <ShoppingBag size={24} />
            </div>
            <span
              className={`text-xs mt-1 ${isActive("/Collections") ? "text-primaryColor" : "text-gray-500"}`}
            >
              Boutique
            </span>
          </Link>
          <div className=" inset-x-0 bottom-0 flex justify-center items-center">
            <button
              onClick={toggleExpand}
              className="p-3 rounded-full bg-primaryColor text-white shadow-lg flex flex-col items-center"
            >
              <Plus size={24} />
              <span className="text-xs mt-1">Plus</span>
            </button>
          </div>
          <Link href="/Contact-us" className="flex flex-col items-center">
            <div
              className={`p-2 rounded-full ${isActive("/Contact-us") ? "bg-primaryColor text-white" : "text-gray-500"}`}
            >
              <Users size={24} />
            </div>
            <span
              className={`text-xs mt-1 ${isActive("/Contact-us") ? "text-primaryColor" : "text-gray-500"}`}
            >
              Contact
            </span>
          </Link>
          <Link href="/TrackingPackages" className="flex flex-col items-center">
            <div
              className={`p-2 rounded-full ${isActive("/TrackingPackages") ? "bg-primaryColor text-white" : "text-gray-500"}`}
            >
              <GoPackageDependents size={24} />
            </div>
            <span
              className={`text-xs mt-1 ${isActive("/TrackingPackages") ? "text-primaryColor" : "text-gray-500"}`}
            >
              Colis
            </span>
          </Link>
        </div>
        <div
          className={`absolute top-0 left-0 right-0 bottom-0 flex justify-around items-center py-2 transition-all duration-300 ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <Link href="/FavoriteList" className="flex flex-col items-center">
            <div className="p-2 rounded-full text-gray-500">
              <Heart size={24} />
            </div>
            <span className="text-xs mt-1 text-gray-500">Wishlist</span>
          </Link>

          <div className=" inset-x-0 bottom-0 flex justify-center items-center">
            <button
              onClick={toggleExpand}
              className="p-3 rounded-full bg-primaryColor text-white shadow-lg flex flex-col items-center"
            >
              <X size={24} />
              <span className="text-xs mt-1">Plus</span>
            </button>
          </div>
          <Link
            href="/productComparison"
            className="flex flex-col items-center"
          >
            <div className="p-2 rounded-full text-gray-500">
              <BarChart2 size={24} />
            </div>
            <span className="text-xs mt-1 text-gray-500">Compare</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TabBar;
