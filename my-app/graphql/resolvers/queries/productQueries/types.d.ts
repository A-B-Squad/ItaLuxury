interface ProductSearchInput {
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    categoryIds?: string[] | null;
    colorIds?: string[] | null;
  }