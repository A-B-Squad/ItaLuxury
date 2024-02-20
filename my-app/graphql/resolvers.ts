import { userMutations } from "./resolvers/mutations/userMutations/userMutations";
import { categoryMutations } from "./resolvers/mutations/categoryMutations/categoryMutations";
import { basketMutations } from "./resolvers/mutations/basketMutations/basketMutations";
import { checkoutMutations } from "./resolvers/mutations/checkoutMutations/checkoutMutations";
import { productQueries } from "./resolvers/queries/productQueries/productQueries";
export const resolvers = {
  Query: {
    ...productQueries,
  },

  Mutation: {
    ...userMutations,
    ...categoryMutations,
    ...basketMutations,
    ...checkoutMutations,
  },
};
