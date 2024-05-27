import React from "react";
import { FaUserAlt } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";

const Header = () => {
  return (
    <header className="flex shadow-md py-4 px-4 sm:px-10 bg-white font-[sans-serif] min-h-[70px] tracking-wide relative">
      <div className="absolute right-2 max-lg:ml-auto space-x-3">
        <button className="p-2 text-sm rounded-md font-bold text-white border-2 border-blue-900 transition-all ease-in-out duration-300 hover:bg-transparent hover:text-strongBeige">
          <IoIosNotifications size={24} className="text-blue-900" />
        </button>
        <button className="p-2 text-sm rounded-md font-bold text-white border-2 border-blue-900 transition-all ease-in-out duration-300 hover:bg-transparent hover:text-strongBeige">
          <FaUserAlt size={24} className="text-blue-900"/>
        </button>
      </div>
    </header>
  );
};

export default Header;
