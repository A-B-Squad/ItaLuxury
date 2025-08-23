import { Context } from "@apollo/client";

export const fetchAllBasket = async (_: any, __: any, { prisma }: Context) => {
  try {
    const basket = await prisma.basket.findMany({
      include: {
        User: true,
        Product: {
          include: {
            productDiscounts: true,
            categories: {
              include: { subcategories: { include: { subcategories: true } } },
            },
          },
        },
      },
    });

    return basket;
  } catch (error) {
    console.log(`Failed to fetch All basket `, error);
    return new Error(`Failed to fetch All basket `);
  }
};
