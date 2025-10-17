
import React, { memo } from 'react';
import { CategoryItem } from './ui/CategoryItem';
import { Category } from '../types';
import { FILTER_SECTIONS } from '../utils/constants';

interface CategoryFiltersProps {
  categories: Category[];
  currentCategoryId?: string | null;
  onCategorySelect: (categoryId: string) => void;
}

export const CategoryFilters = memo<CategoryFiltersProps>(({
  categories,
  currentCategoryId,
  onCategorySelect
}) => (
  <div className="border-b pl-5 border-gray-200 py-3">
    <h3 className="font-normal tracking-widest text-sm mb-6">
      {FILTER_SECTIONS.CATEGORIES}
    </h3>
    <ul className="space-y-4 pl-5 border-gray-200 text-sm font-medium text-gray-900">
      {categories.map(category => (
        <CategoryItem
          key={category.id}
          category={category}
          isSelected={currentCategoryId === category.id}
          onClick={onCategorySelect}
        />
      ))}
    </ul>
  </div>
));

CategoryFilters.displayName = 'CategoryFilters';