"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import { motion } from "framer-motion";
import { Heart, Home, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useCallback } from "react";
import { GoPackageDependents } from "react-icons/go";

const TabBarMobile = () => {
  const pathname = usePathname();

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
      icon: <Home size={20} />,
    },
    {
      name: "Boutique",
      path: "/Collections/tunisie?page=1",
      icon: <ShoppingBag size={20} />,
    },
    {
      name: "Favoris",
      path: "/FavoriteList",
      icon: <Heart size={20} />,
    },
    {
      name: "Colis",
      path: "/TrackingPackages",
      icon: <GoPackageDependents size={20} />,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white md:hidden">
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white/98 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      >
        <div className="safe-area-inset-bottom">
          <div className="flex justify-around items-center px-2 ">
            {tabItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => handleNavigation(item.name)}
                className="flex flex-col items-center justify-center flex-1 py-2"
              >
                <motion.div
                  className={`flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-primaryColor text-white shadow-lg shadow-primaryColor/25"
                      : "text-gray-500 hover:text-primaryColor hover:bg-gray-50"
                  }`}
                  whileTap={{ scale: 0.88 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.15, type: "spring", stiffness: 400 }}
                >
                  {item.icon}
                </motion.div>
                <motion.span
                  className={`text-xs mt-1.5 font-medium transition-colors duration-200 ${
                    isActive(item.path) 
                      ? "text-primaryColor" 
                      : "text-gray-500"
                  }`}
                  initial={false}
                  animate={{
                    scale: isActive(item.path) ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                </motion.span>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default memo(TabBarMobile);