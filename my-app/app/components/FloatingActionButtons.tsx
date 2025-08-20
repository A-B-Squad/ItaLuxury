"use client";
import Link from "next/link";
import React, { useCallback, memo, useEffect, useState } from "react";
import { SlBasket } from "react-icons/sl";
import { useProductsInBasketStore } from "../store/zustand";
import { usePathname } from "next/navigation";
import { GoHome } from "react-icons/go";
import { sendGTMEvent } from "@next/third-parties/google";
import { useAuth } from "@/app/hooks/useAuth";
import { FaWhatsapp } from "react-icons/fa";
import { motion, useReducedMotion, Variants } from "framer-motion";

const FloatingActionButtons = () => {
  const { quantityInBasket } = useProductsInBasketStore();
  const pathname = usePathname();
  const { decodedToken, isAuthenticated } = useAuth();
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  // Delay rendering to improve initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

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

  // Other handlers remain the same
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

  // Fixed type definition for variants
  const buttonVariants: Variants = prefersReducedMotion
    ? {}
    : {
      hover: { scale: 1.05 },
      tap: { scale: 0.95 }
    };

  const countVariants: Variants = prefersReducedMotion
    ? {}
    : {
      initial: { scale: 0.8, opacity: 0 },
      animate: {
        scale: 1,
        opacity: 1,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }
    };

  if (!isVisible) return null;

  return (
    <div className="flex flex-col fixed bottom-20 lg:bottom-8 z-[1000] gap-3 right-5 md:right-6">
      {pathname === "/Basket" ? (
        <motion.div
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
          initial={prefersReducedMotion ? {} : { opacity: 0.8 }}
          animate={prefersReducedMotion ? {} : { opacity: 1 }}
          transition={{ duration: 0.2 }}
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
          initial={prefersReducedMotion ? {} : { opacity: 0.8 }}
          animate={prefersReducedMotion ? {} : { opacity: 1 }}
          transition={{ duration: 0.2 }}
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
                layoutId="basketCount"
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
        initial={prefersReducedMotion ? {} : { opacity: 0.8 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.2 }}
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
    </div>
  );
};

export default memo(FloatingActionButtons);
