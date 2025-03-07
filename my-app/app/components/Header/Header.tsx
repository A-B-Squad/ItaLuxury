"use client";
import React, { useEffect, useState, useCallback } from "react";
import BottomHeader from "./BottomHeader";
import Dropdown from "./CategoryDropdown/Dropdown";
import TopHeader from "./TopHeader";
import { useQuery } from "@apollo/client";
import { COMPANY_INFO_QUERY } from "@/graphql/queries";
import ContactBanner from "./ContactBanner";
import { motion, AnimatePresence } from "framer-motion";
import { debounce } from "lodash";

const Header = () => {
  const [showCategoryDropdown, setShowDropdown] = useState<boolean>(false);
  const [isFixed, setIsFixed] = useState<boolean>(false);
  const { data: CompanyInfoData } = useQuery(COMPANY_INFO_QUERY);
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  // Enhanced scroll handler with improved logic
  const handleScroll = useCallback(
    debounce(() => {
      const currentScrollPos = window.scrollY;
      
      // Calculate scroll direction
      const isScrollingDown = prevScrollPos < currentScrollPos;
      
      // Set visibility based on scroll direction and position
      // Always show header when near the top of the page
      if (currentScrollPos < 100) {
        setVisible(true);
      } else {
        // When scrolling down, hide the header after a threshold
        // When scrolling up, show the header
        setVisible(!isScrollingDown);
      }
      
      // Set header to fixed when scrolled past the banner
      setIsHeaderFixed(currentScrollPos > 40);
      
      setPrevScrollPos(currentScrollPos);
    }, 30), // Reduced debounce time for more responsive behavior
    [prevScrollPos]
  );

  // Attach scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    
    // Initial setup
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, [handleScroll]);

  return (
    <>
      <ContactBanner CompanyInfoData={CompanyInfoData} />

      <motion.header
        className={`header w-full z-[100] bg-white ${
          isHeaderFixed ? "shadow-lg" : ""
        }`}
        initial={{ opacity: 1, y: 0 }}
        animate={{ 
          opacity: 1,
          y: isHeaderFixed ? (visible ? 0 : -100) : 0,
          position: isHeaderFixed ? "fixed" : "relative",
          top: isHeaderFixed ? 0 : "auto",
        }}
        transition={{ 
          duration: 0.3,
          ease: "easeInOut"
        }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex flex-col py-3 md:py-0 relative w-full">
            <TopHeader logo={CompanyInfoData?.companyInfo?.logo} />
            <div className="h-px w-full bg-gray-100 my-2 md:block hidden"></div>
            <BottomHeader
              isFixed={isFixed}
              setIsFixed={setIsFixed}
              setShowDropdown={setShowDropdown}
            />
          </nav>
          <Dropdown
            setShowDropdown={setShowDropdown}
            showCategoryDropdown={showCategoryDropdown}
            isFixed={isFixed}
          />
        </div>
      </motion.header>
      
      {/* Add spacer when header is fixed to prevent content jump */}
      {isHeaderFixed && <div className="h-[120px] md:h-[140px]"></div>}
    </>
  );
};

export default Header;
