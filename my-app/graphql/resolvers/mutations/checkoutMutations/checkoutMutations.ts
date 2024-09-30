import { createCheckout } from "./createCheckout";
import { createCheckoutFromAdmin } from "./createCheckoutFromAdmin";
import { updateCustomerCheckout } from "./updateCustomerCheckout";
import { updateCheckout } from "./updateCheckout";

export const checkoutMutations = {
  createCheckout,
  updateCheckout,
  updateCustomerCheckout,
  createCheckoutFromAdmin
};
