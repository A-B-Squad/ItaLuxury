
import React, { memo } from 'react';
import { MIN_PRICE, MAX_PRICE } from '../../utils/constants';

interface PriceRangeProps {
  localPrice: number;
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceChangeEnd: () => void;
}

export const PriceRange = memo<PriceRangeProps>(({
  localPrice,
  onPriceChange,
  onPriceChangeEnd
}) => {



  const percentage = ((localPrice - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Plage de Prix</h3>
          <div className="px-3 py-1 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-blue-600">
              {localPrice} TND
            </span>
          </div>
        </div>

        {/* Slider Container */}
        <div className="relative pt-2 pb-8">
          {/* Progress Track */}
          <div className="absolute top-2 left-0 right-0 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Slider Input */}
          <input
            id="price-range-input"
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            value={localPrice}
            className="relative w-full h-2 bg-transparent appearance-none cursor-pointer z-10"
            style={{
              WebkitAppearance: 'none',
            }}
            onChange={onPriceChange}
            onMouseUp={onPriceChangeEnd}
            onTouchEnd={onPriceChangeEnd}
          />

          {/* Min/Max Labels */}
          <div className="flex justify-between mt-2 px-1">
            <span className="text-xs font-medium text-gray-500">
              {MIN_PRICE} TND
            </span>
            <span className="text-xs font-medium text-gray-500">
              {MAX_PRICE} TND
            </span>
          </div>
        </div>

        {/* Price Inputs */}
        <div className="grid grid-cols-2 gap-4">
          {/* Min Price */}
          <div className="space-y-2">
            <label
            htmlFor='min-price-input'
             className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Prix Min
            </label>
            <div className="relative">
              <input
                type="number"
                value={MIN_PRICE}
                readOnly
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm font-medium cursor-not-allowed"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                TND
              </span>
            </div>
          </div>

          {/* Max Price */}
          <div className="space-y-2">
            <label
            htmlFor='max-price-input'
            className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Prix Max
            </label>
            <div className="relative">
              <input
                type="number"
                value={localPrice}
                onChange={onPriceChange}
                onBlur={onPriceChangeEnd}
                min={MIN_PRICE}
                max={MAX_PRICE}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                TND
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

);

PriceRange.displayName = 'PriceRange';