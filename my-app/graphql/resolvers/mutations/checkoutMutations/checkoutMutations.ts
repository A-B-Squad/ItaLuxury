import { createCheckout } from "./createCheckout";
import { updateCustomerCheckout } from "./updateCustomerCheckout";
import { updateProductInCheckout } from "./updateProductInCheckout";

export const checkoutMutations = {
  createCheckout,
  updateProductInCheckout,
  updateCustomerCheckout,
};
