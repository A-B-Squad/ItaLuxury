import React from "react";
import { IoGrid } from "react-icons/io5";
import { FaFilter } from "react-icons/fa";
import Breadcumb from '../../../components/Breadcumb';
const TopBar = () => {
  return (
    <div className="flex relative w-full border-t px-5 items-center white bg-white shadow-lg  justify-between border-b border-gray-200 ">
      <Breadcumb position={[""]}/>

      <div className="flex items-center">
        <div className="relative ">
          <select name="sort" id="sort" className="max-w-16">
            <option value="">Sort</option>
            <option value="asc">Price : High to Low</option>
            <option value="desc">Price : Low To High</option>
          </select>
        </div>

        <button
          type="button"
          className="m-2  p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
        >
          <span className="sr-only">View grid</span>
          <IoGrid size={20} />
        </button>
        <button
          type="button"
          className=" p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
        >
          <span className="sr-only">Filters</span>
          <FaFilter size={20} />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
