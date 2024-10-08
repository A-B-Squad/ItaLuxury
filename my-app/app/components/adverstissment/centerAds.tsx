"use client";
import React, { useEffect, useState } from "react";
import Image from "next/legacy/image";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { IoIosClose } from "react-icons/io";
import { ADVERTISSMENT_QUERY } from "@/graphql/queries";
import { RiCloseLine } from "react-icons/ri";

const CenterAds = () => {
  const [showAds, setShowAds] = useState(false);
  const { data: centerAds } = useQuery(ADVERTISSMENT_QUERY, {
    variables: { position: "BigAds" },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAds(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShowAds(false);
  };

  return (
    <div
      className={`fixed inset-0 flex rounded-md items-center justify-center transition-all duration-500 ${
        showAds
          ? "opacity-100 z-[1000]"
          : "opacity-0 translate-y-6 pointer-events-none"
      }`}
    >
      <div className="bg-lightBlack absolute z-[100] left-0 top-0 w-full h-full opacity-80"></div>
      <div
        className={`bg-white shadow-2xl flex items-center justify-center text-center w-[300px] h-[200px] md:w-[700px] md:h-[450px] fixed rounded-md z-[110] transition-transform transform ${
          showAds ? "scale-100" : "scale-90"
        }`}
      >
        <RiCloseLine
          size={60}
          color="#e5e7eb"
          className="right-2/4 -bottom-12 translate-x-2/4  rounded-full w-9  h-9 border-[#e5e7eb] z-50 absolute border-4 font-bold cursor-pointer"
          onClick={handleClose}
        />
        {centerAds?.advertismentByPosition.length === 0 ? (
          <>
            <p className="hidden md:block">700px X 450px</p>
            <p className="md:hidden block">300px X 200px</p>
          </>
        ) : (
          <Link
            href={`${centerAds?.advertismentByPosition[0]?.link[0]}`}
            className="cursor-pointer rounded-md"
          >
            <Image
              layout="fill"
              objectFit="contain"
              src={centerAds?.advertismentByPosition[0]?.images[0]}
            />
          </Link>
        )}
      </div>
    </div>
  );
};

export default CenterAds;
