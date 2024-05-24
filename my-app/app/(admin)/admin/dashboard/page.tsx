import React from "react";
import { CiHome } from "react-icons/ci";
import { LuPackage2 } from "react-icons/lu";
import { TbPackages } from "react-icons/tb";
import { MdKeyboardDoubleArrowUp } from "react-icons/md";
import { LuUsers2 } from "react-icons/lu";
import { FaRegChartBar } from "react-icons/fa";
import { LuNewspaper } from "react-icons/lu";
import { CiSettings } from "react-icons/ci";
import { IoMenu } from "react-icons/io5";

const Dashborad = () => {
  return (
    <div className="w-full p-8">
      <div className="main-cards grid grid-cols-4 gap-5 my-4 ">
        <div className="card flex flex-col justify-around p-4 px-6 rounded bg-strongBeige">
          <div className="card-inner text-lg text-white flex items-center justify-between">
            <h3>PRODUITS</h3>
            <LuPackage2 className="card_icon"/>
          </div>
          <h1 className="text-white">300</h1>
        </div>
        <div className="card flex flex-col justify-around p-4 px-6 rounded bg-strongBeige">
          <div className="card-inner text-lg text-white flex items-center justify-between">
            <h3>COMMANDES</h3>
            <TbPackages className="card_icon"/>
          </div>
          <h1 className="text-white">12</h1>
        </div>
        <div className="card flex flex-col justify-around p-4 px-6 rounded bg-strongBeige">
          <div className="card-inner text-lg text-white flex items-center justify-between">
            <h3>CLIENTS</h3>
            <LuUsers2 className="card_icon"/>
          </div>
          <h1 className="text-white">33</h1>
        </div>
        <div className="card flex flex-col justify-around p-4 px-6 rounded bg-strongBeige">
          <div className="card-inner text-lg text-white flex items-center justify-between">
            <h3>UP SELLS</h3>
            <MdKeyboardDoubleArrowUp className="card_icon"/>
          </div>
          <h1 className="text-white">42</h1>
        </div>
      </div>
    </div>
  );
};

export default Dashborad;
