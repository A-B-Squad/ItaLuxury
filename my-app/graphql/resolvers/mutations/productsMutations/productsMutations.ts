import { deleteProduct } from "./deleteProduct";
import { updateProduct } from "./updateProduct";
import { createProduct } from "./createProduct";
import { addProductToFavorite } from "./addProductToFavorite";
import { sellProduct } from "./sellProduct";
import { undoSellProduct } from "./undoSellProduct";
import { deleteProductDiscount } from "./deleteProductDiscount";
import { addRating } from "./addRating";
import { addProductInventory } from "./addProductInventory";

export const productsMutations = {
  createProduct,
  updateProduct,
  deleteProduct,
  addProductToFavorite,
  deleteProductDiscount, 
  undoSellProduct, 
  sellProduct,
  addRating,addProductInventory
};
