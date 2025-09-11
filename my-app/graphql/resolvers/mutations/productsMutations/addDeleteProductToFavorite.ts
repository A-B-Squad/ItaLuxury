import { Context } from "@apollo/client";

export const addDeleteProductToFavorite = async (
  _: any,
  { input }: { input: AddDeleteProductToFavorite },
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
      return `User with ID ${userId} does not exist.`
    }

    if (!productExists) {
      return `Product with ID ${productId} does not exist.`

    }

    const alreadyFavoriteProduct = await prisma.favoriteProducts.findFirst({
      where: { userId: userId, productId: productId }
    });

    if (alreadyFavoriteProduct) {
      // Delete from favorites
      await prisma.favoriteProducts.deleteMany({
        where: { userId: userId, productId: productId }
      });

      return "Product removed from favorites successfully."
    } else {
      // Add to favorites
      await prisma.favoriteProducts.create({
        data: {
          userId,
          productId,
        },
      });

      return "Product added to favorites successfully."

    }

  } catch (error: any) {
    console.error("Error managing product favorite:", error);
    return {
      success: false,
      message: `Failed to manage product favorite: ${error.message}`,
      action: null,
      data: null
    };
  }
};