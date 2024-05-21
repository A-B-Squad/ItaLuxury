import { products } from "./fetchProducts";
import { productsByCategory } from "./productsByCategory";
import { productById } from "./getProductById";
import { productDiscount } from "./productDiscount";
import { productsDiscounts } from "./allProductDiscounts";
import { favoriteProducts } from "./favoriteProducts";
import { productReview } from "./productReview";
import { productsLessThen20 } from "./fetchProductPriceLess20";
import {searchProducts} from "./searchProducts";

export const productQueries = {
    products,
    productsByCategory,
    productById,
    productDiscount,
    productsDiscounts,
    favoriteProducts,
    productReview,productsLessThen20,
    searchProducts
}