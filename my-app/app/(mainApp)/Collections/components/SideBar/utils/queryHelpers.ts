import { FilterQueries } from '../types';
import { BASE_COLLECTION_URL } from './constants';

export const createQueryString = (queries: FilterQueries): string => {
  const validEntries = Object.entries(queries).filter(([, values]) => values.length > 0);
  
  return validEntries
    .map(([key, values]) => {
      const encodedValues = values.map(encodeURIComponent);
      return key === "color" || key === "choice" || key === "brand"
        ? encodedValues.map(value => `${key}=${value}`).join("&")
        : `${key}=${encodedValues.join(",")}`;
    })
    .join("&");
};

export const buildFilterUrl = (queries: FilterQueries): string => {
  const queryString = createQueryString(queries);
  return queryString ? `${BASE_COLLECTION_URL}?${queryString}` : `${BASE_COLLECTION_URL}?page=1`;
};


export const buildCategoryUrl = (categoryName: string): string => {
  const params = new URLSearchParams({ category: categoryName });
  return `${BASE_COLLECTION_URL}?${params}`;
};