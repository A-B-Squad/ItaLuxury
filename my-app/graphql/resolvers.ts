import { userMutations } from "./resolvers/mutations/userMutations/userMutations";
import { productsMutations } from "./resolvers/mutations/productsMutations/productsMutations";
import { categoryMutations } from "./resolvers/mutations/categoryMutations/categoryMutations";
import { basketMutations } from "./resolvers/mutations/basketMutations/basketMutations";
import { checkoutMutations } from "./resolvers/mutations/checkoutMutations/checkoutMutations";
import { productQueries } from "./resolvers/queries/productQueries/productQueries";
import { categoryQueries } from "./resolvers/queries/categoryQueries/categoryQueries";
import { basketQueries } from "./resolvers/queries/basketQueries/basketQueries";
import { governorateQueries } from './resolvers/queries/governorateQueries/governorateQueries';
import { packageMutations } from "./resolvers/mutations/packagesMutations/packagesMutations";
import { packageQueries } from "./resolvers/queries/packageQueries/packageQueries";
import { CompanyInfoQueries } from "./resolvers/queries/companyInfoQueries.ts/companyInfoQueries";
import { companyMutations } from "./resolvers/mutations/companyMutations/companyMutations";
import { advertismentQueries } from "./resolvers/queries/advertisementQueries/advertismentQueries";
import { adminMutations } from "./resolvers/mutations/adminMutations/adminMutations";
import { topDealsMutations } from "./resolvers/mutations/topDealsMutations/topDealsMutations";
import { dealsQueries } from './resolvers/queries/topDealsQueries/dealsQueries';
import { colorsQueries } from "./resolvers/queries/colorsQueries/colorsQueries";
export const resolvers = {
  Query: {
    ...productQueries,
    ...categoryQueries,
    ...basketQueries,
    ...governorateQueries,
    ...packageQueries,
    ...CompanyInfoQueries,
    ...advertismentQueries,
    ...dealsQueries,
    ...colorsQueries
  },

  Mutation: {
    ...userMutations,
    ...productsMutations,
    ...categoryMutations,
    ...basketMutations,
    ...checkoutMutations,
    ...packageMutations,
    ...companyMutations,
    ...adminMutations, 
    ...topDealsMutations
  },
};
