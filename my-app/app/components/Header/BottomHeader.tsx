"use client";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { FiHeart, FiUser } from "react-icons/fi";
import { HiMiniBars3CenterLeft } from "react-icons/hi2";
import { RiShoppingCartLine } from "react-icons/ri";
import {
  useDrawerBasketStore,
  useDrawerMobileStore,
  useProductsInBasketStore,
} from "../../store/zustand";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { GoPackageDependents } from "react-icons/go";
import { IoIosLogOut } from "react-icons/io";
import { IoGitCompare } from "react-icons/io5";
interface DecodedToken extends JwtPayload {
  userId: string;
}
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const BottomHeader = ({ setShowDropdown, isFixed, setIsFixed }: any) => {
  const { openCategoryDrawer } = useDrawerMobileStore();
  const { openBasketDrawer } = useDrawerBasketStore();
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [LengthComparer, setLengthComparer] = useState<number>(0);
  const quantityInBasket = useProductsInBasketStore(
    (state) => state.quantityInBasket,
  );
  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
    const comparedProductsString =
      window.sessionStorage.getItem("comparedProducts");

    if (comparedProductsString !== null) {
      const comparedProducts = JSON.parse(comparedProductsString);
      setLengthComparer(comparedProducts?.state?.products.length);
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (window.scrollY > 50) {
      setIsFixed(true);
    } else {
      setIsFixed(false);
    }
  }, [setIsFixed]);

  useEffect(() => {
    const debouncedHandleScroll = debounce(handleScroll, 100);
    window.addEventListener("scroll", debouncedHandleScroll);
    return () => {
      window.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, [handleScroll]);

  const handleLogout = () => {
    Cookies.remove("Token");
    window.sessionStorage.removeItem("productsInBasket");
    window.sessionStorage.removeItem("comparedProducts");
    window.location.reload();
  };
  return (
    <div
      className={`bg-white transition-all duration-300 ${isFixed ? "fixed top-0 w-full z-50 shadow-md px-14 py-2 md:px-20 md:py-4" : "container relative"}`}
      onMouseEnter={() => setShowDropdown(false)}
      >
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
          className="p-1 md:flex gap-3  hidden rounded-md "
          onMouseEnter={() => setShowDropdown(true)}
        >
          <HiMiniBars3CenterLeft className=" text-2xl cursor-pointer " />
          <span className="uppercase font-semibold tracking-wider">
            Nos Catégories
          </span>
        </button>

        <div className="dropDown hidden md:flex">
          <ul className="flex gap-5 ">
            <li className=" cursor-pointer hover:text-strongBeige transition-all">
              <Link rel="preload" href={`/`}>
                Accueil
              </Link>
            </li>
            <li className=" cursor-pointer hover:text-strongBeige transition-all">
              <Link rel="preload" href={`/Collections/tunisie`}>
                Touts Les Produits
              </Link>
            </li>
            <li className=" cursor-pointer hover:text-strongBeige transition-all">
              <Link
                rel="preload"
                href={`/Collections/tunisie?choice=in-discount`}
              >
                Promotions
              </Link>
            </li>
            <li className=" cursor-pointer hover:text-strongBeige transition-all">
              <Link rel="preload" href={`/nous-contacter`}>
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="list md:hidden items-center gap-5 cursor-pointer text-xl flex">
          <ul className="flex  gap-5">
            {!decodedToken?.userId && (
              <li className="whishlist flex items-center gap-2 cursor-pointer hover:text-strongBeige transition-all">
                <Link rel="preload" href={`/signin`}>
                  <FiUser />
                </Link>
              </li>
            )}
            {decodedToken?.userId && (
              <li
                onClick={handleLogout}
                className="whishlist flex items-center gap-2 cursor-pointer hover:text-strongBeige transition-all"
              >
                <Link rel="preload" href="/Home">
                  <IoIosLogOut />
                </Link>
              </li>
            )}
            <li className="whishlist flex items-center gap-2 cursor-pointer hover:text-strongBeige transition-all">
              <Link
                rel="preload"
                href={`${decodedToken?.userId ? " /FavoriteList" : "/signin"}`}
              >
                <FiHeart />
              </Link>
            </li>
            {decodedToken?.userId && (
              <li className="whishlist flex items-center gap-2 cursor-pointer hover:text-strongBeige transition-all">
                <Link rel="preload" href={`/TrackingPackages`}>
                  <GoPackageDependents />
                </Link>
              </li>
            )}
            <li className="whishlist flex relative items-center gap-2 cursor-pointer hover:text-strongBeige transition-all">
              <Link rel="preload" href={"/productComparison"}>
                <IoGitCompare />
                {LengthComparer > 0 && (
                  <span className="absolute rounded-full py-1 px-1 text-xs font-medium  leading-none grid place-items-center top-4  translate-x-2/4 -translate-y-2/4 bg-strongBeige text-white min-w-[20px] min-h-[20px]">
                    {LengthComparer}
                  </span>
                )}
              </Link>
            </li>
            <li
              onClick={openBasketDrawer}
              className="whishlist flex relative items-center gap-2 cursor-pointer hover:text-strongBeige transition-all"
            >
              <RiShoppingCartLine />
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
