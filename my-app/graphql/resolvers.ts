import { userMutations } from "./resolvers/mutations/userMutations/userMutations";
import { productsMutations } from "./resolvers/mutations/productsMutations/productsMutations";
import { categoryMutations } from "./resolvers/mutations/categoryMutations/categoryMutations";
import { basketMutations } from "./resolvers/mutations/basketMutations/basketMutations";
import { checkoutMutations } from "./resolvers/mutations/checkoutMutations/checkoutMutations";
import { productQueries } from "./resolvers/queries/productQueries/productQueries";
import { categoryQueries } from "./resolvers/queries/categoryQueries/categoryQueries";
import { basketQueries } from "./resolvers/queries/basketQueries/basketQueries";
import { governorateQueries } from "./resolvers/queries/governorateQueries/governorateQueries";
import { packageMutations } from "./resolvers/mutations/packagesMutations/packagesMutations";
import { packageQueries } from "./resolvers/queries/packageQueries/packageQueries";
import { CompanyInfoQueries } from "./resolvers/queries/companyInfoQueries.ts/companyInfoQueries";
import { companyMutations } from "./resolvers/mutations/companyMutations/companyMutations";
import { advertismentQueries } from "./resolvers/queries/advertisementQueries/advertismentQueries";
import { adminMutations } from "./resolvers/mutations/adminMutations/adminMutations";
import { topDealsMutations } from "./resolvers/mutations/topDealsMutations/topDealsMutations";
import { dealsQueries } from "./resolvers/queries/topDealsQueries/dealsQueries";
import { colorsQueries } from "./resolvers/queries/colorsQueries/colorsQueries";
import { bestSalesQueries } from "./resolvers/queries/bestSellsQuery/bestSellsQueries";
import { BrandQueries } from "./resolvers/queries/BrandQuery/brandQueries";
import { SectionVisibilityMutations } from "./resolvers/mutations/sectionVisibilityMutations/SectionVisibilityMutations";
import { SectionQueries } from "./resolvers/queries/sectionVisibilityQueries/SectionVisibilityQueries";
import { contactUsMutations } from "./resolvers/mutations/conatctUsMutations/contactUsMutations";
import { contactUsQueries } from "./resolvers/queries/contactUsQueries/contactUsQueries";
import { usersQueries } from "./resolvers/queries/usersQueries/usersQueries";
import { couponsQueries } from "./resolvers/queries/coupons/couponsQueries";
import { advertismentMutations } from "./resolvers/mutations/advertisementMutations/advertismentMutations";
import { couponsMutations } from "./resolvers/mutations/couponsMutations/couponsMutations";
import { colorMutations } from "./resolvers/mutations/colorsMutations/colorsMutations";
import { brandMutations } from "./resolvers/mutations/brandMutations/brandMutations";
import { bestSellsMutations } from "./resolvers/mutations/bestSellsMutations/bestSellsMutations";
import { apiCredentialsMutations } from "./resolvers/mutations/apiCredentialsMutations/apiCredentialsMutations";
import { apiCredentialsQueries } from "./resolvers/queries/apiCredentialsQueries/apiCredentialsQueries";
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
    ...colorsQueries,
    ...bestSalesQueries,
    ...BrandQueries,
    ...SectionQueries,
    ...contactUsQueries,
    ...usersQueries,
    ...couponsQueries,
    ...apiCredentialsQueries,
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
    ...topDealsMutations,
    ...SectionVisibilityMutations,
    ...contactUsMutations,
    ...advertismentMutations,
    ...couponsMutations,
    ...colorMutations,
    ...brandMutations,
    ...bestSellsMutations,
    ...apiCredentialsMutations,
  },
};
