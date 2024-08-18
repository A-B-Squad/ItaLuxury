"use client";
import React, { useEffect, useState } from "react";
import Image from "next/legacy/image";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { IoIosClose } from "react-icons/io";
import { ADVERTISSMENT_QUERY } from "@/graphql/queries";

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
      className={`fixed inset-0 flex items-center justify-center transition-all duration-500 ${
        showAds ? "opacity-100 z-50" : "opacity-0 translate-y-6 pointer-events-none"
      }`}
    >
      <div className="bg-lightBlack absolute z-[100] left-0 top-0 w-full h-full opacity-80"></div>
      <div
        className={`bg-white shadow-2xl flex items-center justify-center text-center w-[350px] h-[250px] md:w-[700px] md:h-[450px] fixed rounded-md z-[110] transition-transform transform ${
          showAds ? "scale-100" : "scale-90"
        }`}
      >
        <IoIosClose
          size={50}
          color="black"
          className="right-0 rounded-full w-8 h-8 z-50 absolute top-0 cursor-pointer"
          onClick={handleClose}
        />
        {centerAds?.advertismentByPosition.length === 0 ? (
          <>
            <p className="hidden md:block">700px X 450px</p>
            <p className="md:hidden block">300px X 250px</p>
          </>
        ) : (
          <Link
            href={`${centerAds?.advertismentByPosition[0]?.link[0]}`}
            className="cursor-pointer"
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
