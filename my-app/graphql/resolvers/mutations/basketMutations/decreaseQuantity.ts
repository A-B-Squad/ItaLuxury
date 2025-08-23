import { Context } from "@apollo/client";

export const decreaseQuantity = async (
  _: any,
  { basketId }: { basketId: string },
  { prisma }: Context
) => {
  try {
    // Find the basket by its ID
    const basket = await prisma.basket.findUnique({ where: { id: basketId } });

    // If the basket doesn't exist, return an error
    if (!basket) {
      return new Error("Basket not found");
    }

    // Check if productId is null
    if (basket.productId === null) {
      return new Error("Product ID is null");
    }

    // Fetch the product by its ID
    const product = await prisma.product.findUnique({ where: { id: basket.productId } });

    // If the product doesn't exist or there's not enough inventory, return an error
    if (!product || basket.quantity <= 1) {
      return new Error("Not enough inventory");
    }

    // Update the quantity of the basket by decrementing it by 1
    const updatedBasket = await prisma.basket.update({
      where: { id: basketId },
      data: {
        quantity: {
          decrement: 1,
        },
      },
    });

    // Return the updated basket
    return updatedBasket;
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error decreasing quantity:", error);
    return new Error("Failed to decrease quantity");
  }
};