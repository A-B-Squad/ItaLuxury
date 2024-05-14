"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
interface DecodedToken extends JwtPayload {
  userId: string;
}
const BottomHeader = ({ setShowDropdown }: any) => {
  const { openCategoryDrawer } = useDrawerMobileStore();
  const { openBasketDrawer } = useDrawerBasketStore();
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [LengthComparer, setLengthComparer] = useState<number>(0);
const router=useRouter()
  const quantityInBasket = useProductsInBasketStore(
    (state) => state.quantityInBasket
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
              <Link href={`/Collections/tunisie`}>Touts Les Produits</Link>
            </li>
            <li className=" cursor-pointer hover:text-strongBeige transition-all">
              <Link href={`/Collections/tunisie?choice=in-discount`}>
                Promotions
              </Link>
            </li>
            <li className=" cursor-pointer hover:text-strongBeige transition-all">
              <Link href={`/nous-contacter`}>Contact</Link>
            </li>
          </ul>
        </div>

        <div className="list md:hidden items-center gap-5 cursor-pointer text-xl flex">
          <ul className="flex  gap-5">
            {!decodedToken?.userId && (
              <li className="whishlist flex items-center gap-2 cursor-pointer hover:text-strongBeige transition-all">
                <Link href={`/signin`}>
                  <FiUser />
                </Link>
              </li>
            )}
            {decodedToken?.userId && (
              <li
                onClick={() => {
                  if (decodedToken?.userId) {
                    Cookies.remove("Token");
                    window.sessionStorage.removeItem("productsInBasket");
                    window.sessionStorage.removeItem("comparedProducts");
                   router.refresh()
                  }
                }}
                className="whishlist flex items-center gap-2 cursor-pointer hover:text-strongBeige transition-all"
              >
                <Link href="/Home">
                  <IoIosLogOut />
                </Link>
              </li>
            )}
            <li className="whishlist flex items-center gap-2 cursor-pointer hover:text-strongBeige transition-all">
              <Link href={`/Mes-Favoris`}>
                <FiHeart />
              </Link>
            </li>
            {decodedToken?.userId && (
              <li className="whishlist flex items-center gap-2 cursor-pointer hover:text-strongBeige transition-all">
                <Link href={`/TrackingPackages`}>
                  <GoPackageDependents />
                </Link>
              </li>
            )}
            <li className="whishlist flex relative items-center gap-2 cursor-pointer hover:text-strongBeige transition-all">
              <IoGitCompare />
              {LengthComparer > 0 && (
                <span className="absolute rounded-full py-1 px-1 text-xs font-medium  leading-none grid place-items-center top-4  translate-x-2/4 -translate-y-2/4 bg-strongBeige text-white min-w-[20px] min-h-[20px]">
                  {LengthComparer}
                </span>
              )}
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
