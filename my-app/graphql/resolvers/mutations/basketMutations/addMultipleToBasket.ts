import { Context } from "@/pages/api/graphql";
import { PrismaClient, Basket } from '@prisma/client';

const prisma = new PrismaClient();

interface ProductInputQuantity {
  productId: string;
  quantity: number;
}

interface AddMultipleToBasketInput {
  userId: string;
  products: ProductInputQuantity[];
}

export const addMultipleToBasket = async (
  _: any,
  { input }: { input: AddMultipleToBasketInput },
  { prisma }: Context
) => {
  try {
    const { userId, products } = input;

    const updatedBaskets: Basket[] = [];

    // Iterate over each product in the input array
    for (const { productId, quantity } of products) {
      // Check if the product is already in the user's basket
      const existingBasket = await prisma.basket.findFirst({
        where: {   
            userId,
            productId,
        },
      });

      if (existingBasket) {
        // If the product is already in the basket, update the quantity
        const updatedBasket = await prisma.basket.update({
          where: {
            id: existingBasket.id, // Use the basket ID for update
          },
          data: {
            quantity: {
              increment: quantity, // Increment the quantity
            },
          },
          include: {
            Product: true, // Include the product details in the response
            User: true, // Include the user details in the response
          },
        });
        updatedBaskets.push(updatedBasket);
      } else {
        // If the product is not in the basket, create a new entry
        const newBasket = await prisma.basket.create({
          data: {
            userId,
            productId,
            quantity,
          },
          include: {
            Product: true, // Include the product details in the response
            User: true, // Include the user details in the response
          },
        });
        updatedBaskets.push(newBasket);
      }
    }

    return "Products added successfully";
  } catch (error) {
    console.error("Failed to add products to basket:", error);
    throw new Error("Failed to add products to basket");
  }
};
