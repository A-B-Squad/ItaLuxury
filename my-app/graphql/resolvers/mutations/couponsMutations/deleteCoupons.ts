import { Context } from "@apollo/client";

// Resolver for deleting a coupons
export const deleteCoupons = async (
  _: any,
  { couponsIds }: { couponsIds: string[] },
  { prisma }: Context
) => {

  try {
    await prisma.coupons.deleteMany({
      where: {
        id: {
          in: couponsIds,
        },
      },
    });
    return "coupons deleted";
  } catch (error) {
    console.error("Error deleting coupons:", error);
    return error;
  }
};
