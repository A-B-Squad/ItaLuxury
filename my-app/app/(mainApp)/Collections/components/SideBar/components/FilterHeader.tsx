
import React, { memo } from 'react';
import { IoIosClose } from 'react-icons/io';
import { FILTER_SECTIONS } from '../utils/constants';

interface FilterHeaderProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  showTitle?: boolean;
}

export const FilterHeader = memo<FilterHeaderProps>(({
  hasActiveFilters,
  onClearFilters,
  showTitle = true
}) => (
  <>
    {showTitle && (
      <h3 className="font-semibold tracking-widest pl-5 text-lg pb-2">
        {FILTER_SECTIONS.FILTER_TITLE}
      </h3>
    )}

    {hasActiveFilters && (
      <div className="flex items-center justify-center transition-all hover:text-red-700 cursor-pointer mb-4">
        <button
          type="button"
          onClick={onClearFilters}
          className="flex border rounded-md gap-2 items-center py-1 shadow px-2"
        >
          <IoIosClose size={25} />
          Effacer Filters
        </button>
      </div>
    )}
  </>
));

FilterHeader.displayName = 'FilterHeader';