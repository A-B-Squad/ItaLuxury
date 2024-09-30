"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import {
  BsFillGrid3X2GapFill,
  BsFillGrid3X3GapFill,
  BsGrid3X3Gap,
} from "react-icons/bs";
import { FaFilter } from "react-icons/fa";
import { HiViewGrid } from "react-icons/hi";
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
import { convertStringToQueriesObject } from "@/app/Helpers/_convertStringToQueriesObject";
import { convertValidStringQueries } from "@/app/Helpers/_convertValidStringQueries";
import { CiGrid2H, CiGrid41 } from "react-icons/ci";

const TopBar = ({ numberOfProduct }: { numberOfProduct: number }) => {
  const { toggleOpenSidebar } = useSidebarStore();
  const { changeProductView, view } = useAllProductViewStore();
  const [selectedFilterQueries, setSelectedFilterQueries] = useState<any>({});

  const searchParams: URLSearchParams | null = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams) {
      const paramsObj = convertStringToQueriesObject(searchParams);
      setSelectedFilterQueries(paramsObj);
    }
  }, [searchParams]);

  const handleSortChange = useCallback(
    (selectedSort: string) => {
      router.push(
        `/Collections/tunisie?${convertValidStringQueries({
          ...selectedFilterQueries,
          sort: selectedSort,
        })}`,
        {
          scroll: true,
        },
      );
    },
    [selectedFilterQueries],
  );

  return (
    <div className=" container flex   mb-4 py-3 z-50 sticky md:top-[90px] top-[75px]       w-full border-t px-5 items-center white bg-[#fffffff2]   justify-between border-b border-gray-200 ">
      <div className="flex items-center w-full justify-around">
        <p className="text-xs md:text-base tracking-wide">
          {numberOfProduct} produits
        </p>

        <div className="flex items-center gap-3 sm:ml-7 md:ml-3">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={() => {
              changeProductView(1);
            }}
          >
            <span className="sr-only">View grid</span>
            <CiGrid2H size={20} color={view === 1 ? "black" : "currentColor"} />
          </button>
          <button
            type="button"
            className="border-l hidden md:block border-r px-2 text-gray-400 hover:text-gray-500"
            onClick={() => {
              changeProductView(2);
            }}
          >
            <span className="sr-only">View grid</span>
            <CiGrid41 size={20} color={view === 2 ? "black" : "currentColor"} />
          </button>
          <button
            type="button"
            onClick={() => {
              changeProductView(3);
            }}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">View grid</span>
            <BsGrid3X3Gap
              size={20}
              color={view === 3 ? "black" : "currentColor"}
            />
          </button>
        </div>

        <Select
          onValueChange={(value) => {
            handleSortChange(value);
          }}
        >
          <SelectTrigger className="w-24 md:w-[180px] outline-none mr-3">
            <SelectValue placeholder="Trier par :" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup>
              <SelectItem
                className="cursor-pointer hover:opacity-80 transition-opacity"
                value="name.asc"
              >
                NOM A à Z
              </SelectItem>
              <SelectItem
                className="cursor-pointer border-b hover:opacity-80 transition-opacity"
                value="name.desc"
              >
                NOM Z à A
              </SelectItem>
              <SelectItem
                className="cursor-pointer hover:opacity-80 transition-opacity"
                value="price.asc"
              >
                Prix; (Croissant)
              </SelectItem>
              <SelectItem
                className="cursor-pointer border-b hover:opacity-80 transition-opacity"
                value="price.desc"
              >
                Prix, (Décroissant)
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

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
