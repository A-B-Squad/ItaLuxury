import { Context } from "@/pages/api/graphql";

export const basketByUserId = async (
  _: any,
  { userId }: { userId: string },
  { prisma }: Context
) => {
  try {
    const basket = await prisma.basket.findFirst({
      where: {
        userId: userId
      },
      include: {
        User: true, // Include user related to basket
        Product: true, // Include products related to basket
        checkout: true // Include checkout related to basket
      }
    });

    if (!basket) {
      throw new Error(`Basket for user with ID ${userId} not found`);
    }

    return basket;
  } catch (error) {
    console.log(`Failed to fetch basket for user with ID ${userId}`, error);
    throw new Error(`Failed to fetch basket for user with ID ${userId}`);
  }
};
