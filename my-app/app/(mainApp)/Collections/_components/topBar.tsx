"use client";
import React from "react";
import { IoGrid } from "react-icons/io5";
import { FaFilter } from "react-icons/fa";
import { BsFillGrid3X3GapFill, BsFillGrid3X2GapFill } from "react-icons/bs";
import { HiViewGrid } from "react-icons/hi";

import Breadcumb from "../../../components/Breadcumb";
import { useSidebarStore } from "../../../store/zustand";
import { useAllProductViewStore } from "../../../store/zustand";
const TopBar = () => {
  const { toggleOpenSidebar } = useSidebarStore();
  const { changeProductView, view } = useAllProductViewStore();

  return (
    <div className="flex z-50 top-0 lg:relative fixed w-full border-t px-5 items-center white bg-white shadow-lg  justify-between border-b border-gray-200 ">
      <Breadcumb />

      <div className="flex items-center">
        <div className="relative ">
          <select name="sort" id="sort" className="max-w-16 cursor-pointer">
            <option value="">Sort</option>
            <option value="asc">Price : High to Low</option>
            <option value="desc">Price : Low To High</option>
          </select>
        </div>
        <div className=" hidden md:flex items-center gap-3 sm:ml-7 md:ml-3">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={() => {
              changeProductView(1);
            }}
          >
            <span className="sr-only">View grid</span>
            <BsFillGrid3X2GapFill
              size={20}
              color={view === 1 ? "black" : "currentColor"}
            />
          </button>
          <button
            type="button"
            className="border-l border-r px-2 text-gray-400 hover:text-gray-500"
            onClick={() => {
              changeProductView(2);
            }}
          >
            <span className="sr-only">View grid</span>
            <HiViewGrid
              size={20}
              color={view === 2 ? "black" : "currentColor"}
            />
          </button>
          <button
            type="button"
            onClick={() => {
              changeProductView(3);
            }}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">View grid</span>
            <BsFillGrid3X3GapFill
              size={20}
              color={view === 3 ? "black" : "currentColor"}
            />
          </button>
        </div>

        <button
          type="button"
          className=" p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
          onClick={toggleOpenSidebar}
        >
          <span className="sr-only">Filters</span>
          <FaFilter size={20} />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
