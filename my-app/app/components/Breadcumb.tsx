import React from "react";
import { IoHome } from "react-icons/io5";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { IoMdArrowDropright } from "react-icons/io";

const Breadcumb = () => {
  const params = useSearchParams();
  const position = params?.getAll("collection") ?? [];

  return (
    <div className="flex gap-2 flex-wrap items-center text-xs md:text-sm w-full  lg:w-max tracking-wider my-5 lg:ml-5">
      <div className="hover:text-strongBeige transition-all  flex items-center gap-1">
        <IoHome />
        <Link rel="preload" href={"/Home"}>
          Accueil
        </Link>
      </div>
      {position[0] && (
        <>
          <IoMdArrowDropright size={20} />
          <div className="hover:text-strongBeige transition-all flex items-center gap-2">
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
          <IoMdArrowDropright size={20} />
          <div className="hover:text-strongBeige transition-all flex items-center gap-2">
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
          <IoMdArrowDropright size={20} />
          <div className="hover:text-strongBeige transition-all flex items-center gap-2">
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
          <IoMdArrowDropright size={20} />
          <div className="text-strongBeige transition-all flex items-center gap-2">
            <p>{position[6]} </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Breadcumb;
