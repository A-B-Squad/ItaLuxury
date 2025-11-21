
import React, { memo } from 'react';
import { PriceRange } from './ui/PriceRange';
import { FILTER_SECTIONS } from '../utils/constants';

interface PriceFilterProps {
  localPrice: number;
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceChangeEnd: () => void;
}

export const PriceFilter = memo<PriceFilterProps>(({
  localPrice,
  onPriceChange,
  onPriceChangeEnd
}) => (
  <div className=" pl-5 border-gray-200 py-3">
    <h3 className="font-normal tracking-widest text-sm pb-2">
      {FILTER_SECTIONS.PRICE}
    </h3>
    <PriceRange
      localPrice={localPrice}
      onPriceChange={onPriceChange}
      onPriceChangeEnd={onPriceChangeEnd}
    />
  </div>
));

PriceFilter.displayName = 'PriceFilter';