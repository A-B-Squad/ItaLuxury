"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
const SideAds = ({ image, link }: any) => {
  return (
    <div className="relative hidden md:block">
      <Link href={link}>
        <Image
          width={300}
          height={500}
          src={image}
          className="min-h-72 min-w-60"
          alt="MaisonNg"
        />
      </Link>
    </div>
  );
};

export default SideAds;
