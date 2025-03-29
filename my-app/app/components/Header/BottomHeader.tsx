"use client";
import {
  useDrawerBasketStore,
  useDrawerMobileStore,
  useProductsInBasketStore,
} from "@/app/store/zustand";
import { useToast } from "@/components/ui/use-toast";
import { removeToken } from "@/lib/auth/token";
import { useAuth } from "@/lib/auth/useAuth";
import { sendGTMEvent } from "@next/third-parties/google";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FiUser, FiHeart, FiSearch } from "react-icons/fi";
import { HiMiniBars3CenterLeft } from "react-icons/hi2";
import { IoIosLogOut } from "react-icons/io";
import { IoBagHandleOutline } from "react-icons/io5";
import { motion } from "framer-motion";

function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const BottomHeader = ({ setShowDropdown, isFixed, setIsFixed }: any) => {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState("");

  const { openCategoryDrawer } = useDrawerMobileStore();
  const { openBasketDrawer } = useDrawerBasketStore();
  const { quantityInBasket } = useProductsInBasketStore();
  const { decodedToken, isAuthenticated } = useAuth();

  // Update active link whenever the pathname changes
  useEffect(() => {
    if (pathname && pathname === "/") setActiveLink("home");
    else if (pathname && pathname.includes("/Collections")) {
      // Check if it's the promotions page
      const searchParams = new URLSearchParams(window.location.search);
      const choice = searchParams.get("choice");

      if (choice === "in-discount") {
        setActiveLink("promo");
      } else {
        setActiveLink("shop");
      }
    }
    else if (pathname && pathname.includes("/Contact-us")) setActiveLink("contact");
    else setActiveLink("");
  }, [pathname]);

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

  const handleLogout = async () => {
    try {
      // Supprimer le token
      removeToken()
      // Nettoyer le sessionStorage
      window.sessionStorage.removeItem("products-in-basket");
      window.sessionStorage.removeItem("comparedProducts");

      // Rediriger vers la page d'accueil
      await router.push("/");

      // Afficher le toast de confirmation
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt sur ita-luxury",
        className: "bg-primaryColor text-white",
      });

      // Recharger la page après un court délai
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast({
        title: "Erreur de déconnexion",
        description: "Veuillez réessayer plus tard",
        variant: "destructive",
      });
    }
  };

  // Add tracking function for navigation
  const handleNavigation = (pageName: string, linkId: string) => {
    setActiveLink(linkId);
    sendGTMEvent({
      event: "page_view",
      page_title: pageName,
      page_location: window.location.href,
      user_data: isAuthenticated
        ? {
          country: ["tn"],
          external_id: decodedToken?.userId,
        }
        : undefined,
      facebook_data: {
        content_name: pageName,
        content_type: "page",
      },
    });
  };

  return (
    <div
      className={`transition-all duration-300 w-full ${isFixed
        ? "bg-white z-50"
        : "bg-white"
        }`}
      onMouseEnter={() => setShowDropdown(false)}
    >
      <div
        className="flex justify-between items-center py-2"
        onMouseEnter={() => setShowDropdown(false)}
      >
        <motion.button
          type="button"
          className="p-2 xl:hidden flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
          onClick={openCategoryDrawer}
          whileTap={{ scale: 0.95 }}
        >
          <HiMiniBars3CenterLeft className="text-2xl" />
        </motion.button>

        <motion.button
          type="button"
          className="px-4 py-2.5 xl:flex hidden items-center gap-2.5 rounded-md hover:bg-gray-50 transition-all duration-300 border border-transparent hover:border-gray-200 group"
          onMouseEnter={() => setShowDropdown(true)}
          whileHover={{ backgroundColor: "rgba(0,0,0,0.03)" }}
        >
          <div className="relative w-5 h-5 flex flex-col justify-center gap-[5px]">
            <span className="w-5 h-[1.5px] bg-gray-700 group-hover:bg-primaryColor transition-all"></span>
            <span className="w-3.5 h-[1.5px] bg-gray-700 group-hover:bg-primaryColor transition-all"></span>
            <span className="w-4 h-[1.5px] bg-gray-700 group-hover:bg-primaryColor transition-all"></span>
          </div>
          <span className="font-medium tracking-wide text-sm group-hover:text-primaryColor transition-colors">
            Nos Catégories
          </span>
        </motion.button>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-6">
            <li>
              <Link
                href="/"
                onClick={() => handleNavigation("Accueil", "home")}
                className={`relative py-2 px-1 font-medium transition-colors ${activeLink === "home" ? "text-primaryColor" : "text-gray-700 hover:text-primaryColor"
                  }`}
              >
                Accueil
                {activeLink === "home" && (
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-primaryColor"
                    layoutId="underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            </li>
            <li>
              <Link
                href="/Collections/tunisie?page=1"
                onClick={() => handleNavigation("Boutique", "shop")}
                className={`relative py-2 px-1 font-medium transition-colors ${activeLink === "shop" ? "text-primaryColor" : "text-gray-700 hover:text-primaryColor"
                  }`}
              >
                Boutique
                {activeLink === "shop" && (
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-primaryColor"
                    layoutId="underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            </li>
            <li>
              <Link
                href={{
                  pathname: `/Collections/tunisie`,
                  query: { choice: "in-discount" },
                }}
                onClick={() => handleNavigation("Promotions", "promo")}
                className={`relative py-2 px-1 font-medium transition-colors ${activeLink === "promo" ? "text-primaryColor" : "text-gray-700 hover:text-primaryColor"
                  }`}
              >
                Promotions
                {activeLink === "promo" && (
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-primaryColor"
                    layoutId="underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            </li>
            <li>
              <Link
                href="/Contact-us"
                onClick={() => handleNavigation("Contact", "contact")}
                className={`relative py-2 px-1 font-medium transition-colors ${activeLink === "contact" ? "text-primaryColor" : "text-gray-700 hover:text-primaryColor"
                  }`}
              >
                Contact
                {activeLink === "contact" && (
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-primaryColor"
                    layoutId="underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-4">


          <motion.button
            onClick={openBasketDrawer}
            className="relative p-2 rounded-full md:hidden hover:bg-gray-100 transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <IoBagHandleOutline className="text-xl" />
            {quantityInBasket > 0 && (
              <motion.span
                className="absolute -top-1 -right-1 bg-primaryColor text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                {quantityInBasket}
              </motion.span>
            )}
          </motion.button>

          <div className="md:hidden flex items-center">
            {!isAuthenticated ? (
              <Link href="/signin">
                <motion.button
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <FiUser className="text-xl" />
                </motion.button>
              </Link>
            ) : (
              <motion.button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <IoIosLogOut className="text-xl" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomHeader;
