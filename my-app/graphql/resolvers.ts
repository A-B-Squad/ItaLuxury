import { userMutations } from "./resolvers/mutations/userMutations/userMutations";

export const resolvers = {
  Query: {
    products() {

      return [];
    },
  },

  Mutation: {
    ...userMutations
}
  
}

};
