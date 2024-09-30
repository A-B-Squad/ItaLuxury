import { allNewProducts } from "./allNewProducts";
import { productsByCategory } from "./productsByCategory";
import { productById } from "./getProductById";
import { productDiscount } from "./productDiscount";
import { productsDiscounts } from "./allDiscountedProducts";
import { favoriteProducts } from "./favoriteProducts";
import { productReview } from "./productReview";
import { productsLessThen20 } from "./fetchProductPriceLess20";
import { searchProducts } from "./searchProducts";
import { deleteAutoProductDiscount } from "./deleteAutoProductDiscounts";

export const productQueries = {
  allNewProducts,
  productsByCategory,
  productById,
  productDiscount,
  productsDiscounts,
  favoriteProducts,
  productReview,
  productsLessThen20,
  searchProducts,
  deleteAutoProductDiscount,
};
