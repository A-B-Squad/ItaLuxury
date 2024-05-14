import { Context } from "@/pages/api/graphql";

export const addToBasket = async (
  _: any,
  { input }: { input: addToBasketInput },
  { prisma }: Context
) => {
  try {
    const { userId, productId, quantity } = input;

    // Check if the product is already in the basket
    const productInBasket = await prisma.basket.findUnique({
      where: {
        userId: userId,
        productId: productId
      },
    });

    if (!productInBasket) {
      // If the product is not in the basket, create a new entry
      const basket = await prisma.basket.create({
        data: {
          userId,
          productId,
          quantity,
        },
        include: {
          Product: true, // Include the product details in the response
          User: true,    // Include the user details in the response
        },
      });
      return basket
    } else {
      // If the product is already in the basket, update the quantity
      const updatedBasket = await prisma.basket.update({
        where: {
          userId: userId,
          productId: productId
        },
        data: {
          quantity: {
            increment: quantity,
          },
        },
        include: {
          Product: true,
          User: true,
        },
      });
      return updatedBasket;

    }

  } catch (error) {
    console.error("Failed to add product to basket:", error);
    return error
  }
};
