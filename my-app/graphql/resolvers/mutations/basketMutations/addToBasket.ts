import { Context } from "@apollo/client";

export const addToBasket = async (
  _: any,
  { input }: { input: addToBasketInput },
  { prisma }: Context
) => {
  try {
    const { userId, productId, quantity } = input;

    // Check if the product is already in the basket
    const productInBasket = await prisma.basket.findMany({
      where: {
        userId: userId,
        productId: productId
      },
    });

    if (!productInBasket.length) {
      // If the product is not in the basket, create a new entry
      const basket = await prisma.basket.create({
        data: {
          userId,
          productId,
          quantity,
        },
      });

      // Fetch the related Product and User details
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      return { ...basket, product, user };
    } else {
      // If the product is already in the basket, update the quantity
      await prisma.basket.updateMany({
        where: {
          userId: userId,
          productId: productId
        },
        data: {
          quantity: {
            increment: quantity,
          },
        },
      });

      // Fetch the updated basket details
      const basket = await prisma.basket.findMany({
        where: {
          userId: userId,
          productId: productId
        },
      });

      // Fetch the related Product and User details
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      return { ...basket[0], product, user };
    }

  } catch (error) {
    console.error("Failed to add product to basket:", error);
    throw new Error("Failed to add product to basket");
  }
};
