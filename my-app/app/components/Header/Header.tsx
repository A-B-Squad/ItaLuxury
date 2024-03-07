"use client";
import React, { useState } from "react";
import BottomHeader from "./BottomHeader";
import TopHeader from "./TopHeader";
import Dropdown from "./Dropdown/Dropdown";
import BasketDrawer from "../BasketDrawer";

const Header = () => {
  const [showCategoryDropdown, setShowDropdown] = useState<Boolean>(false);
  const [openRight, setOpenRight] = useState(false);
  const openDrawerRight = () => setOpenRight(true);
  const closeDrawerRight = () => setOpenRight(false);

  return (
    <div className="header  relative shadow-xl  px-10  md:px-20 ">
      <nav className="container ">
        <TopHeader openDrawerRight={openDrawerRight} />
        <BottomHeader
          setShowDropdown={setShowDropdown}
          showCategoryDropdown={showCategoryDropdown}
        />
      </nav>
      <Dropdown
        setShowDropdown={setShowDropdown}
        showCategoryDropdown={showCategoryDropdown}
      />
      <BasketDrawer openRight={openRight} closeDrawerRight={closeDrawerRight} />
    </div>
  );
};

export default Header;
