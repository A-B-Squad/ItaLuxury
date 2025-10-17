
import React, { memo } from 'react';
import { MIN_PRICE, MAX_PRICE, DEFAULT_PRICE } from '../../utils/constants';

interface PriceRangeProps {
  localPrice: number;
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceChangeEnd: () => void;
}

export const PriceRange = memo<PriceRangeProps>(({ 
  localPrice, 
  onPriceChange, 
  onPriceChangeEnd 
}) => (
  <div className="w-11/12">
    <div className="relative mb-6">
      <label htmlFor="price-range-input" className="sr-only">
        Prix range
      </label>
      <input
        style={{ WebkitAppearance: "none", appearance: "none" }}
        id="price-range-input"
        type="range"
        min={MIN_PRICE}
        max={MAX_PRICE}
        value={localPrice}
        className="w-full h-full max-h-6 bg-gray-200 rounded-lg cursor-pointer"
        onChange={onPriceChange}
        onMouseUp={onPriceChangeEnd}
        onTouchEnd={onPriceChangeEnd}
      />
      <span className="text-sm text-gray-500 absolute start-0 -bottom-6">
        Min ({MIN_PRICE} TND)
      </span>
      <span className="text-sm text-gray-500 absolute end-0 -bottom-6">
        Max ({MAX_PRICE} TND)
      </span>
    </div>
    <div className="flex justify-between mt-10">
      <span className="text-gray-400">de :</span>
      <div className="w-20 max-h-20 h-full border flex justify-center border-gray-200 text-gray-400">
        {MIN_PRICE}
      </div>
      <span className="text-gray-400">à :</span>
      <input
        type="number"
        className={`w-20 border max-h-6 text-center outline-1 focus:text-black outline-gray-300 border-gray-200 ${
          localPrice !== DEFAULT_PRICE ? "text-black" : "text-gray-400"
        }`}
        value={localPrice}
        onChange={onPriceChange}
        onBlur={onPriceChangeEnd}
        min={MIN_PRICE}
        max={MAX_PRICE}
      />
      <span className="text-gray-400">TND</span>
    </div>
  </div>
));

PriceRange.displayName = 'PriceRange';