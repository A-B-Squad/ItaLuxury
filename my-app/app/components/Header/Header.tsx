"use client";
import { useState } from "react";
import BottomHeader from "./BottomHeader";
import Dropdown from "./CategoryDropdown/Dropdown";
import ContactBanner from "./ContactBanner";
import TopHeader from "./TopHeader";

import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const Header = ({ userData, companyData }: any) => {


  const [showCategoryDropdown, setShowDropdown] = useState<boolean>(false);
  const [isFixed, setIsFixed] = useState<boolean>(false);

  const pathname = usePathname();

  // Check if current page is checkout
  const isCheckoutPage = pathname === "/Checkout";


  if (isCheckoutPage) {
    return null;
  }

  return (
    <>
      <ContactBanner companyData={companyData} />

      <div
        className={`header w-full sticy top-0  bg-white z-[999]`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex flex-col  relative w-full">
            <TopHeader
              userData={userData}

            />
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
      </div>


    </>
  );
};

export default Header;
