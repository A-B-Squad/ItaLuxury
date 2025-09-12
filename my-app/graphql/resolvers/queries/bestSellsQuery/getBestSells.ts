import { Context } from "@apollo/client";

export const getBestSells = async (
  _: any,
  __: any,
  { prisma }: Context
) => {
  try {
    const bestSales = await prisma.bestSales.findMany({
      include: {
        Product: {
          include: {
            categories: true, productDiscounts: true,
          }
        },
        Category: true
      },

    });
    return bestSales;
  } catch (error) {
    console.error("Error fetching best sales:", error);
    throw new Error("Failed to fetch best sales");
  }
};
