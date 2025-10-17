
import React, { memo } from 'react';
import { Brand } from '../../types';

interface BrandOptionProps {
  brand: Brand;
  isChecked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BrandOption = memo<BrandOptionProps>(({ brand, isChecked, onChange }) => (
  <div className="flex items-center">
    <input
      id={`filtre-brand-${brand.id}`}
      name="brand"
      type="radio"
      value={brand.name}
      checked={isChecked}
      className={`h-3 w-3 outline-none ${isChecked ? "bg-secondaryColor" : "bg-white"
        } rounded-sm h-5 w-5 border-gray-300 border hover:bg-lightBeige transition-all hover:shadow-lg cursor-pointer group text-primaryColor`}
      onChange={onChange}
      aria-label={`Filter by ${brand.name}`}
    />
    <div className="flex items-center justify-between w-full">
      <label
        htmlFor={`filtre-brand-${brand.id}`}
        className="ml-3 text-sm tracking-wider text-gray-600 cursor-pointer group-hover:text-black group-hover:font-semibold hover:font-semibold transition-all"
      >
        {brand.name}
      </label>
      <span className="text-gray-600 mr-3">({brand.product.length})</span>
    </div>
  </div>
));

BrandOption.displayName = 'BrandOption';