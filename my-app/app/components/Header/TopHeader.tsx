"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FiHeart, FiUser } from "react-icons/fi";
import { RiShoppingCartLine } from "react-icons/ri";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  useDrawerBasketStore,
  useProductsInBasketStore,
} from "../../store/zustand";
import { IoGitCompare } from "react-icons/io5";
interface DecodedToken extends JwtPayload {
  userId: string;
}
const TopHeader = () => {
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [showLogout, setShowLogout] = useState<Boolean>(false);
  const [LengthComparer, setLengthComparer] = useState<String>("");
  const { openBasketDrawer } = useDrawerBasketStore();
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
    <div className="container flex  md:flex-row flex-col gap-3 justify-between items-center border-b-2 py-3">
      <div className="logo ">
        {/* <Image src="/logo2.png" alt="logo" width={180} height={30} priority /> */}
        <h3 className="text-strongBeige text-3xl">MaisonNg</h3>
      </div>
      <div className="search flex items-center border-2 px-4 w-full relative  max-w-md h-11 border-mediumBeige rounded-lg pl-4">
        <input
          className="h-full  w-full outline-none"
          type="text"
          placeholder="Rechercher..."
        />
        <span className="flex items-center right-0 absolute justify-center cursor-pointer  h-full w-10 bg-mediumBeige">
          <CiSearch className=" size-7 text-white " />
        </span>
      </div>
      <div className="list md:flex items-center gap-5 cursor-pointer text-md hidden">
        <ul className="flex  gap-5">
          <li
            className="whishlist relative group "
            onMouseEnter={() => setShowLogout(true)}
          >
            <div className="flex  items-center gap-2 cursor-pointer hover:text-strongBeige transition-all">
              Compte
              <FiUser />
            </div>
            <div
              className={` absolute w-60 border-2 text-base   bg-white flex  justify-center items-center flex-col text-center tracking-wider transition-all  ${showLogout ? "translate-y-5 visible" : "invisible translate-y-36"}border-2    bg-white  -translate-x-5 z-50`}
              onMouseLeave={() => setShowLogout(false)}
            >
              {!decodedToken?.userId && (
                <Link
                  className="w-full py-2 border-b gap-2 hover:bg-mediumBeige flex justify-center items-center hover:text-white transition-colors"
                  href={"/signin"}
                >
                  <FiUser />
                  Connexion
                </Link>
              )}
              {decodedToken?.userId && (
                <Link
                  onClick={() => {
                    if (decodedToken?.userId) {
                      Cookies.remove("Token");
                      window.sessionStorage.removeItem("productsInBasket");
                      window.sessionStorage.removeItem("comparedProducts");
                    }
                  }}
                  className="w-full py-2 border-b gap-2 hover:bg-mediumBeige flex justify-center items-center hover:text-white transition-colors"
                  href={"/Home"}
                >
                  <FiUser />
                  Déconnexion
                </Link>
              )}

              <Link
                href={decodedToken?.userId ? `/Mes-Favoris` : ""}
                onClick={() => {
                  if (!decodedToken || !decodedToken.userId) {
                    alert("Veuillez vous connecter pour voir vos favoris.");
                  }
                }}
                className="w-full border-b py-2 gap-2 text-center hover:bg-mediumBeige flex justify-center items-center hover:text-white transition-colors"
              >
                <FiHeart />
                <p>Mes Favoris</p>
              </Link>

              <Link
                href={`/productComparison`}
                className=" w-full py-2 gap-2 hover:bg-mediumBeige flex justify-center items-center hover:text-white transition-colors"
              >
                <IoGitCompare />
                <p>Comparer ({LengthComparer})</p>
              </Link>
            </div>
          </li>
          <li
            onClick={openBasketDrawer}
            title="Votre Panier"
            className="whishlist flex items-center gap-2 cursor-pointer hover:text-strongBeige transition-all"
          >
            <p>Panier</p>
            <div className="relative inline-flex">
              <RiShoppingCartLine className="text-xl" />
              {quantityInBasket > 0 && (
                <span className="absolute rounded-full py-1 px-1 text-xs font-medium content-[''] leading-none grid place-items-center top-[4%] right-[2%] translate-x-2/4 -translate-y-2/4 bg-strongBeige text-white min-w-[20px] min-h-[20px]">
                  {quantityInBasket}
                </span>
              )}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TopHeader;
