"use client";
import Link from "next/link";
import React from "react";
import { SlBasket } from "react-icons/sl";
import { useProductsInBasketStore } from "../store/zustand";
import { usePathname } from "next/navigation";
import { GoHome } from "react-icons/go";

const WhatsAndBasketPopUp = () => {
  const { quantityInBasket } = useProductsInBasketStore();
  const pathname = usePathname();

  return (
    <div className="flex flex-col fixed bottom-[170px] md:bottom-24 z-[100] gap-2 right-[18px] md:right-[22px]">
      {pathname === "/Basket" ? (
        <Link
          href="/"
          className="rounded-full flex items-center justify-center p-2 w-[60px] h-[60px] bg-[#183a84] shadow-xl "
        >
          <GoHome size={25} style={{ transform: "scaleX(-1)" }} color="white" />

        </Link>
      ) : (
        <Link
          href="/Basket"
          className="rounded-full relative flex items-center justify-center p-2 w-[60px] h-[60px] bg-[#183a84] shadow-xl "
        >
          <SlBasket size={25} style={{ transform: "scaleX(-1)" }} color="white" />
          {quantityInBasket >= 0 && (
            <span className="absolute -right-2 -top-1 bg-[#bf1212] text-white text-sm font-semibold w-6 h-6 flex items-center justify-center rounded-full">
              {quantityInBasket}
            </span>
          )}
        </Link>
      )}
    </div>
  );
};

export default WhatsAndBasketPopUp;
