"use client";
import React, { useEffect, useState } from "react";
import BottomHeader from "./BottomHeader";
import Dropdown from "./CategoryDropdown/Dropdown";
import TopHeader from "./TopHeader";
import { useQuery } from "@apollo/client";
import { COMPANY_INFO_QUERY } from "@/graphql/queries";
import Contact from "./Contact";

const Header = () => {
  const [showCategoryDropdown, setShowDropdown] = useState<Boolean>(false);
  const [isFixed, setIsFixed] = useState<boolean>(false);
  const { data: CompanyInfoData } = useQuery(COMPANY_INFO_QUERY);

  // Add state to track if the header should be fixed
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);

  // Add event listener to handle scroll
  const handleScroll = () => {
    // Get the current scroll position
    const scrollPosition = window.scrollY;

    // Set the header to fixed position when scrolling down
    setIsHeaderFixed(scrollPosition > 0);
  };

  // Attach scroll event listener when component mounts
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Contact CompanyInfoData={CompanyInfoData}   />

      <div
        className={`header relative  flex justify-center shadow-xl  px-10 md:px-14 ${isHeaderFixed ? "fixed top-0 left-0 right-0 z-50" : "relative"}`}
      >
        <nav className="container flex flex-col relative w-full items-center justify-center">
          <TopHeader logo={CompanyInfoData?.companyInfo?.logo} />
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
    </>
  );
};

export default Header;
