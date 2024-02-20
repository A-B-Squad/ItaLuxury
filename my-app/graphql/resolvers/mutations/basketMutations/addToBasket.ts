import { Context } from "@/pages/api/graphql";

export const addToBasket = async (
  _: any,
  { userId, productId }: { userId: string; productId: string },
  { prisma }: Context
) => {
  try {
    const basket = prisma.basket.create({
      data: {
        userId,
        productId,
      },
      include: {
        Product: true,
        User: true,
      },
    });
    return basket;
  } catch (error) {
    console.error("Failed to add product to basket:", error);
    throw new Error("Failed to add product to basket");
  }
};
