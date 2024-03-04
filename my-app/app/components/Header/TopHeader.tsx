"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { FiUser } from "react-icons/fi";
import { FiHeart } from "react-icons/fi";
import { RiShoppingCartLine } from "react-icons/ri";

const TopHeader = () => {
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
          <li className="whishlist flex items-center gap-2 cursor-pointer hover:text-strongBeige transition-all">
            <Link href={`/signin`}>Compte</Link>
            <FiUser />
          </li>
          <li className="whishlist flex items-center gap-2 cursor-pointer hover:text-strongBeige transition-all">
            <Link href={`/Mes-Favoris`}>Mes Favoris</Link>
            <FiHeart />
          </li>
          <li className="whishlist flex items-center gap-2 cursor-pointer hover:text-strongBeige transition-all">
            <Link href={`/Mes-Favoris`}>Panier</Link>
            <RiShoppingCartLine />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TopHeader;
