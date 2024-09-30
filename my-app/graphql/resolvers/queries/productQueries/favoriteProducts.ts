import { Context } from "@/pages/api/graphql";

export const favoriteProducts = async (
  _: any,
  { userId }: { userId: string },
  { prisma }: Context
) => {
  try {
    // Retrieve favorite products for the specified user ID
    const userFavoriteProducts = await prisma.favoriteProducts.findMany({
      where: {
        userId: userId,
      },
      include: {
        Product: {
          include: {
            categories: {
              include: { subcategories: { include: { subcategories: true } } },
            },
            Brand: true,
            productDiscounts: true,
        
          },
        },
      },
    });
    return userFavoriteProducts;
  } catch (error) {
    console.log(
      `Failed to fetch favorite products for user ID ${userId}:`,
      error
    );
    return new Error(`Failed to fetch favorite products for user ID ${userId}`);
  }
};
