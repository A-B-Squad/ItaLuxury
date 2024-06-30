import { Context } from "@/pages/api/graphql";

export const fetchAllCoupons = async (
  _: any,
  { page, pageSize }: any,
  { prisma }: Context,
) => {
  try {
    console.log(page);
    console.log(pageSize);
    
    //  Calculate skip based on page and pageSize
    const skip = (page - 1) * pageSize;
    const allCoupons = prisma.coupons.findMany({
      include: {
        checkout: {
          include: { products: true },
        },
      },
      take: pageSize,
      skip,
    });
    return allCoupons;
  } catch (error) {
    console.log(`Failed to fetch All coupons`, error);
    return new Error(`Failed to fetch All coupons`);
  }
};
