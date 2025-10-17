
import React, { memo } from 'react';
import { FilterChoice as FilterChoiceType } from '../../types';

interface FilterChoiceProps {
  choice: FilterChoiceType;
  isChecked: boolean;
  onChange: (value: string) => void;
}

export const FilterChoice = memo<FilterChoiceProps>(({ choice, isChecked, onChange }) => (
  <div className="flex items-center group">
    <input
      style={{ WebkitAppearance: "none", appearance: "none" }}
      id={`filtre-choix-${choice.id}`}
      name="choice"
      type="radio"
      value={choice.id}
      checked={isChecked}
      className={`h-3 w-3 outline-none ${isChecked ? "bg-secondaryColor" : "bg-white"
        } rounded-sm h-5 w-5 border-gray-300 border hover:bg-lightBeige transition-all hover:shadow-primaryColor hover:shadow-lg cursor-pointer group text-primaryColor`}
      onChange={() => onChange(choice.id)}
    />
    <label
      htmlFor={`filtre-choix-${choice.id}`}
      className={`ml-3 text-sm tracking-widest cursor-pointer ${isChecked ? "text-black font-semibold" : "text-gray-600"
        } group-hover:text-black group-hover:font-semibold transition-all`}
    >
      {choice.label}
    </label>
  </div>
));

FilterChoice.displayName = 'FilterChoice';