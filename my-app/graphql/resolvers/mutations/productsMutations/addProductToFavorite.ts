import { Context } from "@/pages/api/graphql";

export const addProductToFavorite = async (
  _: any,
  { input }: { input: AddProductToFavoriteInput },
  { prisma }: Context
) => {
  try {
    const { userId, productId } = input;
    // Check if the user and product exist
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });
    const productExists = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!userExists) {
      return new Error(`User with ID ${userId} does not exist.`);
    }

    if (!productExists) {
      return new Error(`Product with ID ${productId} does not exist.`);
    }

    // Add the product to the user's favorite products
    const favoriteProduct = await prisma.favoriteProducts.create({
      data: {
        userId,
        productId,
      },
    });

    return favoriteProduct;
  } catch (error: any) {
    console.error("Error adding product to favorite:", error);
    return `Failed to add product to favorite: ${error}.`;
  }
};
