
import { FilterChoice } from '../types';

export const PRICE_DEBOUNCE_DELAY = 500;
export const MOBILE_BREAKPOINT = 768;
export const DEFAULT_PRICE = 500;
export const MIN_PRICE = 1;
export const MAX_PRICE = 3000;

export const FILTER_CHOICES: FilterChoice[] = [
  { id: "in-discount", label: "En Promo" },
  { id: "new-product", label: "Nouveau Produit" },
];

export const BASE_COLLECTION_URL = "/Collections/tunisie";

export const FILTER_SECTIONS = {
  CHOICE: "CHOIX",
  CATEGORIES: "CATEGORIES",
  PRICE: "PRIX",
  COLORS: "COULEURS",
  BRANDS: "MARKES",
  FILTER_TITLE: "FILTRER"
} as const;