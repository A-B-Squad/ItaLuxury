
import React, { memo } from 'react';
import { ColorOption } from './ui/ColorOption';
import { Colors } from '../types';
import { FILTER_SECTIONS } from '../utils/constants';

interface ColorFiltersProps {
  colors: Colors[];
  isOptionChecked: (name: string, option: string) => boolean;
  onColorSelect: (colorName: string) => void;
}

export const ColorFilters = memo<ColorFiltersProps>(({
  colors,
  isOptionChecked,
  onColorSelect
}) => (
  <div className=" border-t pl-5 border-gray-200 py-6">
    <h3 className="font-normal tracking-widest text-sm mb-6">
      {FILTER_SECTIONS.COLORS}
    </h3>
    <div className="overflow-y-auto max-h-60">
      <div className="flex items-center flex-wrap px-3 w-full gap-3">
        {colors.map(color => (
          <ColorOption
            key={color.id}
            color={color}
            isChecked={isOptionChecked("color", color.color)}
            onSelect={onColorSelect}
          />
        ))}
      </div>
    </div>
  </div>
));

ColorFilters.displayName = 'ColorFilters';