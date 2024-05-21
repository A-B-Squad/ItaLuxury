"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { FiHeart, FiUser } from "react-icons/fi";
import { RiShoppingCartLine } from "react-icons/ri";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";

import {
  useDrawerBasketStore,
  useProductsInBasketStore,
} from "../../store/zustand";
import { IoGitCompare } from "react-icons/io5";
import Image from "next/legacy/image";
import { GoPackageDependents } from "react-icons/go";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { SIGNIN_MUTATION } from "@/graphql/mutations";
import { useToast } from "@/components/ui/use-toast";
import { useOutsideClick } from "../Helpers/_outsideClick";
interface DecodedToken extends JwtPayload {
  userId: string;
}
const TopHeader = ({ logo }: { logo: string }) => {
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [showLogout, setShowMenuUserMenu] = useState<Boolean>(false);
  const [LengthComparer, setLengthComparer] = useState<String>("");
  const { openBasketDrawer } = useDrawerBasketStore();
  const quantityInBasket = useProductsInBasketStore(
    (state) => state.quantityInBasket,
  );
  const clickOutside = useOutsideClick(() => {
    setShowMenuUserMenu(false);
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { toast } = useToast();

  const [SignIn, { loading }] = useMutation(SIGNIN_MUTATION, {
    onCompleted: () => {
      window.location.reload();

      toast({
        title: "Connexion",
        description: "Bienvenue",
        className: "bg-strongBeige text-white",
      });
    },
    onError: (error) => {
      if (error) {
        toast({
          title: "Connexion",
          description: "Invalid email or password",
          className: "bg-red-800 text-white",
        });
      }
    },
  });
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
  const onSubmit = (data: any) => {
    SignIn({ variables: { input: data } });
  };
  return (
    <div
      className="container flex  md:flex-row flex-col gap-3 justify-between items-center border-b-2 "
      onMouseEnter={() => setShowMenuUserMenu(false)}
    >
      <div className="logo relative w-48 h-24 content-center  ">
        <Link href={"/Home"} >
          <Image
            src={logo}
            width={192}
            height={96}
            alt="logo"
            property="true"
            layout="responsive"
            objectFit="contain"
          />
        </Link>
      </div>
      <SearchBar />
      <div className="list md:flex items-center gap-5 relative cursor-pointer text-md hidden">
        <ul className="flex  gap-5">
          <li
            className="userMenu  group  "
            onMouseEnter={() => setShowMenuUserMenu(true)}
          >
            <div className="flex   items-center gap-2 cursor-pointer hover:text-strongBeige transition-all">
              Votre Compte
              <FiUser />
            </div>
            <div
              ref={clickOutside}
              className={` absolute w-72 h-96 border-2  px-2 py-2    flex  justify-start items-start flex-col  tracking-wider transition-all  ${showLogout ? "translate-y-9 visible" : "invisible translate-y-32"}border-2    bg-white  right-0 z-50`}
            >
              {!decodedToken?.userId && (
                <form
                  className="flex flex-col w-full"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <label htmlFor="email" className="text-xs font-medium mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="text"
                    className="block border outline-gray-400 border-gray-300 py-2.5  text-xs w-full p-1 rounded mb-4"
                    title="Email"
                    {...register("email", { required: "Email is required" })}
                  />

                  <label
                    htmlFor="password"
                    className="text-xs font-medium mb-1"
                  >
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    type="password"
                    title="Mot de passe"
                    className="block border border-gray-300 py-2.5 outline-gray-400   text-xs w-full p-1 rounded mb-4"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full text-center py-1 px-5 text-sm font-semibold  rounded-full bg-strongBeige text-white hover:bg-mediumBeige focus:outline-none my-1 transition-all"
                  >
                    {loading ? "Chargement..." : "CONNEXION"}
                  </button>
                </form>
              )}
              {!decodedToken?.userId && (
                <Link
                  rel="preload"
                  href={"/signup"}
                  className="w-full py-2 px-1 text-xs border-b  bg-gray-100 hover:text-strongBeige flex justify-between items-center  transition-colors"
                >
                  <FiUser />
                 <p>
                   NOUVEAU CLIENT?
                  </p>
                  <span className="font-semibold">COMMENCER ICI</span>
                </Link>
              )}
              {!decodedToken?.userId && (
                <Link
                  rel="preload"
                  className="w-full py-2  text-sm border-b gap-2 hover:text-strongBeige flex justify-start items-center  transition-colors"
                  href={"/signin"}
                >
                  <FiUser />
                  <p className="font-semibold ">Mon Compte</p>
                </Link>
              )}
              {decodedToken?.userId && (
                <Link
                  rel="preload"
                  onClick={() => {
                    if (decodedToken?.userId) {
                      Cookies.remove("Token");
                      window.sessionStorage.removeItem("productsInBasket");
                      window.sessionStorage.removeItem("comparedProducts");
                      window.location.reload();
                    }
                  }}
                  className="w-full text-sm py-2 border-b gap-2 hover:text-strongBeige flex justify-start items-center  transition-colors"
                  href={"/Home"}
                >
                  <FiUser />
                  <p className="font-semibold uppercase">Déconnexion</p>
                </Link>
              )}

              <Link
                rel="preload"
                href={decodedToken?.userId ? `/FavoriteList` : "/signin"}
                onClick={() => {
                  if (!decodedToken || !decodedToken.userId) {
                    alert("Veuillez vous connecter pour voir vos favoris.");
                  }
                }}
                className="w-full text-sm border-b py-2 gap-2 text-center hover:text-strongBeige flex justify-start items-center  transition-colors"
              >
                <FiHeart />
                <p className="font-semibold uppercase">Ma Liste D'envies</p>
              </Link>
              <Link
                rel="preload"
                href={decodedToken?.userId ? `/TrackingPackages` : "/signin"}
                onClick={() => {
                  if (!decodedToken || !decodedToken.userId) {
                    alert("Veuillez vous connecter pour voir vos commandes.");
                  }
                }}
                className="w-full text-sm border-b py-2 gap-2 text-center hover:text-strongBeige flex justify-start items-center  transition-colors"
              >
                <GoPackageDependents />
                <p className="font-semibold uppercase">Mes Commandes</p>
              </Link>

              <Link
                rel="preload"
                href={`/productComparison`}
                className=" text-sm w-full py-2 gap-2 hover:text-strongBeige flex justify-start items-center  transition-colors"
              >
                <IoGitCompare />
                <p className="font-semibold uppercase">
                  Comparer ({LengthComparer})
                </p>
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
