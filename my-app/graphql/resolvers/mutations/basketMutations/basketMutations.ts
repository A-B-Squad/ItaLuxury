import { addToBasket } from "./addToBasket";
import { removeProductFromBasket } from "./deleteProductFromBasket";
import { increaseQuantity } from "./increaseQuantity";
import { decreaseQuantity } from "./decreaseQuantity";
import { deleteBasketById } from "./deleteAllFromBasket";

export const basketMutations = {
  addToBasket,
  removeProductFromBasket,
  increaseQuantity,
  decreaseQuantity,
  deleteBasketById
};
