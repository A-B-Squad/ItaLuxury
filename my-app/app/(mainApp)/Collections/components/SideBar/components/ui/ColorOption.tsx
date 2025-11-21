
import React, { memo } from 'react';
import { Colors } from '../../types';

interface ColorOptionProps {
  color: Colors;
  isChecked: boolean;
  onSelect: (colorName: string) => void;
}

export const ColorOption = memo<ColorOptionProps>(({ color, isChecked, onSelect }) => (
  <div className="flex items-center">
    <input
      id={`filtre-color-${color.color}`}
      name="color"
      type="checkbox"
      value={color.id}
      checked={isChecked}
      style={{
        WebkitAppearance: "none",
        MozAppearance: "none",
        appearance: "none",
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        outline: "none",
        background: color.Hex,
        border: isChecked ? "2px solid black" : "2px solid gray",
        transition: "border-color 0.3s",
      }}
      title={color.color}
      className="color-checkbox cursor-pointer shadow-md shadow-white"
      onChange={() => onSelect(color.color)}
    />
  </div>
));

ColorOption.displayName = 'ColorOption';