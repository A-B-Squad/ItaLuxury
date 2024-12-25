"use client";
import Link from "next/link";
import React from "react";
import { SlBasket } from "react-icons/sl";
import { useProductsInBasketStore } from "../store/zustand";
import { usePathname } from "next/navigation";
import { GoHome } from "react-icons/go";
import { sendGTMEvent } from "@next/third-parties/google";
import { useAuth } from "@/lib/auth/useAuth";

const WhatsAndBasketPopUp = () => {
  const { quantityInBasket } = useProductsInBasketStore();
  const pathname = usePathname();
  const { decodedToken, isAuthenticated } = useAuth();

  const handleBasketClick = () => {
    sendGTMEvent({
      event: "view_cart",
      page_location: window.location.href,
      user_data: isAuthenticated ? {
        country: ["tn"],
        external_id: decodedToken?.userId
      } : undefined,
      facebook_data: {
        content_name: "Cart View",
        content_type: "cart",
        currency: "TND",
        num_items: quantityInBasket
      }
    });
  };

  const handleHomeClick = () => {
    sendGTMEvent({
      event: "home_view",
      page_location: window.location.href,
      user_data: isAuthenticated ? {
        country: ["tn"],
        external_id: decodedToken?.userId
      } : undefined
    });
  };


  return (
    <div className="flex flex-col fixed bottom-[170px] md:bottom-24 z-[100] gap-2 right-[18px] md:right-[22px]">
      {pathname === "/Basket" ? (
        <Link
          href="/"
          onClick={handleHomeClick}
          className="rounded-full flex items-center justify-center p-2 w-[60px] h-[60px] bg-primaryColor shadow-xl "
        >
          <GoHome size={25} style={{ transform: "scaleX(-1)" }} color="white" />

        </Link>
      ) : (
        <Link
          href="/Basket"
          onClick={handleBasketClick}
          className="showBasket rounded-full relative flex items-center justify-center p-2 w-[60px] h-[60px] bg-primaryColor shadow-xl "
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
