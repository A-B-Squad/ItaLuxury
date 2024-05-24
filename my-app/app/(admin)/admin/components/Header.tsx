import React from "react";
import { FaUserAlt } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";

const Header = () => {
  return (
    <header className="flex shadow-md py-4 px-4 sm:px-10 bg-white font-[sans-serif] min-h-[70px] tracking-wide relative">
      <div className="absolute right-2 max-lg:ml-auto space-x-3">
        <button className="p-2 text-sm rounded-full font-bold text-white border-2 border-strongBeige bg-strongBeige transition-all ease-in-out duration-300 hover:bg-transparent hover:text-strongBeige">
          <IoIosNotifications size={24} />
        </button>
        <button className="p-2  text-sm rounded-full font-bold text-white border-2 border-strongBeige bg-strongBeige transition-all ease-in-out duration-300 hover:bg-transparent hover:text-strongBeige">
          <FaUserAlt size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;
