import { deleteProduct } from "./deleteProduct";
import { updateProduct } from "./updateProduct";
import { createProduct } from "./createProduct";
import { addDeleteProductToFavorite } from "./addDeleteProductToFavorite";
import { sellProduct } from "./sellProduct";
import { undoSellProduct } from "./undoSellProduct";
import { deleteProductDiscount } from "./deleteProductDiscount";
import { addProductInventory } from "./addProductInventory";
import { AddReview } from "./addReview";


export const productsMutations = {
  createProduct,
  updateProduct,
  deleteProduct,
  addDeleteProductToFavorite,
  deleteProductDiscount,
  undoSellProduct,
  sellProduct,
  AddReview, addProductInventory
};
