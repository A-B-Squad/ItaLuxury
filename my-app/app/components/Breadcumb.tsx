"use client";
import React from "react";
import { IoHome } from "react-icons/io5";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { IoMdArrowDropright } from "react-icons/io";

const Breadcumb = ({ pageName, pageLink }: any) => {
  const params = useSearchParams();
  const position = params?.getAll("collection") ?? [];

  return (
    <div className="flex gap-2 justify-center      justify-self-center w-full flex-wrap items-center  md:text-sm text-base  mb-3 tracking-[2px]   ">
      <div className="hover:text-primaryColor  transition-all  flex items-center gap-1">
        <IoHome />
        <Link rel="preload" href={"/"}>
          Accueil
        </Link>
      </div>
      {pageName && (
        <>
          <span className="text-gray-500">/</span>
          <div className="hover:text-primaryColor  transition-all flex items-center gap-2">
            <Link rel="preload" href={`/${pageLink}`}>
              {pageName}
            </Link>
          </div>
        </>
      )}
      {position[0] && (
        <>
          <span className="text-gray-500">/</span>
          <div className="hover:text-primaryColor  transition-all flex items-center gap-2">
            <Link
              rel="preload"
              href={`/Collections/tunisie?category=${position[1]}`}
            >
              {position[0]}
            </Link>
          </div>
        </>
      )}
      {position[2] && (
        <>
          <span className="text-gray-500">/</span>
          <div className="hover:text-primaryColor  transition-all flex items-center gap-2">
            <Link
              rel="preload"
              href={`/Collections/tunisie?category=${position[3]}`}
            >
              {position[2]}
            </Link>
          </div>
        </>
      )}
      {position[4] && (
        <>
          <span className="text-gray-500">/</span>
          <div className="hover:text-primaryColor  transition-all flex items-center gap-2">
            <Link
              rel="preload"
              href={`/Collections/tunisie?category=${position[5]}`}
            >
              {position[4]}
            </Link>
          </div>
        </>
      )}

      {position[6] && (
        <>
          <span className="text-gray-500">/</span>
          <div className="text-primaryColor transition-all flex items-center gap-2">
            <p>{position[6]} </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Breadcumb;
