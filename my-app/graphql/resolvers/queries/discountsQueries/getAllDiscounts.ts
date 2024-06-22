import { Context } from "@/pages/api/graphql";



export const DiscountsPercentage = async (
  _: any,
  __: any,
  { prisma }: Context
) => {
  try {
    const discountPercentage = await prisma.discount.findMany();
    return discountPercentage;
  } catch (error) {
    console.error("Error fetching discountPercentage:", error);
    throw new Error("Failed to fetch discountPercentage");
  }
};
