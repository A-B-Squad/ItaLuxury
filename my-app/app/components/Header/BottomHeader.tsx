"use client";
import {
  useDrawerBasketStore,
  useDrawerMobileSearch,
  useDrawerMobileSideBar,
  useProductsInBasketStore,
} from "@/app/store/zustand";
import { useAuth } from "@/app/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect, useRef, useState
} from "react";
import { FiUser } from "react-icons/fi";
import { HiMiniBars3CenterLeft } from "react-icons/hi2";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiPlus } from "react-icons/hi";
import UserAvatar from "./UserAvatar";
import { CiSearch } from "react-icons/ci";
import { RiDiscountPercentLine } from "react-icons/ri";

const BottomHeader = ({ setShowDropdown, isFixed, userData, isTransparent }: any) => {
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const { openDrawerMobileSideBar } = useDrawerMobileSideBar();
  const { openBasketDrawer } = useDrawerBasketStore();
  const { quantityInBasket } = useProductsInBasketStore();
  const { isAuthenticated } = useAuth();
  const { openDrawerMobileSearch } = useDrawerMobileSearch();

  // Dynamic styling based on transparency
  const textColor = isTransparent ? 'text-white' : 'text-gray-700';
  const hoverTextColor = isTransparent ? 'hover:text-white/90' : 'hover:text-primaryColor';
  const borderColor = isTransparent ? 'border-white/20' : 'border-gray-100';

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update active link whenever the pathname changes
  useEffect(() => {
    if (pathname && pathname === "/") {
      setActiveLink("home");
    } else if (pathname && pathname.includes("/Collections")) {
      const searchParams = new URLSearchParams(window.location.search);
      const choice = searchParams.get("choice");

      if (choice === "in-discount") {
        setActiveLink("promo");
      } else if (pathname.includes("/electromenager")) {
        setActiveLink("electromenager");
      } else if (pathname.includes("/cuisine")) {
        setActiveLink("cuisine");
      } else if (pathname.includes("/deco-maison")) {
        setActiveLink("deco");
      } else if (pathname.includes("/appareil-coiffure")) {
        setActiveLink("coiffure");
      } else if (pathname.includes("/nouveaute")) {
        setActiveLink("nouveaute");
      } else {
        setActiveLink("shop");
      }
    } else if (pathname && pathname.includes("/Contact-us")) {
      setActiveLink("contact");
    } else {
      setActiveLink("");
    }
  }, [pathname]);

  const handleNavigation = (linkId: string) => {
    setActiveLink(linkId);
    setShowMoreMenu(false);
  };

  const NavLink = ({ href, onClick, linkId, children }: any) => (
    <Link
      href={href}
      onClick={onClick}
      className={`relative py-2 px-1 font-semibold text-base transition-colors ${
        activeLink === linkId 
          ? isTransparent ? "text-white" : "text-primaryColor"
          : `${textColor} ${hoverTextColor}`
      }`}
    >
      {children}
      {activeLink === linkId && (
        <motion.div
          className={`absolute bottom-0 left-0 w-full h-0.5 ${isTransparent ? 'bg-white' : 'bg-primaryColor'}`}
          layoutId="underline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </Link>
  );

  return (
    <>
      {/* Main Header */}
      <div
        className={`bottom-header-container transition-all duration-500 w-full border-b ${borderColor} ${
          isFixed ? "header-fixed backdrop-blur-md z-50 shadow-sm" : "header-default"
        }`}
        onMouseEnter={() => setShowDropdown(false)}
      >
        {/* Mobile Header */}
        <div className="mobile-header-wrapper lg:hidden">
          <div className="mobile-header-content flex items-center px-4 py-3 relative">
            {/* Left Section - Menu Button */}
            <div className="mobile-left-section flex items-center">
              <motion.button
                type="button"
                className="mobile-menu-button rounded-lg lg:hidden hover:bg-gray-50 transition-colors"
                onClick={openDrawerMobileSideBar}
                whileTap={{ scale: 0.95 }}
              >
                <HiMiniBars3CenterLeft className={`mobile-menu-icon text-2xl ${textColor}`} />
              </motion.button>
            </div>

            <div className="mobile-logo-section lg:hidden absolute left-1/2 transform -translate-x-1/2">
              <Link href="/" className="mobile-logo-link flex-shrink-0">
                <div className="mobile-logo-container relative w-24 h-10">
                  <Image
                    src={"/images/logos/LOGO.png"}
                    width={70}
                    height={70}
                    style={{
                      objectFit: "contain",
                    }}
                    quality={100}
                    priority={true}
                    alt="ita-luxury"
                    className={`mobile-logo-image transition-transform duration-300 hover:scale-105 ${
                      isTransparent ? 'brightness-0 invert' : ''
                    }`}
                  />
                </div>
              </Link>
            </div>

            {/* Right Section - Actions */}
            <div className="mobile-actions-section flex items-center justify-end gap-1 ml-auto">
              {/* Search Button */}
              <motion.button
                onClick={openDrawerMobileSearch}
                className="mobile-search-button relative p-2.5 rounded-xl lg:hidden hover:bg-slate-50 active:bg-slate-100 transition-all duration-200 ease-in-out flex items-center justify-center min-w-[44px] min-h-[44px]"
                whileTap={{ scale: 0.95 }}
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
                }}
              >
                <CiSearch className={`mobile-search-icon text-xl ${textColor}`} />
              </motion.button>

              {/* Basket Button */}
              <motion.button
                onClick={openBasketDrawer}
                className="mobile-basket-button relative p-2.5 rounded-xl lg:hidden hover:bg-slate-50 active:bg-slate-100 transition-all duration-200 ease-in-out flex items-center justify-center min-w-[44px] min-h-[44px]"
                whileTap={{ scale: 0.95 }}
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
                }}
              >
                <IoBagHandleOutline className={`mobile-basket-icon text-xl ${textColor}`} />
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
                    className="mobile-user-login-button p-2.5 rounded-xl lg:hidden hover:bg-slate-50 active:bg-slate-100 transition-all duration-200 ease-in-out flex items-center justify-center min-w-[44px] min-h-[44px]"
                    whileTap={{ scale: 0.95 }}
                    style={{
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation'
                    }}
                  >
                    <FiUser className={`mobile-user-login-icon text-xl ${textColor}`} />
                  </motion.button>
                </Link>
              ) : (
                <div className="flex items-center">
                  <UserAvatar
                    showUserMenu={showUserMenu}
                    setShowUserMenu={setShowUserMenu}
                    userMenuRef={userMenuRef}
                    isMobile={true}
                    userData={userData}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="desktop-header-wrapper hidden lg:block">
          <div className="desktop-header-content flex items-center px-6 relative">
            {/* Left Section - Categories Button */}
            <div className={`desktop-categories-section flex py-2 items-center ${
              isTransparent ? 'bg-white/10 backdrop-blur-sm text-white' : 'bg-logoColor text-white'
            } transition-all duration-500`}>
              <motion.button
                type="button"
                className={`desktop-categories-button px-4 py-2.5 flex items-center gap-2.5 rounded-lg transition-all duration-300 group ${
                  isTransparent ? 'hover:bg-white/20' : 'hover:bg-gray-50'
                }`}
                onMouseEnter={() => setShowDropdown(true)}
                whileHover={{ backgroundColor: isTransparent ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.03)" }}
              >
                <div className="desktop-hamburger-icon relative w-5 h-5 flex flex-col justify-center gap-[5px]">
                  <span className={`hamburger-line-1 w-5 h-[1.5px] ${
                    isTransparent ? 'bg-white' : 'bg-white'
                  } group-hover:bg-primaryColor transition-all`}></span>
                  <span className={`hamburger-line-2 w-3.5 h-[1.5px] ${
                    isTransparent ? 'bg-white' : 'bg-white'
                  } group-hover:bg-primaryColor transition-all`}></span>
                  <span className={`hamburger-line-3 w-4 h-[1.5px] ${
                    isTransparent ? 'bg-white' : 'bg-white'
                  } group-hover:bg-primaryColor transition-all`}></span>
                </div>
                <span className={`desktop-categories-text font-semibold tracking-wide text-base ${
                  isTransparent ? 'text-white' : 'text-white'
                } group-hover:text-primaryColor transition-colors`}>
                  Nos Catégories
                </span>
              </motion.button>
            </div>

            <nav className="desktop-navigation LinksDesktop flex-1 h-full flex justify-center">
              <ul className="desktop-nav-list flex h-full items-center gap-8">
                {/* Always visible links */}
                <li className="nav-item-home h-full">
                  <NavLink
                    href="/"
                    onClick={() => handleNavigation("home")}
                    linkId="home"
                  >
                    Page d&apos;accueil
                  </NavLink>
                </li>
                <li className="nav-item-shop">
                  <NavLink
                    href="/Collections/tunisie?page=1"
                    onClick={() => handleNavigation("shop")}
                    linkId="shop"
                  >
                    Boutique
                  </NavLink>
                </li>

                <li className="nav-item-electromenager hidden lg:block">
                  <NavLink
                    href="/Collections/tunisie?category=Electroménager&page=1"
                    onClick={() => handleNavigation("electromenager")}
                    linkId="electromenager"
                  >
                    Électroménager
                  </NavLink>
                </li>

                {/* Hidden on smaller desktop screens (lg) */}
                <li className="nav-item-cuisine hidden xl:block">
                  <NavLink
                    href="/Collections/tunisie?category=Cuisine&page=1"
                    onClick={() => handleNavigation("cuisine")}
                    linkId="cuisine"
                  >
                    Cuisine
                  </NavLink>
                </li>
                <li className="nav-item-deco hidden xl:block">
                  <NavLink
                    href="/Collections/tunisie?category=Maison+et+Décoration&page=1"
                    onClick={() => handleNavigation("deco")}
                    linkId="deco"
                  >
                    Déco Maison
                  </NavLink>
                </li>
                <li className="nav-item-coiffure hidden 2xl:block">
                  <NavLink
                    href="/Collections/tunisie?category=Appareil+de+coiffure&page=1"
                    onClick={() => handleNavigation("coiffure")}
                    linkId="coiffure"
                  >
                    Appareil de coiffure
                  </NavLink>
                </li>
                <li className="nav-item-nouveaute hidden 2xl:block">
                  <NavLink
                    href="/Collections/tunisie?choice=new-product&page=1"
                    onClick={() => handleNavigation("nouveaute")}
                    linkId="nouveaute"
                  >
                    Nouveauté
                  </NavLink>
                </li>
              </ul>
            </nav>

            {/* Right Section - Promotion Button and More Menu */}
            <div className="flex items-center gap-3 ml-auto">
              {/* Promotion Button - Always Visible on Desktop */}
              <Link href="/Collections/tunisie?choice=in-discount&page=1">
                <motion.button
                  onClick={() => handleNavigation("promo")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    activeLink === "promo"
                      ? "bg-red-600 text-white shadow-md"
                      : isTransparent
                      ? "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 shadow-lg"
                      : "bg-red-600 text-white hover:bg-red-700 hover:shadow-md"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RiDiscountPercentLine className="text-lg" />
                  <span>Promotions</span>
                  <span className={`${
                    isTransparent && activeLink !== "promo" ? 'bg-white text-primaryColor' : 'bg-white text-red-600'
                  } text-xs font-bold px-1.5 py-0.5 rounded-full`}>
                    %
                  </span>
                </motion.button>
              </Link>

              {/* More Menu Button - Positioned on the right */}
              <div className="desktop-more-menu relative 2xl:hidden" ref={moreMenuRef}>
                <motion.button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border ${
                    isTransparent 
                      ? 'border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20' 
                      : 'border-gray-200 hover:bg-gray-100'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <HiPlus className={`text-xl ${textColor} transition-transform duration-300 ${showMoreMenu ? 'rotate-45' : ''}`} />
                  <span className={`font-semibold text-base ${textColor}`}>Plus</span>
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showMoreMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    >
                      <Link
                        href="/Collections/tunisie?choice=new-product&page=1"
                        onClick={() => handleNavigation("nouveaute")}
                        className={`block px-4 py-2.5 hover:bg-gray-50 transition-colors ${activeLink === "nouveaute" ? "text-primaryColor bg-gray-50" : "text-gray-700"
                          }`}
                      >
                        <span className="font-semibold">Nouveauté</span>
                      </Link>

                      <div className="lg:hidden">
                        <Link
                          href="/Collections/tunisie?category=Electroménager&page=1"
                          onClick={() => handleNavigation("electromenager")}
                          className={`block px-4 py-2.5 hover:bg-gray-50 transition-colors ${activeLink === "electromenager" ? "text-primaryColor bg-gray-50" : "text-gray-700"
                            }`}
                        >
                          <span className="font-semibold">Électroménager</span>
                        </Link>
                      </div>

                      {/* Show based on screen size */}
                      <div className="xl:hidden">
                        <Link
                          href="/Collections/tunisie?category=Cuisine&page=1"
                          onClick={() => handleNavigation("cuisine")}
                          className={`block px-4 py-2.5 hover:bg-gray-50 transition-colors ${activeLink === "cuisine" ? "text-primaryColor bg-gray-50" : "text-gray-700"
                            }`}
                        >
                          <span className="font-semibold">Cuisine</span>
                        </Link>
                        <Link
                          href="/Collections/tunisie?category=Maison+et+Décoration&page=1"
                          onClick={() => handleNavigation("deco")}
                          className={`block px-4 py-2.5 hover:bg-gray-50 transition-colors ${activeLink === "deco" ? "text-primaryColor bg-gray-50" : "text-gray-700"
                            }`}
                        >
                          <span className="font-semibold">Déco Maison</span>
                        </Link>
                      </div>

                      <Link
                        href="/Collections/tunisie?category=Appareil+de+coiffure&page=1"
                        onClick={() => handleNavigation("coiffure")}
                        className={`block px-4 py-2.5 hover:bg-gray-50 transition-colors ${activeLink === "coiffure" ? "text-primaryColor bg-gray-50" : "text-gray-700"
                          }`}
                      >
                        <span className="font-semibold">Appareil de coiffure</span>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomHeader;