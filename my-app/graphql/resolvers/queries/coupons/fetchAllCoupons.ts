import { Context } from "@/pages/api/graphql";
export const fetchAllCoupons = async (
  _: any,
  { page, pageSize }: any,
  { prisma }: Context,
) => {
  try {
    // Calculate skip based on page and pageSize
    const skip = (page - 1) * pageSize;
    
    // Get paginated coupons
    const coupons = await prisma.coupons.findMany({
      include: {
        checkout: {
          include: { productInCheckout: true },
        },
      },
      take: pageSize,
      skip,
    });
    
    // Get total count
    const totalCount = await prisma.coupons.count();
    
    return {
      coupons,
      totalCount
    };
  } catch (error) {
    console.log(`Failed to fetch All coupons`, error);
    return new Error(`Failed to fetch All coupons`);
  }
};