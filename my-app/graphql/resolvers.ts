import { userMutations } from "./resolvers/mutations/userMutations/userMutations";
import { productsMutations } from "./resolvers/mutations/productsMutations/productsMutations";
import { categoryMutations } from "./resolvers/mutations/categoryMutations/categoryMutations";
import { basketMutations } from "./resolvers/mutations/basketMutations/basketMutations";
import { checkoutMutations } from "./resolvers/mutations/checkoutMutations/checkoutMutations";
import { productQueries } from "./resolvers/queries/productQueries/productQueries";
import { categoryQueries } from "./resolvers/queries/categoryQueries/categoryQueries";
import { basketQueries } from "./resolvers/queries/basketQueries/basketQueries";
import { checkoutQueries } from "./resolvers/queries/checkoutQueries/checkoutQueries";
export const resolvers = {
  Query: {
    ...productQueries,
    ...categoryQueries,
    ...basketQueries,
    ...checkoutQueries
  },

  Mutation: {
    ...userMutations,
    ...productsMutations,
    ...categoryMutations,
    ...basketMutations,
    ...checkoutMutations,
  },
};
