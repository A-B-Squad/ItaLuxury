"use client";
import Link from "next/link";
import React from "react";
import { FiHeart, FiUser } from "react-icons/fi";
import { HiMiniBars3CenterLeft } from "react-icons/hi2";
import { RiShoppingCartLine } from "react-icons/ri";
import {
  useDrawerBasketStore,
  useDrawerMobileStore,
  useProductsInBasketStore,
} from "../../store/zustand";

const BottomHeader = ({ setShowDropdown }) => {
  const { openCategoryDrawer } = useDrawerMobileStore();
  const { openBasketDrawer } = useDrawerBasketStore();
  const quantityInBasket = useProductsInBasketStore(
    (state) => state.quantityInBasket
  );
  return (
    <div className="container relative">
      <div
        className="BottomHeader  flex justify-between items-center py-3 "
        onMouseEnter={() => setShowDropdown(false)}
      >
        <button
          className="p-1 md:hidden block  rounded-md border-2"
          onClick={openCategoryDrawer}
        >
          <HiMiniBars3CenterLeft className=" text-2xl cursor-pointer " />
        </button>

        <button
          className="p-1 md:block hidden rounded-md border-2"
          onMouseEnter={() => setShowDropdown(true)}
        >
          <HiMiniBars3CenterLeft className=" text-2xl cursor-pointer " />
        </button>

        <div className="dropDown hidden md:flex">
          <ul className="flex gap-5 ">
            <li className=" cursor-pointer hover:text-strongBeige transition-all">
              <Link href={`/`}>Accueil</Link>
            </li>
            <li className=" cursor-pointer hover:text-strongBeige transition-all">
              <Link href={`/livraison-gratuite`}>Livraison Gratuite</Link>
            </li>
            <li className=" cursor-pointer hover:text-strongBeige transition-all">
              <Link href={`/Collections`}>Touts Les Produits</Link>
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
            <li className="whishlist flex relative items-center gap-2 cursor-pointer hover:text-strongBeige transition-all">
              <RiShoppingCartLine onClick={openBasketDrawer} />
              {quantityInBasket > 0 && (
                <span className="absolute rounded-full py-1 px-1 text-xs font-medium  leading-none grid place-items-center top-4  translate-x-2/4 -translate-y-2/4 bg-strongBeige text-white min-w-[20px] min-h-[20px]">
                  {quantityInBasket}
                </span>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BottomHeader;
