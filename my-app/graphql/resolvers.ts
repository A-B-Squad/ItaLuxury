import { userMutations } from "./resolvers/mutations/userMutations/userMutations";
import { productsMutations } from "./resolvers/mutations/productsMutations/productsMutations";
export const resolvers = {
  Query: {
    products() {
      return [];
    },
  },

  Mutation: {
    ...userMutations,
    ...productsMutations,
  },
};
