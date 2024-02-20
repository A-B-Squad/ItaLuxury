import { userMutations } from "./resolvers/mutations/userMutations/userMutations";
import { categoryMutations } from "./resolvers/mutations/categoryMutations/categoryMutations";
import { basketMutations } from "./resolvers/mutations/basketMutations/basketMutations";
import { checkoutMutations } from "./resolvers/mutations/checkoutMutations/checkoutMutations";
export const resolvers = {
  Query: {
    products() {

      return [];
    },
  },

  Mutation: {
    ...userMutations,
    ...categoryMutations,
    ...basketMutations,
    ...checkoutMutations
}
  
}


