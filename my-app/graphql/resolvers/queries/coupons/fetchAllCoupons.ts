import { Context } from "@/pages/api/graphql";

export const fetchAllCoupons = async (_: any, __: any, { prisma }: Context) => {
  try {
    const allCoupons = prisma.coupons.findMany();
    return allCoupons;
  } catch (error) {
    console.log(`Failed to fetch All coupons`, error);
    return new Error(`Failed to fetch All coupons`);
  }
};
