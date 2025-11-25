"use client";
import { useAuth } from "@/app/hooks/useAuth";
import {
  useDrawerBasketStore,
  useDrawerMobileSearch,
  useDrawerMobileSideBar,
  useProductsInBasketStore,
} from "@/app/store/zustand";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect, useRef, useState
} from "react";
import { HiPlus } from "react-icons/hi";
import { RiDiscountPercentLine } from "react-icons/ri";
import DesktopNavigation from "./DesktopNavigation";
import MobileHeader from "./MobileHeader";
import MoreMenuDropdown from "./MoreMenuDropdown";

//  Determine active link from pathname
const determineActiveLink = (pathname: string): string => {
  if (pathname === "/") {
    return "home";
  }

  if (pathname.includes("/Collections")) {
    const searchParams = new URLSearchParams(globalThis.location.search);
    const choice = searchParams.get("choice");

    if (choice === "in-discount") return "promo";
    if (pathname.includes("/electromenager")) return "electromenager";
    if (pathname.includes("/cuisine")) return "cuisine";
    if (pathname.includes("/deco-maison")) return "deco";
    if (pathname.includes("/appareil-coiffure")) return "coiffure";
    if (pathname.includes("/nouveaute")) return "nouveaute";
    return "shop";
  }

  if (pathname.includes("/Contact-us")) {
    return "contact";
  }

  return "";
};

//Get style classes based on transparency
const getStyleClasses = (isTransparent: boolean) => ({
  textColor: isTransparent ? 'text-white' : 'text-gray-700',
  hoverTextColor: isTransparent ? 'hover:text-white/90' : 'hover:text-primaryColor',
  borderColor: isTransparent ? 'border-white/20' : 'border-gray-100',
});


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

  const { textColor, hoverTextColor, borderColor } = getStyleClasses(isTransparent);

  // Close menus when clicking outside
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update active link whenever the pathname changes
  useEffect(() => {
    setActiveLink(determineActiveLink(pathname));
  }, [pathname]);

  const handleNavigation = (linkId: string) => {
    setActiveLink(linkId);
    setShowMoreMenu(false);
  };

  // Handle mouse enter on header to close dropdown
  const handleHeaderMouseEnter = () => {
    setShowDropdown(false);
  };

  return (
    <>
      <nav
        className={`bottom-header-container transition-all duration-500 w-full border-b ${borderColor} ${isFixed ? "header-fixed backdrop-blur-md z-50 shadow-sm" : "header-default"}`}
        onMouseEnter={handleHeaderMouseEnter}
        role="navigation"
        aria-label="Navigation principale"
      >
        {/* Mobile Header */}
        <MobileHeader
          textColor={textColor}
          openDrawerMobileSideBar={openDrawerMobileSideBar}
          isTransparent={isTransparent}
          openDrawerMobileSearch={openDrawerMobileSearch}
          openBasketDrawer={openBasketDrawer}
          quantityInBasket={quantityInBasket}
          isAuthenticated={isAuthenticated}
          showUserMenu={showUserMenu}
          setShowUserMenu={setShowUserMenu}
          userMenuRef={userMenuRef}
          userData={userData}
        />

        {/* Desktop Header */}
        <div className="desktop-header-wrapper hidden lg:block">
          <div className="desktop-header-content flex items-center px-6 relative">
            {/* Left Section - Categories Button */}
            <div className={`desktop-categories-section flex py-2 items-center ${isTransparent ? 'bg-white/10 backdrop-blur-sm text-white' : 'bg-logoColor text-white'} transition-all duration-500`}>
              <motion.button
                type="button"
                className={`desktop-categories-button px-4 py-2.5 flex items-center gap-2.5 rounded-lg transition-all duration-300 group ${isTransparent ? 'hover:bg-white/20' : 'hover:bg-gray-50'}`}
                onMouseEnter={() => setShowDropdown(true)}
                whileHover={{ backgroundColor: isTransparent ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.03)" }}
                aria-label="Ouvrir le menu des catégories"
                aria-expanded={false}
              >
                <div className="desktop-hamburger-icon relative w-5 h-5 flex flex-col justify-center gap-[5px]" aria-hidden="true">
                  <span className="hamburger-line-1 w-5 h-[1.5px] bg-white group-hover:bg-primaryColor transition-all"></span>
                  <span className="hamburger-line-2 w-3.5 h-[1.5px] bg-white group-hover:bg-primaryColor transition-all"></span>
                  <span className="hamburger-line-3 w-4 h-[1.5px] bg-white group-hover:bg-primaryColor transition-all"></span>
                </div>
                <span className="desktop-categories-text font-semibold tracking-wide text-base text-white group-hover:text-primaryColor transition-colors">
                  Nos Catégories
                </span>
              </motion.button>
            </div>

            {/* Desktop Navigation */}
            <DesktopNavigation
              activeLink={activeLink}
              handleNavigation={handleNavigation}
              isTransparent={isTransparent}
              textColor={textColor}
              hoverTextColor={hoverTextColor}
            />

            {/* Right Section - Promotion Button and More Menu */}
            <div className="flex items-center gap-3 ml-auto">
              {/* Promotion Button */}
              <Link href="/Collections?choice=in-discount&page=1" aria-label="Voir les promotions">
                <motion.button
                  onClick={() => handleNavigation("promo")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${activeLink === "promo"
                    ? "bg-red-600 text-white shadow-md"
                    : isTransparent
                      ? "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 shadow-lg"
                      : "bg-red-600 text-white hover:bg-red-700 hover:shadow-md"
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-current={activeLink === "promo" ? "page" : undefined}
                >
                  <RiDiscountPercentLine className="text-lg" aria-hidden="true" />
                  <span>Promotions</span>
                  <span 
                    className={`${isTransparent && activeLink !== "promo" ? 'bg-white text-primaryColor' : 'bg-white text-red-600'} text-xs font-bold px-1.5 py-0.5 rounded-full`}
                    aria-hidden="true"
                  >
                    %
                  </span>
                </motion.button>
              </Link>

              {/* More Menu Button */}
              <div className="desktop-more-menu relative 2xl:hidden" ref={moreMenuRef}>
                <motion.button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border ${isTransparent
                    ? 'border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'
                    : 'border-gray-200 hover:bg-gray-100'
                    }`}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Menu supplémentaire"
                  aria-expanded={showMoreMenu}
                  aria-haspopup="true"
                >
                  <HiPlus 
                    className={`text-xl ${textColor} transition-transform duration-300 ${showMoreMenu ? 'rotate-45' : ''}`} 
                    aria-hidden="true"
                  />
                  <span className={`font-semibold text-base ${textColor}`}>Plus</span>
                </motion.button>

                <MoreMenuDropdown
                  showMoreMenu={showMoreMenu}
                  activeLink={activeLink}
                  handleNavigation={handleNavigation}
                />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default BottomHeader;