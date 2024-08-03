import { createCheckout } from "./createCheckout";
import { createCheckoutFromAdmin } from "./createCheckoutFromAdmin";
import { updateCustomerCheckout } from "./updateCustomerCheckout";
import { updateProductInCheckout } from "./updateProductInCheckout";

export const checkoutMutations = {
  createCheckout,
  updateProductInCheckout,
  updateCustomerCheckout,createCheckoutFromAdmin
};
