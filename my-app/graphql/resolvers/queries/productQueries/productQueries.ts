import { products } from "./fetchProducts";
import { productsByCategory } from "./productsByCategory";
import { productById } from "./getProductById";
import { productDiscount } from "./productDiscount";
import { productsDiscounts } from "./allProductDiscounts";
import { favoriteProducts } from "./favoriteProducts";
// import { productColors } from "./productColors";
import { productReview } from "./productReview";
import { getProductImages } from "./getProductImages";

export const productQueries = {
    products,
    productsByCategory,
    productById,
    productDiscount,
    productsDiscounts,
    favoriteProducts,
    // productColors,
    productReview,
    getProductImages
}