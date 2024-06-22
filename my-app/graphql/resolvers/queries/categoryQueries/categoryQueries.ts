import { categories } from "./fetchCategories";
import { subcategoriesByParentId } from "./subcategoriesByParentId";
import { categoryByName } from "./categoryByName";
import { fetchMainCategories } from "./fetchMainCategories";
export const categoryQueries = {
    categories,
    subcategoriesByParentId,
    categoryByName, fetchMainCategories
}