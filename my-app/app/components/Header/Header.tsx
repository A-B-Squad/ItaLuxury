"use client";
import { useState, useEffect } from "react";
import BottomHeader from "./BottomHeader";
import Dropdown from "./CategoryDropdown/Dropdown";
import ContactBanner from "./ContactBanner";
import TopHeader from "./TopHeader";

import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const Header = ({ userData, companyData }: any) => {
  const [showCategoryDropdown, setShowDropdown] = useState<boolean>(false);
  const [isFixed, setIsFixed] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const pathname = usePathname();

  // Check if current page is checkout, home, or product page
  const isCheckoutPage = pathname === "/Checkout";
  const isHomePage = pathname === "/" || pathname === "/Home";
  const isProductPage = pathname?.startsWith("/products");

  useEffect(() => {
    // Only enable scroll behavior on home page
    if (!isHomePage) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  if (isCheckoutPage) {
    return null;
  }

  return (
    <>
      {!isHomePage && !isProductPage && <ContactBanner companyData={companyData} />}

      <div
        className={`header w-full top-0 z-[999] transition-all duration-500 
          ${isHomePage ? "fixed" : "relative"}
          
          ${isHomePage
            ? isScrolled
              ? "bg-white shadow-lg"
              : "backdrop-blur-sm"
            : "bg-white shadow-sm"
          }`}
      >
        <div className="container mx-auto">
          {isHomePage && !isScrolled && <ContactBanner companyData={companyData} />}
          <nav className="flex flex-col relative w-full px-4 lg:px-8">
            <TopHeader userData={userData} isTransparent={isHomePage && !isScrolled} />

            <BottomHeader
              isFixed={isFixed}
              setIsFixed={setIsFixed}
              setShowDropdown={setShowDropdown}
              userData={userData}
              isTransparent={isHomePage && !isScrolled}
            />
          </nav>
          <AnimatePresence>
            {showCategoryDropdown && (
              <Dropdown
                setShowDropdown={setShowDropdown}
                showCategoryDropdown={showCategoryDropdown}
                isFixed={isFixed}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default Header;