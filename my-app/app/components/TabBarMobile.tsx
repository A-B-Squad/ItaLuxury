"use client";

import React from "react";
import { Home, ShoppingBag, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoPackageDependents } from "react-icons/go";
import { sendGTMEvent } from "@next/third-parties/google";
import { useAuth } from "@/lib/auth/useAuth";
import { CiUser } from "react-icons/ci";

const TabBarMobile = () => {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

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
        content_type: "page",
      },
    });
  };

  return (
    <div className="fixed md:hidden bottom-0  w-full z-50">
      <div className="bg-[#fffffff2] shadow-lg py-1 overflow-hidden">
        <div
          className={`flex justify-around items-center py-1 transition-all duration-300`}
        >
          <Link
            href="/"
            onClick={() => handleNavigation("Accueil")}
            className="flex flex-col items-center"
          >
            <div
              className={`p-2 rounded-full ${
                isActive("/") ? "bg-primaryColor text-white" : "text-black"
              }`}
            >
              <Home size={20} />
            </div>
            <span
              className={`text-xs ${
                isActive("/") ? "text-primaryColor" : "text-black"
              }`}
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
              className={`p-2 rounded-full ${
                isActive("/Collections")
                  ? "bg-primaryColor text-white"
                  : "text-black"
              }`}
            >
              <ShoppingBag size={20} />
            </div>
            <span
              className={`text-xs ${
                isActive("/Collections") ? "text-primaryColor" : "text-black"
              }`}
            >
              Boutique
            </span>
          </Link>

          <Link
            href="/FavoriteList"
            onClick={() => handleNavigation("Favoris")}
            className="flex flex-col items-center"
          >
            <div className="p-2 rounded-full text-black">
              <Heart size={20} />
            </div>
            <span className="text-xs text-black">Favoris</span>
          </Link>

          {isAuthenticated ? (
            <Link
              href="/TrackingPackages"
              onClick={() => handleNavigation("Colis")}
              className="flex flex-col items-center"
            >
              <div
                className={`p-2 rounded-full ${
                  isActive("/TrackingPackages")
                    ? "bg-primaryColor text-white"
                    : "text-black"
                }`}
              >
                <GoPackageDependents size={20} />
              </div>
              <span
                className={`text-xs ${
                  isActive("/TrackingPackages")
                    ? "text-primaryColor"
                    : "text-black"
                }`}
              >
                Colis
              </span>
            </Link>
          ) : (
            <Link
              href="/signin"
              onClick={() => handleNavigation("Compte")}
              className="flex flex-col items-center"
            >
              <div
                className={`p-2 rounded-full ${
                  isActive("/signin") ? "bg-primaryColor text-white" : "text-black"
                }`}
              >
                <CiUser size={20} />
              </div>
              <span
                className={`text-xs ${
                  isActive("/signin") ? "text-primaryColor" : "text-black"
                }`}
              >
                Compte
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabBarMobile;
