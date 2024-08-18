import { Context } from "@/pages/api/graphql";

export const basketByUserId = async (
  _: any,
  { userId }: { userId: string },
  { prisma }: Context
) => {
  try {
    const basket = await prisma.basket.findMany({
      where: {
        userId: userId
      },
      include: {
        User: true,
        Product: {

          include: {
            productDiscounts: true,
            categories: {
              include: { subcategories: { include: { subcategories: true } } },

            }
          }
        },

      }
    });

    if (!basket) {
      return new Error(`Basket for user with ID ${userId} not found`);
    }
    return basket;
  } catch (error) {
    console.log(`Failed to fetch basket for user with ID ${userId}`, error);
    return new Error(`Failed to fetch basket for user with ID ${userId}`);
  }
};
