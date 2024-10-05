"use client";
import Link from "next/link";
import React, { useCallback } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { SlBasket } from "react-icons/sl";
import { useProductsInBasketStore } from "../store/zustand";

const WhatsAndBasketPopUp = () => {
  const { quantityInBasket } = useProductsInBasketStore();

  return (
    <div className=" flex flex-col fixed bottom-20  md:bottom-10 z-[111111] gap-2 right-4">
      <Link
        href={"/Basket"}
        className={`rounded-full  relative    flex items-center before:rounded-full justify-center p-2 w-12 md:w-14 h-12 md:h-14   border  border-white bg-primaryColor shadow-xl z-[111111111] shadow-primaryColor`}
      >
        <SlBasket size={25} style={{ transform: "scaleX(-1)" }} color="white" />
        {quantityInBasket > 0 && (
          <span className="absolute -right-2 -top-1 bg-red-400 text-white text-sm font-semibold w-6 h-6 flex items-center justify-center rounded-full">
            {quantityInBasket}
          </span>
        )}
      </Link>
      <Link
        href={
          "https://api.whatsapp.com/send/?phone=95202202&text&type=phone_number&app_absent=0"
        }
        target="_blank"
        className=" animate-pulse rounded-full   hover:opacity-75 transition-opacity  flex items-center justify-center p-2 w-12 md:w-14 h-12 md:h-14  border  border-white bg-green-400 shadow-xl z-[111111111] shadow-primaryColor"
      >
        <FaWhatsapp
          size={30}
          style={{ transform: "scaleX(-1)" }}
          color="white"
        />
      </Link>
    </div>
  );
};

export default WhatsAndBasketPopUp;
