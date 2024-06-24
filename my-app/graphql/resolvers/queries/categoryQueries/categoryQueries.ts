import { categories } from "./fetchCategories";
import { subcategoriesByParentId } from "./subcategoriesByParentId";
import { categoryById } from "./categoryById";
import { fetchMainCategories } from "./fetchMainCategories";
export const categoryQueries = {
  categories,
  subcategoriesByParentId,
  categoryById,
  fetchMainCategories,
};
