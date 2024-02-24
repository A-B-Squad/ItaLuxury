import { Context } from "@/pages/api/graphql";

export const addToBasket = async (
  _: any,
  { input }: { input: addToBasketInput },
  { prisma }: Context
) => {
  try {
    const { userId, productId, quantity } = input;
    const basket = prisma.basket.create({
      data: {
        userId,
        productId,
        quantity,
      },
      include: {
        Product: true,
        User: true,
      },
    });
    return basket;
  } catch (error) {
    console.error("Failed to add product to basket:", error);
    return new Error("Failed to add product to basket");
  }
};
