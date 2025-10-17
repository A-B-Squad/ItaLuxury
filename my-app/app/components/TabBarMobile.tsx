"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import { Heart, Home, ShoppingBag, Grid3x3, X, User, UserCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useCallback, useState, useEffect } from "react";
import { GoPackageDependents } from "react-icons/go";
import { useDrawerMobileSearch, useProductsInBasketStore, useDrawerBasketStore, useDrawerMobileCategory } from "../store/zustand";
import { CiSearch } from "react-icons/ci";
import { useAuth } from "../hooks/useAuth";

const TabBarMobile = () => {
  const { isAuthenticated } = useAuth();
  const { quantityInBasket } = useProductsInBasketStore();
  const { openDrawerMobileSearch } = useDrawerMobileSearch();
  const { openBasketDrawer } = useDrawerBasketStore();
  const { isOpen, openCategoryDrawer } = useDrawerMobileCategory();

  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showTabBar, setShowTabBar] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  const mainTabItems = [
    {
      name: "Accueil",
      path: "/",
      icon: <Home size={22} />,
    },
    {
      name: "Recherche",
      path: "/search",
      icon: <CiSearch size={22} />,
      isSearch: true,
    },
    {
      name: "Menu",
      path: "#",
      icon: <Grid3x3 size={24} />,
      isCenter: true,
    },
    {
      name: "Catégories",
      path: "/Collections/tunisie?page=1",
      icon: <Grid3x3 size={22} />,
      isCategory: true
    },
    {
      name: isAuthenticated ? "Compte" : "Connexion",
      path: isAuthenticated ? "/Account" : "/signin",
      icon: isAuthenticated ? <UserCircle size={22} /> : <User size={22} />,
    },
  ];

  const expandedItems = [
    {
      name: "Panier",
      path: "/basket",
      icon: <ShoppingBag size={22} />,
      color: "bg-orange-500",
      badge: quantityInBasket > 0 ? quantityInBasket : null,
      isBasket: true,
    },
    {
      name: "Favoris",
      path: "/FavoriteList",
      icon: <Heart size={22} />,
      color: "bg-red-500",
    },
    {
      name: "Colis",
      path: "/TrackingPackages",
      icon: <GoPackageDependents size={22} />,
      color: "bg-blue-500",
    },
    ...(isAuthenticated ? [{
      name: "Compte",
      path: "/Account",
      icon: <UserCircle size={22} />,
      color: "bg-green-500",
    }] : []),
  ];

  const handleItemClick = useCallback((item: any) => {
    if (item.isSearch) {
      openDrawerMobileSearch();
    } else {
      handleNavigation(item.name);
    }
  }, [openDrawerMobileSearch, handleNavigation]);

  const toggleExpanded = () => {
    if (!isExpanded) {
      setIsVisible(true);
      setTimeout(() => setIsExpanded(true), 10);
    } else {
      setIsExpanded(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  };

  const closeMenu = () => {
    setIsExpanded(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  // Handle scroll to show/hide tab bar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show tab bar after scrolling down 200px
      if (currentScrollY > 200) {
        setShowTabBar(true);
      }

      // Hide tab bar when scrolling up past 200px
      if (currentScrollY < 200) {
        setShowTabBar(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      {/* Backdrop */}
      {isVisible && (
        <div
          className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'
            }`}
          onClick={closeMenu}
        />
      )}

      {/* Expanded Menu */}
      {isVisible && (
        <div
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 md:hidden transition-all duration-300 ${isExpanded
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-5'
            }`}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-4 min-w-[280px]">
            <div className={`grid gap-3 ${isAuthenticated ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {expandedItems.map((item, index) => (
                item.isBasket ? (
                  <button
                    key="basket-button"
                    onClick={() => {
                      openBasketDrawer();
                      closeMenu();
                    }}
                  >
                    <div
                      className={`flex flex-col items-center justify-center p-4 rounded-xl hover:bg-gray-50 transition-all active:scale-95 ${isExpanded ? 'animate-fadeInUp' : ''
                        }`}
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animationFillMode: 'both'
                      }}
                    >
                      <div className={`${item.color} rounded-full p-3 mb-2 transition-transform hover:scale-110 relative`}>
                        <div className="text-white">
                          {item.icon}
                        </div>
                        {item.badge && (
                          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        {item.name}
                      </span>
                    </div>
                  </button>
                ) : (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => {
                      handleNavigation(item.name);
                      closeMenu();
                    }}
                  >
                    <div
                      className={`flex flex-col items-center justify-center p-4 rounded-xl hover:bg-gray-50 transition-all active:scale-95 ${isExpanded ? 'animate-fadeInUp' : ''
                        }`}
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animationFillMode: 'both'
                      }}
                    >
                      <div className={`${item.color} rounded-full p-3 mb-2 transition-transform hover:scale-110 relative`}>
                        <div className="text-white">
                          {item.icon}
                        </div>
                        {item.badge && (
                          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        {item.name}
                      </span>
                    </div>
                  </Link>
                )
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Tab Bar */}
      <div className={`fixed -bottom-5 left-0 right-0 z-50 bg-white md:hidden transition-transform duration-300 ${showTabBar ? '-translate-y-5' : 'translate-y-full'
        }`}>
        <div className="bg-white border-t border-gray-200">
          <div className="safe-area-inset-bottom">
            <div className="flex justify-around items-end px-4 py-2">
              {mainTabItems.map((item, index) => (
                item.isCenter ? (
                  // Center expand button
                  <button
                    key="center-button"
                    onClick={toggleExpanded}
                    className="flex flex-col items-center justify-center flex-1"
                  >
                    <div className="flex flex-col items-center -mt-6 active:scale-95 transition-transform">
                      <div
                        className={`rounded-full p-3.5 shadow-lg mb-1 transition-all duration-300 ${isExpanded ? 'bg-primaryColor rotate-45' : 'bg-logoColor rotate-0'
                          }`}
                      >
                        <div className="text-white">
                          {isExpanded ? <X size={24} /> : item.icon}
                        </div>
                      </div>
                      <span className="text-[11px] text-gray-600 font-normal mt-1">
                        {isExpanded ? 'Fermer' : item.name}
                      </span>
                    </div>
                  </button>
                ) : item.isSearch ? (
                  <button
                    key={item.path}
                    onClick={() => handleItemClick(item)}
                    className="flex flex-col items-center justify-center flex-1"
                  >
                    <div className="flex flex-col items-center py-1 active:scale-95 transition-transform">
                      <div className="text-gray-400 transition-colors duration-200">
                        {item.icon}
                      </div>
                      <span className="text-[11px] mt-1 font-normal text-gray-600 transition-colors duration-200">
                        {item.name}
                      </span>
                    </div>
                  </button>
                ) : item.isCategory ? (
                  <button
                    key={item.path}
                    onClick={openCategoryDrawer}
                    className="flex flex-col items-center justify-center flex-1"
                  >
                    <div className="flex flex-col items-center py-1 active:scale-95 transition-transform">
                      <div className="text-gray-400 transition-colors duration-200">
                        {item.icon}
                      </div>
                      <span className="text-[11px] mt-1 font-normal text-gray-600 transition-colors duration-200">
                        {item.name}
                      </span>
                    </div>
                  </button>
                ) : (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => handleNavigation(item.name)}
                    className="flex flex-col items-center justify-center flex-1"
                  >
                    <div className="flex flex-col items-center py-1 active:scale-95 transition-transform">
                      <div
                        className={`transition-colors duration-200 ${isActive(item.path)
                          ? "text-primaryColor"
                          : "text-gray-400"
                          }`}
                      >
                        {item.icon}
                      </div>
                      <span
                        className={`text-[11px] mt-1 font-normal transition-colors duration-200 ${isActive(item.path)
                          ? "text-primaryColor"
                          : "text-gray-600"
                          }`}
                      >
                        {item.name}
                      </span>
                    </div>
                  </Link>
                )
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default memo(TabBarMobile);