"use client";
import Link from "next/link";
import React, { useCallback, memo, useEffect, useState, useRef } from "react";
import { SlBasket } from "react-icons/sl";
import { useProductsInBasketStore } from "../store/zustand";
import { usePathname } from "next/navigation";
import { GoHome } from "react-icons/go";
import { useAuth } from "@/app/hooks/useAuth";
import { FaWhatsapp } from "react-icons/fa";
import { HiArrowUp } from "react-icons/hi2";
import { motion, useReducedMotion, Variants, AnimatePresence } from "framer-motion";

// Constants
const SCROLL_THRESHOLD = 400;
const SCROLL_BEHAVIOR: ScrollBehavior = 'smooth';
const VISIBILITY_DELAY = 600;

const FloatingActionButtons = () => {
  const { quantityInBasket } = useProductsInBasketStore();
  const { decodedToken, isAuthenticated } = useAuth();
  const prefersReducedMotion = useReducedMotion();

  // Performance optimization refs
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // State management
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  // Delay rendering to improve initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, VISIBILITY_DELAY);

    return () => clearTimeout(timer);
  }, []);

  // Optimized scroll handler with better performance
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = globalThis.scrollY;

      // Only update if scroll position changed significantly
      if (Math.abs(currentScrollY - lastScrollY.current) < 5) {
        ticking.current = false;
        return;
      }

      lastScrollY.current = currentScrollY;

      // Show/hide scroll to top button based on scroll position
      setShowScrollTop(currentScrollY > SCROLL_THRESHOLD);

      // Track scrolling state
      setIsScrolling(true);

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set scrolling to false after scroll ends
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);

      ticking.current = false;
    };

    // Optimized throttled scroll handler
    const throttledHandleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(handleScroll);
        ticking.current = true;
      }
    };

    globalThis.addEventListener('scroll', throttledHandleScroll, { passive: true });

    return () => {
      globalThis.removeEventListener('scroll', throttledHandleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Enhanced scroll to top handler with fallback removed for better performance
  const handleScrollToTop = useCallback(() => {


    // Smooth scroll to top
    globalThis.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : SCROLL_BEHAVIOR
    });
  }, [isAuthenticated, decodedToken, prefersReducedMotion]);

  // Simplified animation variants for better performance
  const buttonVariants: Variants = prefersReducedMotion
    ? {}
    : {
      hover: {
        scale: 1.05,
        transition: { type: "spring", stiffness: 300, damping: 30 }
      },
      tap: {
        scale: 0.95,
        transition: { duration: 0.1 }
      }
    };

  const scrollTopVariants: Variants = prefersReducedMotion
    ? {}
    : {
      hidden: {
        opacity: 0,
        scale: 0.8,
        y: 20
      },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 30,
          duration: 0.3
        }
      },
      hover: {
        scale: 1.1,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      },
      tap: {
        scale: 0.9,
        transition: { duration: 0.1 }
      }
    };

  const countVariants: Variants = prefersReducedMotion
    ? {}
    : {
      initial: { scale: 0.8, opacity: 0 },
      animate: {
        scale: 1,
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 25 }
      }
    };

  // Simplified pulse animation that's less resource intensive
  const ringVariants: Variants = prefersReducedMotion
    ? {}
    : {
      pulse: {
        scale: [1, 1.1, 1],
        opacity: [0.5, 0.8, 0.5],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    };

  if (!isVisible) return null;

  return (
    <div className="flex flex-col fixed bottom-32 lg:bottom-8 z-[1000] gap-3 right-5 md:right-6">
      {/* WhatsApp Button */}
      <motion.div
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
      >
        <Link
          href="https://wa.me/21623212892"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-button rounded-full flex items-center justify-center w-[54px] h-[54px] bg-[#25D366] shadow-lg hover:bg-[#1cb154] hover:shadow-xl transition-colors duration-200 group"
          aria-label="Contact us on WhatsApp"
        >
          <FaWhatsapp
            size={24}
            color="white"
            className="group-hover:scale-110 transition-transform duration-200"
          />
          <span className="sr-only">Contact us on WhatsApp</span>
        </Link>
      </motion.div>

      {/* Scroll to Top Button */}
      <AnimatePresence >
        {showScrollTop && (
          <motion.button
            onClick={handleScrollToTop}
            whileHover="hover"
            whileTap="tap"
            variants={scrollTopVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={`
              scroll-to-top-button rounded-full flex items-center justify-center 
              w-[54px] h-[54px] bg-gradient-to-r from-logoColor to-primaryColor/90 
              shadow-lg hover:shadow-xl transition-all duration-200 group relative
              focus:outline-none focus:ring-2 focus:ring-logoColor/50 focus:ring-offset-2
            `}
            aria-label="Scroll to top"
            title="Scroll to top"
          >
            {/* Animated ring when scrolling */}
            {isScrolling && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primaryColor/30"
                variants={ringVariants}
                animate="pulse"
              />
            )}

            <HiArrowUp
              size={22}
              color="white"
              className="group-hover:scale-110 transition-transform duration-200"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Shopping Basket Button (currently commented out) */}
      {/* {pathname === "/Basket" ? (
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
            className="rounded-full flex items-center justify-center w-[54px] h-[54px] bg-primaryColor shadow-lg hover:shadow-xl transition-all duration-300 group"
            aria-label="Go to home page"
          >
            <GoHome 
              size={22} 
              style={{ transform: "scaleX(-1)" }} 
              color="white" 
              className="group-hover:scale-110 transition-transform duration-200"
            />
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
            className="showBasket rounded-full relative flex items-center justify-center w-[54px] h-[54px] bg-primaryColor shadow-lg hover:shadow-xl transition-all duration-300 group"
            aria-label="View shopping basket"
          >
            <SlBasket 
              size={22} 
              style={{ transform: "scaleX(-1)" }} 
              color="white" 
              className="group-hover:scale-110 transition-transform duration-200"
            />
            {quantityInBasket > 0 && (
              <motion.span
                className="absolute -right-2 -top-1 bg-[#bf1212] text-white text-xs font-medium w-5 h-5 flex items-center justify-center rounded-full shadow-lg"
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
      )} */}
    </div>
  );
};

export default memo(FloatingActionButtons);