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
} from "@/app/store/zustand";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { GoPackageDependents } from "react-icons/go";
import { IoIosLogOut } from "react-icons/io";
import { IoGitCompare } from "react-icons/io5";
import { GrContact } from "react-icons/gr";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
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
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt sur ita-luxury",
      className: "bg-primaryColor text-white",
    });
    Cookies.remove("Token");
    window.sessionStorage.removeItem("productsInBasket");
    window.sessionStorage.removeItem("comparedProducts");
    router.push("/");
    window.location.reload();
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
                href={{
                  pathname: `/Collections/tunisie`,
                  query: {
                    page: "1",
                    section: "Boutique",
                  },
                }}
              >
                Boutique
              </Link>
            </li>
            <li className=" cursor-pointer hover:text-primaryColor transition-all">
              <Link
                rel="preload"
                href={{
                  pathname: `/Collections/tunisie/?choice=in-discount&page=1`,

                  query: {
                    section: "Promotions",
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
            <li className="whishlist flex items-center gap-2 cursor-pointer hover:text-primaryColor transition-all">
              <Link
                rel="preload"
                href={`${decodedToken?.userId ? " /FavoriteList" : "/signin"}`}
              >
                <FiHeart />
              </Link>
            </li>
            {decodedToken?.userId && (
              <li className="whishlist flex items-center gap-2 cursor-pointer hover:text-primaryColor transition-all">
                <Link rel="preload" href={`/TrackingPackages`}>
                  <GoPackageDependents />
                </Link>
              </li>
            )}
            <li className="whishlist flex relative items-center gap-2 cursor-pointer hover:text-primaryColor transition-all">
              <Link rel="preload" href={"/productComparison"}>
                <IoGitCompare />
                {LengthComparer > 0 && (
                  <span className="absolute rounded-full py-1 px-1 text-xs font-medium  leading-none grid place-items-center top-4  translate-x-2/4 -translate-y-2/4 bg-primaryColor text-white min-w-[20px] min-h-[20px]">
                    {LengthComparer}
                  </span>
                )}
              </Link>
            </li>
            <li
              onClick={openBasketDrawer}
              className="whishlist flex relative items-center gap-2 cursor-pointer hover:text-primaryColor transition-all"
            >
              <RiShoppingCartLine />
              {quantityInBasket > 0 && (
                <span className="absolute rounded-full py-1 px-1 text-xs font-medium  leading-none grid place-items-center top-4  translate-x-2/4 -translate-y-2/4 bg-primaryColor text-white min-w-[20px] min-h-[20px]">
                  {quantityInBasket}
                </span>
              )}
            </li>
            <li className="whishlist flex relative items-center gap-2 cursor-pointer hover:text-primaryColor transition-all">
              <Link rel="preload" href={"/Contact-us"}>
                <GrContact />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BottomHeader;
