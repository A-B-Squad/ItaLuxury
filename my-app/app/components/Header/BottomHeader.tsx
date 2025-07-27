"use client";
import {
  useDrawerBasketStore,
  useDrawerMobileStore,
  useProductsInBasketStore,
} from "@/app/store/zustand";
import { useAuth } from "@/lib/auth/useAuth";
import { sendGTMEvent } from "@next/third-parties/google";
import { motion } from "framer-motion";
import Image from "next/legacy/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiUser } from "react-icons/fi";
import { HiMiniBars3CenterLeft } from "react-icons/hi2";
import { IoBagHandleOutline } from "react-icons/io5";
import SearchBar from "./SearchBar";
import UserAvatar from "./UserAvatar";

function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const BottomHeader = ({ setShowDropdown, isFixed, setIsFixed }: any) => {

  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { openCategoryDrawer } = useDrawerMobileStore();
  const { openBasketDrawer } = useDrawerBasketStore();
  const { quantityInBasket } = useProductsInBasketStore();
  const { decodedToken, isAuthenticated } = useAuth();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update active link whenever the pathname changes
  useEffect(() => {
    if (pathname && pathname === "/") setActiveLink("home");
    else if (pathname && pathname.includes("/Collections")) {
      const searchParams = new URLSearchParams(window.location.search);
      const choice = searchParams.get("choice");

      if (choice === "in-discount") {
        setActiveLink("promo");
      } else {
        setActiveLink("shop");
      }
    }
    else if (pathname && pathname.includes("/Contact-us")) setActiveLink("contact");
    else setActiveLink("");
  }, [pathname]);

  const handleScroll = useCallback(() => {
    if (window.scrollY > 50) {
      setIsFixed(true);
    } else {
      setIsFixed(false);
    }
  }, [setIsFixed]);

  useEffect(() => {
    const debouncedHandleScroll = debounce(handleScroll, 100);
    window.addEventListener("scroll", debouncedHandleScroll);
    return () => {
      window.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, [handleScroll]);


  const handleNavigation = (pageName: string, linkId: string) => {
    setActiveLink(linkId);
    sendGTMEvent({
      event: "page_view",
      page_title: pageName,
      page_location: window.location.href,
      user_data: isAuthenticated
        ? {
          country: ["tn"],
          external_id: decodedToken?.userId,
        }
        : undefined,
      facebook_data: {
        content_name: pageName,
        content_type: "page",
      },
    });
  };



  return (
    <>
      {/* Main Header */}
      <div
        className={`bottom-header-container  transition-all duration-300 py-2 w-full border-b border-gray-100 ${isFixed
          ? "header-fixed bg-white/95 backdrop-blur-md z-50 shadow-sm"
          : "header-default bg-white"
          }`}
        onMouseEnter={() => setShowDropdown(false)}
      >
        {/* Mobile Header */}
        <div className="mobile-header-wrapper md:hidden">
          <div className="mobile-header-content flex items-center px-4 py-3 relative">
            {/* Left Section - Menu Button */}
            <div className="mobile-left-section flex items-center">
              <motion.button
                type="button"
                className="mobile-menu-button  rounded-lg md:hidden hover:bg-gray-50 transition-colors"
                onClick={openCategoryDrawer}
                whileTap={{ scale: 0.95 }}
              >
                <HiMiniBars3CenterLeft className="mobile-menu-icon text-2xl text-gray-700" />
              </motion.button>
            </div>

            {/* Center Section - Logo (Always Centered) */}
            <div className="mobile-logo-section md:hidden absolute left-1/2 transform -translate-x-1/2">
              <Link href="/" className="mobile-logo-link flex-shrink-0">
                <div className="mobile-logo-container relative w-24 h-10">
                  <Image
                    src={"/LOGO.png"}
                    layout="fill"
                    objectFit="contain"
                    quality={100}
                    priority={true}
                    alt="ita-luxury"
                    className="mobile-logo-image transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </Link>
            </div>

            {/* Right Section - Actions */}
            <div className="mobile-actions-section flex items-center justify-end gap-1 ml-auto">
              {/* Search Button */}
              <div className="mobile-search-wrapper md:hidden">
                <div className=" mt-1 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-all duration-200 ease-in-out">
                  <SearchBar />
                </div>
              </div>

              {/* Basket Button */}
              <motion.button
                onClick={openBasketDrawer}
                className="mobile-basket-button relative p-2.5 rounded-xl md:hidden hover:bg-slate-50 active:bg-slate-100 transition-all duration-200 ease-in-out flex items-center justify-center min-w-[44px] min-h-[44px]"
                whileTap={{ scale: 0.95 }}
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
                }}
              >
                <IoBagHandleOutline className="mobile-basket-icon text-xl text-slate-700" />
                {quantityInBasket > 0 && (
                  <motion.span
                    className="mobile-basket-badge absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-semibold rounded-full min-w-[20px] h-5 flex items-center justify-center shadow-md border-2 border-white"
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      lineHeight: '1'
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    {quantityInBasket > 9 ? "9+" : quantityInBasket}
                  </motion.span>
                )}
              </motion.button>

              {/* User Avatar or Login Button */}
              {!isAuthenticated ? (
                <Link href="/signin">
                  <motion.button
                    className="mobile-user-login-button p-2.5 rounded-xl md:hidden hover:bg-slate-50 active:bg-slate-100 transition-all duration-200 ease-in-out flex items-center justify-center min-w-[44px] min-h-[44px]"
                    whileTap={{ scale: 0.95 }}
                    style={{
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation'
                    }}
                  >
                    <FiUser className="mobile-user-login-icon text-xl text-slate-700" />
                  </motion.button>
                </Link>
              ) : (
                <div className="flex items-center">
                  <UserAvatar
                    showUserMenu={showUserMenu}
                    setShowUserMenu={setShowUserMenu}
                    userMenuRef={userMenuRef}
                    isMobile={true}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="desktop-header-wrapper md:block hidden">
          <div className="desktop-header-content flex items-center py-3 px-6 relative">
            {/* Left Section - Categories Button */}
            <div className="desktop-categories-section flex items-center">
              <motion.button
                type="button"
                className="desktop-categories-button px-4 py-2.5 flex items-center gap-2.5 rounded-lg hover:bg-gray-50 transition-all duration-300 group"
                onMouseEnter={() => setShowDropdown(true)}
                whileHover={{ backgroundColor: "rgba(0,0,0,0.03)" }}
              >
                <div className="desktop-hamburger-icon relative w-5 h-5 flex flex-col justify-center gap-[5px]">
                  <span className="hamburger-line-1 w-5 h-[1.5px] bg-gray-700 group-hover:bg-primaryColor transition-all"></span>
                  <span className="hamburger-line-2 w-3.5 h-[1.5px] bg-gray-700 group-hover:bg-primaryColor transition-all"></span>
                  <span className="hamburger-line-3 w-4 h-[1.5px] bg-gray-700 group-hover:bg-primaryColor transition-all"></span>
                </div>
                <span className="desktop-categories-text font-medium tracking-wide text-sm group-hover:text-primaryColor transition-colors">
                  Nos Catégories
                </span>
              </motion.button>
            </div>

            <nav className="desktop-navigation LinksDesktop flex-1 flex justify-center">
              <ul className="desktop-nav-list flex items-center gap-8">
                <li className="nav-item-home">
                  <Link
                    href="/"
                    onClick={() => handleNavigation("Accueil", "home")}
                    className={`nav-link-home relative py-2 px-1 font-medium transition-colors ${activeLink === "home" ? "nav-link-active text-primaryColor" : "nav-link-inactive text-gray-700 hover:text-primaryColor"
                      }`}
                  >
                    Accueil
                    {activeLink === "home" && (
                      <motion.div
                        className="nav-underline-home absolute bottom-0 left-0 w-full h-0.5 bg-primaryColor"
                        layoutId="underline"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                </li>
                <li className="nav-item-shop">
                  <Link
                    href="/Collections/tunisie?page=1"
                    onClick={() => handleNavigation("Boutique", "shop")}
                    className={`nav-link-shop relative py-2 px-1 font-medium transition-colors ${activeLink === "shop" ? "nav-link-active text-primaryColor" : "nav-link-inactive text-gray-700 hover:text-primaryColor"
                      }`}
                  >
                    Boutique
                    {activeLink === "shop" && (
                      <motion.div
                        className="nav-underline-shop absolute bottom-0 left-0 w-full h-0.5 bg-primaryColor"
                        layoutId="underline"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                </li>
                <li className="nav-item-promo">
                  <Link
                    href={{
                      pathname: `/Collections/tunisie`,
                      query: { choice: "in-discount" },
                    }}
                    onClick={() => handleNavigation("Promotions", "promo")}
                    className={`nav-link-promo relative py-2 px-1 font-medium transition-colors ${activeLink === "promo" ? "nav-link-active text-primaryColor" : "nav-link-inactive text-gray-700 hover:text-primaryColor"
                      }`}
                  >
                    Promotions
                    {activeLink === "promo" && (
                      <motion.div
                        className="nav-underline-promo absolute bottom-0 left-0 w-full h-0.5 bg-primaryColor"
                        layoutId="underline"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                </li>
                <li className="nav-item-contact">
                  <Link
                    href="/Contact-us"
                    onClick={() => handleNavigation("Contact", "contact")}
                    className={`nav-link-contact relative py-2 px-1 font-medium transition-colors ${activeLink === "contact" ? "nav-link-active text-primaryColor" : "nav-link-inactive text-gray-700 hover:text-primaryColor"
                      }`}
                  >
                    Contact
                    {activeLink === "contact" && (
                      <motion.div
                        className="nav-underline-contact absolute bottom-0 left-0 w-full h-0.5 bg-primaryColor"
                        layoutId="underline"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Right Section - User Actions */}
            <div className="desktop-user-section flex items-center gap-4 ml-auto">
              {!isAuthenticated ? (
                <Link href="/signin">
                  <motion.button
                    className="desktop-user-login-button p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiUser className="desktop-user-login-icon text-xl text-gray-700" />
                  </motion.button>
                </Link>
              ) : (
                <UserAvatar showUserMenu={showUserMenu} setShowUserMenu={setShowUserMenu} userMenuRef={userMenuRef} isMobile={false} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomHeader;