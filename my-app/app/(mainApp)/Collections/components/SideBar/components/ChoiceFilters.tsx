
import React, { memo } from 'react';
import { FilterChoice } from './ui/FilterChoice';
import { FILTER_CHOICES, FILTER_SECTIONS } from '../utils/constants';

interface ChoiceFiltersProps {
  isOptionChecked: (name: string, option: string) => boolean;
  onChoiceSelect: (value: string) => void;
}

export const ChoiceFilters = memo<ChoiceFiltersProps>(({
  isOptionChecked,
  onChoiceSelect
}) => (
  <div className="border-b pl-5 border-gray-200 py-6">
    <h3 className="font-normal tracking-widest text-sm pb-6">
      {FILTER_SECTIONS.CHOICE}
    </h3>
    <div className="space-y-3 max-h-60">
      {FILTER_CHOICES.map(choice => (
        <FilterChoice
          key={choice.id}
          choice={choice}
          isChecked={isOptionChecked("choice", choice.id)}
          onChange={onChoiceSelect}
        />
      ))}
    </div>
  </div>
));

ChoiceFilters.displayName = 'ChoiceFilters';