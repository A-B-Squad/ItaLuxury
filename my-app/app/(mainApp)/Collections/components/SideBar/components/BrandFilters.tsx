
import React, { memo } from 'react';
import { BrandOption } from './ui/BrandOption';
import { Brand } from '../types';
import { FILTER_SECTIONS } from '../utils/constants';

interface BrandFiltersProps {
  brands: Brand[];
  isOptionChecked: (name: string, option: string) => boolean;
  onBrandSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BrandFilters = memo<BrandFiltersProps>(({
  brands,
  isOptionChecked,
  onBrandSelect
}) => (
  <div className="border-t pl-5 border-gray-200 py-6">
    <h3 className="font-normal tracking-widest text-sm mb-6">
      {FILTER_SECTIONS.BRANDS}
    </h3>
    <div className="overflow-y-auto max-h-60">
      <div className="space-y-4">
        {brands.map(brand => (
          <BrandOption
            key={brand.id}
            brand={brand}
            isChecked={isOptionChecked("brand", brand.name)}
            onChange={onBrandSelect}
          />
        ))}
      </div>
    </div>
  </div>
));

BrandFilters.displayName = 'BrandFilters';