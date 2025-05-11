import { Context } from "@/pages/api/graphql";

// Resolver for creating a coupon
export const createCoupons = async (
    _: any,
  { input }: any,
  { prisma }: Context
) => {
  const { code, discount } = input;
  
  const parsedDiscount = Number(discount);

  // Vérification stricte
  if (isNaN(parsedDiscount) || parsedDiscount <= 0) {
    throw new Error("Valeur de réduction invalide");
  }
  try {
    await prisma.coupons.create({
      data: {
        code,
        discount: parsedDiscount,
        available: true,
      },  
    });
    return "coupons created";
  } catch (error) {
    console.error("Error creating coupon:", error);
    return error;
  }
};
