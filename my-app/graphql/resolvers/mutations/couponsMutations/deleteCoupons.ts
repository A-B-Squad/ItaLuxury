import { Context } from "@/pages/api/graphql";

// Resolver for deleting a coupons
export const deleteCoupons = async (
  _: any,
  { couponsId }: { couponsId: string },
  { prisma }: Context
) => {
  console.log(couponsId);
  
  try {
    await prisma.coupons.delete({
      where: { id: couponsId },
    });
    return "coupons deleted";
  } catch (error) {
    console.error("Error deleting coupons:", error);
    return error;
  }
};
