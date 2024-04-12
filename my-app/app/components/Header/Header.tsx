"use client";
import React, { useState } from "react";
import BottomHeader from "./BottomHeader";
import Dropdown from "./CategoryDropdown/Dropdown";
import TopHeader from "./TopHeader";

const Header = () => {
  const [showCategoryDropdown, setShowDropdown] = useState<Boolean>(false);

  return (
    <div className="header   relative shadow-xl  px-10  md:px-20 ">
      <nav className="container  ">
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
