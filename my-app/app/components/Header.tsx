"use client";
import React from "react";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import { FiUser } from "react-icons/fi";
import { FiHeart } from "react-icons/fi";
import { RiShoppingCartLine } from "react-icons/ri";
import { HiOutlineBars3BottomLeft } from "react-icons/hi2";

export const Header = () => {
  return (
    <nav className=" relative shadow-2xl px-20 ">
      <div className="container flex justify-between items-center border-b-2">
        <div className="logo ">
          <Image
            src="/logo2.png"
            alt="logo"
            width={180}
            height={130}
            priority
          />
        </div>
        <div className="search flex items-center border-2 px-4 w-full relative  max-w-md h-11 border-strongBeige rounded-lg pl-4">
          <input className="h-full  outline-none" type="text" />
          <span className="flex items-center right-0 absolute justify-center cursor-pointer  h-full w-10 bg-strongBeige">
            <CiSearch className=" size-7 text-white " />
          </span>
        </div>
        <div className="list flex items-center gap-5 cursor-pointer text-lg">
          <div className="account flex items-center gap-2 cursor-pointer hover:text-strongBeige transition-all">
            <p>Compte</p>
            <FiUser />
          </div>
          <div className="whishlist flex items-center gap-2 cursor-pointer hover:text-strongBeige transition-all">
            <p>Mes Favoris</p>
            <FiHeart />
          </div>
          <div className="whishlist flex items-center gap-2 cursor-pointer hover:text-strongBeige transition-all">
            <p>Panier</p>
            <RiShoppingCartLine />
          </div>
        </div>
      </div>

      <div className="container flex justify-between items-center ">
        <HiOutlineBars3BottomLeft className=" text-lg cursor-pointer p-2 border-2" />

        <div className="search flex items-center border-2 px-4 w-full relative  max-w-md h-11 border-strongBeige rounded-lg pl-4">
          <input className="h-full  outline-none" type="text" />
          <span className="flex items-center right-0 absolute justify-center cursor-pointer  h-full w-10 bg-strongBeige">
            <CiSearch className=" size-7 text-white " />
          </span>
        </div>
        <div className="list flex items-center gap-5 cursor-pointer text-lg">
          <div className="account flex items-center gap-2 cursor-pointer hover:text-strongBeige transition-all">
            <p>Compte</p>
            <FiUser />
          </div>
          <div className="whishlist flex items-center gap-2 cursor-pointer hover:text-strongBeige transition-all">
            <p>Mes Favoris</p>
            <FiHeart />
          </div>
          <div className="whishlist flex items-center gap-2 cursor-pointer hover:text-strongBeige transition-all">
            <p>Panier</p>
            <RiShoppingCartLine />
          </div>
        </div>
      </div>
    </nav>
  );
};
