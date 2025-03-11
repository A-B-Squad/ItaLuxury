"use client";
import Link from "next/link";
import React, { useCallback, memo } from "react";
import { SlBasket } from "react-icons/sl";
import { useProductsInBasketStore } from "../store/zustand";
import { usePathname } from "next/navigation";
import { GoHome } from "react-icons/go";
import { sendGTMEvent } from "@next/third-parties/google";
import { useAuth } from "@/lib/auth/useAuth";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

const WhatsAndBasketPopUp = () => {
  const { quantityInBasket } = useProductsInBasketStore();
  const pathname = usePathname();
  const { decodedToken, isAuthenticated } = useAuth();

  const handleBasketClick = useCallback(() => {
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
  }, [isAuthenticated, decodedToken, quantityInBasket]);

  const handleHomeClick = useCallback(() => {
    sendGTMEvent({
      event: "home_view",
      page_location: window.location.href,
      user_data: isAuthenticated ? {
        country: ["tn"],
        external_id: decodedToken?.userId
      } : undefined
    });
  }, [isAuthenticated, decodedToken]);

  const handleWhatsAppClick = useCallback(() => {
    sendGTMEvent({
      event: "whatsapp_click",
      page_location: window.location.href,
      user_data: isAuthenticated ? {
        country: ["tn"],
        external_id: decodedToken?.userId
      } : undefined
    });
  }, [isAuthenticated, decodedToken]);

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" },
    tap: { scale: 0.95 }
  };

  const countVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 500, damping: 30 } }
  };

  return (
    <motion.div 
      className="flex flex-col fixed bottom-20 lg:bottom-8 z-[1000] gap-3 right-5 md:right-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      {pathname === "/Basket" ? (
        <motion.div
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
        >
          <Link
            href="/"
            onClick={handleHomeClick}
            className="rounded-full flex items-center justify-center w-[54px] h-[54px] bg-primaryColor shadow-lg"
            aria-label="Go to home page"
          >
            <GoHome size={22} style={{ transform: "scaleX(-1)" }} color="white" />
          </Link>
        </motion.div>
      ) : (
        <motion.div
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
        >
          <Link
            href="/Basket"
            onClick={handleBasketClick}
            className="showBasket rounded-full relative flex items-center justify-center w-[54px] h-[54px] bg-primaryColor shadow-lg"
            aria-label="View shopping basket"
          >
            <SlBasket size={22} style={{ transform: "scaleX(-1)" }} color="white" />
            {quantityInBasket > 0 && (
              <motion.span 
                className="absolute -right-2 -top-1 bg-[#bf1212] text-white text-xs font-medium w-5 h-5 flex items-center justify-center rounded-full"
                variants={countVariants}
                initial="initial"
                animate="animate"
                key={quantityInBasket}
              >
                {quantityInBasket}
              </motion.span>
            )}
          </Link>
        </motion.div>
      )}
      
      <motion.div
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
      >
        <Link
          href="https://wa.me/21623212892"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          className="whatsapp-button rounded-full flex items-center justify-center w-[54px] h-[54px] bg-[#25D366] shadow-lg hover:bg-[#1cb154] transition-all duration-300"
          aria-label="Contact us on WhatsApp"
        >
          <FaWhatsapp size={24} color="white" />
          <span className="sr-only">Contact us on WhatsApp</span>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default memo(WhatsAndBasketPopUp);
