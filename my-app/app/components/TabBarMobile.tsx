"use client";

import React, { useCallback, memo } from "react";
import { Home, ShoppingBag, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoPackageDependents } from "react-icons/go";
import { sendGTMEvent } from "@next/third-parties/google";
import { useAuth } from "@/lib/auth/useAuth";
import { CiUser } from "react-icons/ci";
import { motion } from "framer-motion";

const TabBarMobile = () => {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const isActive = useCallback((path: string): boolean => {
    if (!pathname) return false;
    if (path === "/") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  }, [pathname]);

  const handleNavigation = useCallback((pageName: string) => {
    sendGTMEvent({
      event: "page_view",
      page_title: pageName,
      page_location: window.location.href,
      facebook_data: {
        content_name: pageName,
        content_type: "page",
      },
    });
  }, []);

  const tabItems = [
    {
      name: "Accueil",
      path: "/",
      icon: <Home size={18} />,
    },
    {
      name: "Boutique",
      path: "/Collections/tunisie?page=1",
      icon: <ShoppingBag size={18} />,
    },
    {
      name: "Favoris",
      path: "/FavoriteList",
      icon: <Heart size={18} />,
    },
    {
      name: "Colis",
      path: "/TrackingPackages",
      icon: <GoPackageDependents size={18} />,
    },
  ];

  return (
    <motion.div 
      className="fixed md:hidden bottom-0 w-full z-[999991]"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white/95 backdrop-blur-sm shadow-[0_-2px_10px_rgba(0,0,0,0.05)] py-2">
        <div className="flex justify-around items-center">
          {tabItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => handleNavigation(item.name)}
              className="flex flex-col items-center w-1/4"
            >
              <motion.div
                className={`p-1.5 rounded-full ${
                  isActive(item.path) 
                    ? "bg-primaryColor text-white" 
                    : "text-gray-600 hover:text-primaryColor"
                }`}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                {item.icon}
              </motion.div>
              <span
                className={`text-[10px] mt-1 font-medium ${
                  isActive(item.path) ? "text-primaryColor" : "text-gray-600"
                }`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default memo(TabBarMobile);
