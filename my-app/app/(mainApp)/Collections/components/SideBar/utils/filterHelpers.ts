
import { FilterQueries, Brand, Color } from '../types';

export const updateFilterQueries = (
  current: FilterQueries,
  key: string,
  value: string,
  checked: boolean,
  isSingleSelect = false
): FilterQueries => {
  const updated = { ...current };
  
  if (isSingleSelect) {
    updated[key] = checked ? [value] : [];
  } else {
    const currentValues = updated[key] || [];
    updated[key] = checked
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
  }
  
  // Clean up empty arrays
  if (updated[key]?.length === 0) {
    delete updated[key];
  }
  
  return updated;
};

export const filterBrandsByCategory = (
  brands: Brand[],
  selectedCategories?: string[]
): Brand[] => {
  if (!selectedCategories?.length) return brands;
  
  return brands.filter(brand =>
    brand.product.some(product =>
      product.categories.some(category =>
        selectedCategories.includes(category.name)
      )
    )
  );
};

export const filterColorsWithProducts = (colors: Color[]): Color[] => {
  return colors.filter(color => color.Product?.length > 0);
};

export const isOptionChecked = (
  selectedFilterQueries: FilterQueries,
  name: string,
  option: string
): boolean => {
  return selectedFilterQueries[name]?.includes(option) ?? false;
};

export const hasActiveFilters = (selectedFilterQueries: FilterQueries): boolean => {
  return Object.keys(selectedFilterQueries).length > 0;
};