"use client";

import React from "react";
import {
  Home,
  ShoppingBag,

  Heart,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoPackageDependents } from "react-icons/go";
import { sendGTMEvent } from "@next/third-parties/google";

const TabBarMobile = () => {
  const pathname = usePathname();

  const isActive = (path: string): boolean => {
    if (!pathname) return false;
    if (path === "/") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };


  const handleNavigation = (pageName: string) => {
    sendGTMEvent({
      event: "page_view",
      page_title: pageName,
      page_location: window.location.href,
      facebook_data: {
        content_name: pageName,
        content_type: "page"
      }
    });
  };

  return (
    <div className="fixed  md:hidden bottom-0 left-2 right-2 z-50 ">
      <div className="bg-[#fffffff2] rounded-full shadow-lg  overflow-hidden">
        <div
          className={`flex justify-around items-center py-2 transition-all duration-300 `}
        >
          <Link href="/"
            onClick={() => handleNavigation("Accueil")}
            className="flex flex-col items-center">
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
            onClick={() => handleNavigation("Boutique")}

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

          <Link href="/FavoriteList"
            onClick={() => handleNavigation("Favoris")}
            className="flex flex-col items-center">
            <div className="p-2 rounded-full text-gray-500">
              <Heart size={24} />
            </div>
            <span className="text-xs mt-1 text-gray-500">Favoris</span>
          </Link>
          <Link href="/TrackingPackages"
            onClick={() => handleNavigation("Colis")}
            className="flex flex-col items-center">
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

export default TabBarMobile;
