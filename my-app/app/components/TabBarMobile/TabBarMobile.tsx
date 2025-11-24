"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { useDrawerBasketStore, useDrawerMobileCategory, useDrawerMobileSearch, useProductsInBasketStore } from "@/app/store/zustand";
import { Grid3x3, Heart, Home, ShoppingBag, Store, User, UserCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { memo, useCallback, useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { GoPackageDependents } from "react-icons/go";
import ExpandedMenuItem from "./components/ExpandedMenuItem";
import TabItem from "./components/TabItem";



// ==================== MAIN COMPONENT ====================

const TabBarMobile = () => {
  const { isAuthenticated } = useAuth();
  const { quantityInBasket } = useProductsInBasketStore();
  const { openDrawerMobileSearch } = useDrawerMobileSearch();
  const { openBasketDrawer } = useDrawerBasketStore();
  const { openCategoryDrawer } = useDrawerMobileCategory();

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
      path: "/Collections?page=1",
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
      name: "Boutique",
      path: "/Collections?page=1",
      icon: <Store size={22} />,
      color: "bg-purple-500",
    },
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
    }
  }, [openDrawerMobileSearch]);

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
      const currentScrollY = globalThis.scrollY;

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

    globalThis.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      globalThis.removeEventListener('scroll', handleScroll);
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
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 md:hidden transition-all duration-300 ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-4 min-w-[280px]">
            <div className={`grid gap-3 ${isAuthenticated ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {expandedItems.map((item, index) => (
                <ExpandedMenuItem
                  key={item.path}
                  item={item}
                  index={index}
                  isExpanded={isExpanded}
                  openBasketDrawer={openBasketDrawer}
                  closeMenu={closeMenu}
                />
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
                <TabItem
                  key={item.path}
                  item={item}
                  isExpanded={isExpanded}
                  toggleExpanded={toggleExpanded}
                  handleItemClick={handleItemClick}
                  openCategoryDrawer={openCategoryDrawer}
                  isActive={isActive}
                />
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