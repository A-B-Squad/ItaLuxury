"use client";

import React, { useState } from "react";
import {
  Home,
  ShoppingBag,

  Heart,
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

 

  return (
    <div className="fixed  md:hidden bottom-0 left-2 right-2 z-50 ">
      <div className="bg-[#fffffff2] rounded-full shadow-lg  overflow-hidden">
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
            href="/Collections/tunisie?page=1"
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

          <Link href="/FavoriteList" className="flex flex-col items-center">
            <div className="p-2 rounded-full text-gray-500">
              <Heart size={24} />
            </div>
            <span className="text-xs mt-1 text-gray-500">Favoris</span>
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

      </div>
    </div>
  );
};

export default TabBar;
