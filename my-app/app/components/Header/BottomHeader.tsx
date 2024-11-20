"use client";
import {
  useDrawerBasketStore,
  useDrawerMobileStore,
  useProductsInBasketStore,
} from "@/app/store/zustand";
import { useToast } from "@/components/ui/use-toast";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { FiUser } from "react-icons/fi";
import { HiMiniBars3CenterLeft } from "react-icons/hi2";
import { IoIosLogOut } from "react-icons/io";
import { RiShoppingCartLine } from "react-icons/ri";
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
  const { toast } = useToast();
  const router = useRouter();

  const { openCategoryDrawer } = useDrawerMobileStore();
  const { openBasketDrawer } = useDrawerBasketStore();
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const quantityInBasket = useProductsInBasketStore(
    (state) => state.quantityInBasket,
  );
  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
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

  const handleLogout = async () => {
    try {
      // Supprimer le token
      Cookies.remove("Token", { domain: ".ita-luxury.com", path: "/" });

      // Nettoyer le sessionStorage
      window.sessionStorage.removeItem("products-in-basket");
      window.sessionStorage.removeItem("comparedProducts");

      // Rediriger vers la page d'accueil
      await router.push("https://www.ita-luxury.com");

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
  return (
    <div
      className={` transition-all duration-300 ${isFixed ? "fixed top-0 w-full bg-[#fffffff2] z-30 shadow-md px-14 py-2 md:px-20 md:py-4" : "container relative sm:mt-4 mt-0 bg-white"}`}
      onMouseEnter={() => setShowDropdown(false)}
    >
      <div
        className="BottomHeader  flex justify-between items-center py-3 "
        onMouseEnter={() => setShowDropdown(false)}
      >
        <button
          type="button"
          className="p-1 xl:hidden block  rounded-sm"
          onClick={openCategoryDrawer}
        >
          <HiMiniBars3CenterLeft className=" text-2xl cursor-pointer " />
        </button>

        <button
          type="button"
          className="p-1 xl:flex gap-3  hidden rounded-md "
          onMouseEnter={() => setShowDropdown(true)}
        >
          <HiMiniBars3CenterLeft className=" text-2xl cursor-pointer " />
          <span className="uppercase font-semibold tracking-wider">
            Nos Catégories
          </span>
        </button>

        <div className="dropDown hidden md:flex">
          <ul className="flex gap-5 ">
            <li className=" cursor-pointer hover:text-primaryColor transition-all">
              <Link rel="preload" href={`/`}>
                Accueil
              </Link>
            </li>
            <li className=" cursor-pointer hover:text-primaryColor transition-all">
              <Link
                rel="preload"
                href={
                  `/Collections/tunisie?page=1`}

              >
                Boutique
              </Link>
            </li>
            <li className=" cursor-pointer hover:text-primaryColor transition-all">
              <Link
                rel="preload"
                href={{
                  pathname: `/Collections/tunisie`,
                  query: {
                    choice: "in-discount",

                  },
                }}
              >
                Promotions
              </Link>
            </li>
            <li className=" cursor-pointer hover:text-primaryColor transition-all">
              <Link rel="preload" href={`/Contact-us`}>
                Contact
              </Link>
            </li>
            <li
              onClick={openBasketDrawer}
              title="Votre Panier"
              className={`${isFixed ? "visible" : "invisible"} whishlist   gap-2 cursor-pointer hover:text-primaryColor transition-all`}
            >
              <div className="relative inline-flex">
                <RiShoppingCartLine className="text-xl" />
                {quantityInBasket > 0 && (
                  <span className="absolute rounded-full py-1 px-1 text-xs font-medium content-[''] leading-none grid place-items-center top-[4%] right-[2%] translate-x-2/4 -translate-y-2/4 bg-primaryColor text-white min-w-[20px] min-h-[20px]">
                    {quantityInBasket}
                  </span>
                )}
              </div>
            </li>
          </ul>
        </div>

        <div className="list md:hidden items-center gap-5 cursor-pointer text-xl flex">
          <ul className="flex  gap-5">
            {!decodedToken?.userId && (
              <li className="whishlist flex items-center gap-2 cursor-pointer hover:text-primaryColor transition-all">
                <Link rel="preload" href={`/signin`}>
                  <FiUser />
                </Link>
              </li>
            )}
            {decodedToken?.userId && (
              <li
                onClick={handleLogout}
                className="whishlist flex items-center gap-2 cursor-pointer hover:text-primaryColor transition-all"
              >
                <Link rel="preload" href="/Home">
                  <IoIosLogOut />
                </Link>
              </li>
            )}

            <li
              onClick={openBasketDrawer}
              className="whishlist flex relative items-center gap-2 cursor-pointer hover:text-primaryColor transition-all"
            >
              <RiShoppingCartLine />
              {quantityInBasket >= 0 && (
                <span className="absolute rounded-full py-1 px-1 text-xs font-medium  leading-none grid place-items-center top-4  translate-x-2/4 -translate-y-2/4 bg-primaryColor text-white min-w-[20px] min-h-[20px]">
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
