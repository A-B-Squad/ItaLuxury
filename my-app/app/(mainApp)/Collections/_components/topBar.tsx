"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BsFillGrid3X2GapFill, BsFillGrid3X3GapFill } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";
import { HiViewGrid } from "react-icons/hi";
import Breadcumb from "../../../components/Breadcumb";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useAllProductViewStore,
  useSidebarStore,
} from "../../../store/zustand";
import {
  convertStringToQueriesObject,
  convertValidStringQueries,
} from "./sideBar";

const TopBar = () => {
  const { toggleOpenSidebar } = useSidebarStore();
  const { changeProductView, view } = useAllProductViewStore();
  const [selectedFilterQueries, setSelectedFilterQueries] = useState<
    Record<string, string[]>
  >({});
  const searchParams: URLSearchParams | null = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const paramsObj = convertStringToQueriesObject(searchParams);
    setSelectedFilterQueries(paramsObj);
  }, [searchParams]);

  const handleSortChange = (selectedSort: string) => {
    router.push(
      `/Collections/tunisie?${convertValidStringQueries({
        ...selectedFilterQueries,
        sort: selectedSort,
      })}`,
      {
        scroll: false,
      }
    );
  };

  return (
    <div className="flex z-10 top-0 lg:relative relative w-full border-t px-5 items-center white bg-white shadow-lg  justify-between border-b border-gray-200 ">
      <Breadcumb />

      <div className="flex items-center">
 

        <Select
          onValueChange={(value) => {
            handleSortChange(value);
          }}
        >
          <SelectTrigger className="w-36 md:w-[180px] outline-none mr-3">
            <SelectValue placeholder="Trier par :" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup>
              <SelectItem
                className="cursor-pointer border-b hover:opacity-80 transition-opacity"
                value="desc"
              >
                Prix, décroissant
              </SelectItem>
              <SelectItem
                className="cursor-pointer hover:opacity-80 transition-opacity"
                value="asc"
              >
                Prix, croissant
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-3 sm:ml-7 md:ml-3">
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
            className="border-l hidden md:block border-r px-2 text-gray-400 hover:text-gray-500"
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
          className=" p-2 text-gray-400 hover:text-gray-500 sm:ml-6 md:hidden"
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
