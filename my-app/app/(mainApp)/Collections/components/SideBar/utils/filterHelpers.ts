
import { FilterQueries, Brand, Colors } from '../types';

/**
 * Updates filter queries based on user selection
 */
export const updateFilterQueries = (
  current: FilterQueries,
  key: string,
  value: string,
  checked: boolean,
  isSingleSelect = false
): FilterQueries => {
  const updated = { ...current };

  if (isSingleSelect) {
    if (checked) {
      updated[key] = [value];
    } else {
      delete updated[key];
    }
  } else {
    const currentValues = updated[key] || [];
    updated[key] = checked
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);

    if (updated[key]?.length === 0) {
      delete updated[key];
    }
  }

  delete updated.page;
  return updated;
};

/**
 * Get available colors based on current filters
 */
export const getAvailableColors = (
  allColors: Color[],
  allBrands: Brand[],
  selectedFilters: FilterQueries
): Colors[] => {
  // If no filters, show all colors with products
  if (!selectedFilters.brand && !selectedFilters.category && !selectedFilters.choice) {
    return allColors.filter(color => color.Product?.length > 0);
  }

  const matchingProducts = getMatchingProducts(allBrands, selectedFilters);
  
  const availableColorNames = new Set<string>();
  matchingProducts.forEach(product => {
    // Handle Colors being an object or null
    if (product.Colors && product.Colors.color) {
      availableColorNames.add(product.Colors.color);
    }
  });

  return allColors.filter(color => 
    availableColorNames.has(color.color)
  );
};

/**
 * Get available brands based on current filters
 */
export const getAvailableBrands = (
  allBrands: Brand[],
  selectedFilters: FilterQueries
): Brand[] => {
  // If no filters, return all brands
  if (!selectedFilters.category && !selectedFilters.color && !selectedFilters.choice) {
    return allBrands;
  }

  return allBrands.filter(brand => {
    const products = brand.product || [];

    return products.some(product => {
      const categoryMatch = !selectedFilters.category || 
        product.categories?.some(cat => 
          selectedFilters.category!.includes(cat.name)
        );

      const colorMatch = !selectedFilters.color || 
        (product.Colors?.color && 
         selectedFilters.color.includes(product.Colors.color));

      const choiceMatch = !selectedFilters.choice || 
        matchesChoice(product, selectedFilters.choice[0]);

      return categoryMatch && colorMatch && choiceMatch;
    });
  });
};



/**
 * Helper: Get products matching current filters
 */
function getMatchingProducts(allBrands: Brand[], selectedFilters: FilterQueries) {
  let products: any[] = [];

  allBrands.forEach(brand => {
    brand.product?.forEach(product => {
      products.push({ ...product, Brand: brand });
    });
  });

  if (selectedFilters.brand) {
    products = products.filter(p => 
      selectedFilters.brand!.includes(p.Brand?.name || '')
    );
  }

  if (selectedFilters.category) {
    products = products.filter(p =>
      p.categories?.some((cat: any) => 
        selectedFilters.category!.includes(cat.name)
      )
    );
  }

  if (selectedFilters.color) {
    products = products.filter(p =>
      p.Colors?.color && 
      selectedFilters.color!.includes(p.Colors.color)
    );
  }

  if (selectedFilters.choice) {
    products = products.filter(p =>
      matchesChoice(p, selectedFilters.choice![0])
    );
  }

  return products;
}

/**
 * Helper: Check if product matches choice filter
 */
function matchesChoice(product: any, choice: string): boolean {
  switch (choice) {
    case 'in-discount':
      return product.productDiscounts?.length > 0;
    case 'new':
      const createdDate = new Date(product.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdDate > thirtyDaysAgo;
    case 'best-seller':
      return product.isBestSeller === true;
    default:
      return true;
  }
}

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

export const filterColorsWithProducts = (colors: Colors[]): Colors[] => {
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
  const filterKeys = Object.keys(selectedFilterQueries).filter(key => key !== 'page' && key !== 'price');
  return filterKeys.length > 0;
};
