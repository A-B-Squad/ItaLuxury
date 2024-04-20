"use client";
import React, { useEffect, useState } from "react";
import BottomHeader from "./BottomHeader";
import Dropdown from "./CategoryDropdown/Dropdown";
import TopHeader from "./TopHeader";

const Header = () => {
  const [showCategoryDropdown, setShowDropdown] = useState<Boolean>(false);

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
    <div
      className={`header  shadow-xl bg-white px-10 md:px-20 ${isHeaderFixed ? "fixed top-0 left-0 right-0 z-50" : "relative"}`}
    >
      <nav className="container">
        <TopHeader />
        <BottomHeader setShowDropdown={setShowDropdown} />
      </nav>
      <Dropdown
        setShowDropdown={setShowDropdown}
        showCategoryDropdown={showCategoryDropdown}
      />
    </div>
  );
};

export default Header;
