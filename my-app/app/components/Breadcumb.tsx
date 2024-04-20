import React from "react";
import { IoHome } from "react-icons/io5";
import Link from "next/link";

const Breadcumb = ({ position }: any) => {
  return (
    <div className="flex gap-2 items-center">
      <div className="hover:text-strongBeige transition-all flex items-center gap-2">
        <IoHome />
        <Link href={"/Home"}>Accueil /</Link>
      </div>
    </div>
  );
};

export default Breadcumb;
