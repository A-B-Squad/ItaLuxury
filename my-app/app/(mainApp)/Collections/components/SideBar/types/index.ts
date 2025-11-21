
export interface Colors {
  id: string;
  Hex: string;
  color: string;
  Product: unknown[];
}

export interface Brand {
  id: string;
  name: string;
  product: Product[];
}

export interface Product {
  Colors: any;
  categories: { name: string }[];
}

export interface Category {
  id: string;
  name: string;
}

export interface FilterQueries {
  [key: string]: string[];
}

export interface SideBarProps {
  colors: Color[];
  brands: Brand[];
  categories: Category[];
}

export interface FilterChoice {
  id: string;
  label: string;
}

export interface FilterCallbacks {
  onChoiceSelect: (value: string) => void;
  onCategorySelect: (categoryId: string) => void;
  onColorSelect: (colorName: string) => void;
  onBrandSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceChangeEnd: () => void;
  onClearFilters: () => void;
}

export interface FilterState {
  selectedFilterQueries: FilterQueries;
  localPrice: number;
  isOptionChecked: (name: string, option: string) => boolean;
  hasActiveFilters: boolean;
}