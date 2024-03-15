import React from "react";
import Link from "next/link";
import { HiMiniBars3CenterLeft } from "react-icons/hi2";
import { FiUser } from "react-icons/fi";
import { FiHeart } from "react-icons/fi";
import { RiShoppingCartLine } from "react-icons/ri";

const BottomHeader = ({
  openMobileDrawerCategory,
  openDrawerRight,
  setShowDropdown,
}) => {
  return (
    <div className="container relative">
      <div
        className="BottomHeader flex justify-between items-center py-3 "
        onMouseEnter={() => setShowDropdown(false)}
      >
        <div
          className="p-1  rounded-md border-2"
          onMouseEnter={() => setShowDropdown(true)}
          onClick={openMobileDrawerCategory}
        >
          <HiMiniBars3CenterLeft className=" text-2xl cursor-pointer " />
        </div>

        <div className="dropDown hidden md:flex">
          <ul className="flex gap-5 ">
            <li className=" cursor-pointer hover:text-strongBeige transition-all">
              <Link href={`/`}>Accueil</Link>
            </li>
            <li className=" cursor-pointer hover:text-strongBeige transition-all">
              <Link href={`/livraison-gratuite`}>Livraison Gratuite</Link>
            </li>
            <li className=" cursor-pointer hover:text-strongBeige transition-all">
              <Link href={`/produits-promotions`}>Promotions</Link>
            </li>
            <li className=" cursor-pointer hover:text-strongBeige transition-all">
              <Link href={`/nous-contacter`}>Contact</Link>
            </li>
          </ul>
        </div>

        <div className="list md:hidden items-center gap-5 cursor-pointer text-xl flex">
          <ul className="flex  gap-5">
            <li className="whishlist flex items-center gap-2 cursor-pointer hover:text-strongBeige transition-all">
              <Link href={`/signin`}>
                <FiUser />
              </Link>
            </li>
            <li className="whishlist flex items-center gap-2 cursor-pointer hover:text-strongBeige transition-all">
              <Link href={`/Mes-Favoris`}>
                <FiHeart />
              </Link>
            </li>
            <li className="whishlist flex items-center gap-2 cursor-pointer hover:text-strongBeige transition-all">
              <RiShoppingCartLine onClick={openDrawerRight} />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BottomHeader;
