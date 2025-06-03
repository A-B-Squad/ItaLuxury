"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState, memo } from "react";
import { BsGrid3X3Gap } from "react-icons/bs";
import { CiGrid2H, CiGrid41 } from "react-icons/ci";
import { motion } from "framer-motion";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAllProductViewStore } from "../../../store/zustand";
import { convertStringToQueriesObject } from "@/app/Helpers/_convertStringToQueriesObject";
import { convertValidStringQueries } from "@/app/Helpers/_convertValidStringQueries";

interface TopBarProps {
  numberOfProduct: number;
}

const CollectionToolbar: React.FC<TopBarProps> = ({ numberOfProduct }) => {
  const { changeProductView, view } = useAllProductViewStore();
  const [selectedFilterQueries, setSelectedFilterQueries] = useState<Record<string, string>>({});
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams) {
      const paramsObj = convertStringToQueriesObject(searchParams);
      // Convert the Record<string, string[]> to Record<string, string>
      const convertedParams: Record<string, string> = {};
      Object.entries(paramsObj).forEach(([key, value]) => {
        convertedParams[key] = Array.isArray(value) ? value[0] : value;
      });
      setSelectedFilterQueries(convertedParams);
    }
  }, [searchParams]);

  const handleSortChange = useCallback(
    (selectedSort: string) => {
      router.push(
        `/Collections/tunisie?${convertValidStringQueries({
          ...selectedFilterQueries,
          sort: [selectedSort],
        })}`,
        {
          scroll: true,
        },
      );
    },
    [selectedFilterQueries, router],
  );

  const handleViewChange = useCallback((viewType: number) => {
    changeProductView(viewType);
  }, [changeProductView]);

  return (
    <motion.div
    className="container w-full bg-white border-t border-b border-gray-200 shadow-sm"
    initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between py-3 px-4">
        <p className="text-xs md:text-sm font-medium text-gray-700">
          {numberOfProduct} produits
        </p>

        <div className="flex items-center gap-4">
          <div className="flex items-center border rounded-md p-1 bg-gray-50">
            <button
              type="button"
              className={`p-1.5 rounded-md transition-all ${view === 1 ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => handleViewChange(1)}
              aria-label="View as list"
            >
              <CiGrid2H size={18} />
            </button>
            <button
              type="button"
              className={`p-1.5 rounded-md transition-all hidden md:block ${view === 2 ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => handleViewChange(2)}
              aria-label="View as grid (2 columns)"
            >
              <CiGrid41 size={18} />
            </button>
            <button
              type="button"
              className={`p-1.5 rounded-md transition-all ${view === 3 ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => handleViewChange(3)}
              aria-label="View as grid (3 columns)"
            >
              <BsGrid3X3Gap size={16} />
            </button>
          </div>

          <Select
          
            onValueChange={handleSortChange}
            defaultValue={selectedFilterQueries.sort}
          >
            <SelectTrigger className="w-[140px] md:w-[180px] h-9 text-xs md:text-sm border-gray-200 focus:ring-1 focus:ring-primaryColor">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                <SelectItem value="name.asc" className="text-sm">
                  Nom, A à Z
                </SelectItem>
                <SelectItem value="name.desc" className="text-sm">
                  Nom, Z à A
                </SelectItem>
                <SelectItem value="price.asc" className="text-sm">
                  Prix, croissant
                </SelectItem>
                <SelectItem value="price.desc" className="text-sm">
                  Prix, décroissant
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  );
};
export default memo(CollectionToolbar);
