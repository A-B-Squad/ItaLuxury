"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import BottomHeader from "./BottomHeader";
import Dropdown from "./CategoryDropdown/Dropdown";
import TopHeader from "./TopHeader";
import ContactBanner from "./ContactBanner";

import { motion, AnimatePresence } from "framer-motion";
import { debounce } from "lodash";
import { usePathname } from "next/navigation";

const Header = ({ userData, companyData }: any) => {
  const [showCategoryDropdown, setShowDropdown] = useState<boolean>(false);
  const [isFixed, setIsFixed] = useState<boolean>(false);
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerHeight = useRef<number>(0);
  const pathname = usePathname();

  // Check if current page is checkout
  const isCheckoutPage = pathname === "/Checkout";
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); 
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Measure header height on mount and resize
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        headerHeight.current = headerRef.current.offsetHeight;
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, []);

  // Enhanced scroll handler with improved performance
  const handleScroll = useCallback(
    debounce(() => {
      const currentScrollPos = window.scrollY;

      // Only process if scroll position has changed significantly
      if (Math.abs(currentScrollPos - prevScrollPos) < 5) return;

      // Calculate scroll direction
      const isScrollingDown = prevScrollPos < currentScrollPos;

      // Set visibility based on scroll direction and position
      if (currentScrollPos < 100) {
        setVisible(true);
      } else {
        // When scrolling down, hide the header after a threshold
        // When scrolling up, show the header
        setVisible(!isScrollingDown || currentScrollPos < 150);
      }

      // Set header to fixed when scrolled past the banner
      setIsHeaderFixed(currentScrollPos > 40);

      setPrevScrollPos(currentScrollPos);
    }, 20), // Reduced debounce time for more responsive behavior
    [prevScrollPos]
  );

  // Attach scroll event listener with passive option for better performance
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial setup
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, [handleScroll]);

  if (isCheckoutPage && isMobile) {
    return null;
  }

  return (
    <div>
      <ContactBanner companyData={companyData} />

      <motion.header
        ref={headerRef}
        className={`header w-full z-[9999] bg-white ${isHeaderFixed ? "shadow-md" : ""
          }`}
        initial={{ opacity: 1, y: 0 }}
        animate={{
          opacity: 1,
          y: isHeaderFixed ? (visible ? 0 : -headerHeight.current) : 0,
          position: isHeaderFixed ? "fixed" : "relative",
          top: isHeaderFixed ? 0 : "auto",
        }}
        transition={{
          duration: 0.3,
          ease: [0.1, 0.9, 0.2, 1]
        }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex flex-col  relative w-full">
            <TopHeader userData={userData} />
            <BottomHeader
              isFixed={isFixed}
              setIsFixed={setIsFixed}
              setShowDropdown={setShowDropdown}
              userData={userData}
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
      </motion.header>

      {/* Dynamic spacer based on actual header height */}
      {isHeaderFixed && (
        <div style={{ height: `${headerHeight.current}px` }} aria-hidden="true" />
      )}
    </div>
  );
};

export default Header;
