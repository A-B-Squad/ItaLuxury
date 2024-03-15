"use client";
import React, { useState } from "react";
import BottomHeader from "./BottomHeader";
import TopHeader from "./TopHeader";
import Dropdown from "./Dropdown/Dropdown";
import BasketDrawer from "../BasketDrawer";
import { DrawerMobile } from "./Dropdown/DrawerMobile";

const Header = () => {
  const [showCategoryDropdown, setShowDropdown] = useState<Boolean>(false);

  const [openRight, setOpenRight] = useState(false);
  const openDrawerRight = () => setOpenRight(true);
  const closeDrawerRight = () => setOpenRight(false);

  const [openMobileCategoryDrawer, setOpenCategoryDrawer] = useState(false);
  const openMobileDrawerCategory = () => setOpenCategoryDrawer(true);
  const closeMobileDrawerCategory = () => setOpenCategoryDrawer(false);

  return (
    <div className="header  relative shadow-xl  px-10  md:px-20 ">
      <nav className="container ">
        <TopHeader openDrawerRight={openDrawerRight} />
        <BottomHeader
          setShowDropdown={setShowDropdown}
          openMobileDrawerCategory={openMobileDrawerCategory}
          openDrawerRight={openDrawerRight}
        />  
      </nav>
      <Dropdown
        setShowDropdown={setShowDropdown}
        showCategoryDropdown={showCategoryDropdown}

        
      />
      <BasketDrawer openRight={openRight} closeDrawerRight={closeDrawerRight} />
      <DrawerMobile
       openMobileCategoryDrawer={openMobileCategoryDrawer}
        closeMobileDrawerCategory={closeMobileDrawerCategory}
        />
    </div>
  );
};

export default Header;
