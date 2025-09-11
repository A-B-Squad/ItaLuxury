import { deleteProduct } from "./deleteProduct";
import { updateProduct } from "./updateProduct";
import { createProduct } from "./createProduct";
import { addDeleteProductToFavorite } from "./addDeleteProductToFavorite";
import { sellProduct } from "./sellProduct";
import { undoSellProduct } from "./undoSellProduct";
import { deleteProductDiscount } from "./deleteProductDiscount";
import { addProductInventory } from "./addProductInventory";
import { AddReview } from "./addReview";
import { createGroupProductVariant } from "./createGroupProductVariant";
import { updateGroupProductVariant } from "./updateGroupProductVariant";
import { deleteGroupProductVariant } from "./deleteGroupProductVariant";


export const productsMutations = {
  createProduct,
  updateProduct,
  deleteProduct,
  addDeleteProductToFavorite,
  deleteProductDiscount,
  undoSellProduct,
  sellProduct,
  AddReview, addProductInventory, createGroupProductVariant, updateGroupProductVariant,deleteGroupProductVariant
};
