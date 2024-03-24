"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
const SideAds = ({ image, link }: any) => {
  return (
    <div className="relative hidden w-2/4 md:block  overflow-hidden transition-opacity duration-300 hover:opacity-50">
      <Link href={link}>
        <Image
          width={300}
          height={500}
          src={image}
          className=" w-full h-full"
          alt="MaisonNg"
        />
      </Link>
    </div>
  );
};

export default SideAds;
