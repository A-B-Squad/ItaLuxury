import { categories } from "./fetchCategories";
import { subcategoriesByParentId } from "./subcategoriesByParentId";
import { categoryByName } from "./categoryByName";
export const categoryQueries = {
    categories,
    subcategoriesByParentId,
    categoryByName
}