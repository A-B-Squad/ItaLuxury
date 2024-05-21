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

    const alreadyFavoriteProduct = await prisma.favoriteProducts.findFirst({ where: { userId: userId, productId: productId } })

    if (!userExists) {
      return new Error(`User with ID ${userId} does not exist.`);
    }

    if (!productExists) {
      return new Error(`Product with ID ${productId} does not exist.`);
    }
    if (alreadyFavoriteProduct) {
      const deleteFromFavorite = await prisma.favoriteProducts.deleteMany({ where: { userId: userId, productId: productId } })
    } else {

      const favoriteProduct = await prisma.favoriteProducts.create({
        data: {
          userId,
          productId,
        },
      });
      return favoriteProduct;
    }
    // Add the product to the user's favorite products

  } catch (error: any) {
    console.error("Error adding product to favorite:", error);
    return `Failed to add product to favorite: ${error}.`;
  }
};
