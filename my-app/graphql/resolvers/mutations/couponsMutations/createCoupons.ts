import { Context } from "@/pages/api/graphql";

// Resolver for deleting a coupons
export const createCoupons = async (
    _: any,
  { input }: any,
  { prisma }: Context
) => {
  const { code, discount } = input;
  console.log(input);
  
  try {
    await prisma.coupons.create({
      data: {
        code,
        discount,
        available: true,
      },
    });
    return "coupons created";
  } catch (error) {
    console.error("Error deleting coupons:", error);
    return error;
  }
};
