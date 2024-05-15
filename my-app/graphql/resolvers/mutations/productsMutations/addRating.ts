import { Context } from "@/pages/api/graphql";

export const addRating = async (
  _: any,
  {
    productId,
    userId,
    rating,
  }: { productId: string; userId: string; rating: number },
  { prisma }: Context
) => {
  try {
    // Check if the user exists
    const userExists = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!userExists) {
      return "User not found.";
    }

    // Check if the product exists
    const productExists = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
    if (!productExists) {
      return "Product not found.";
    }

    // Check if the user has already rated the product
    const existingReview = await prisma.review.findFirst({
      where: {
        productId: productId,
        userId: userId,
      },
    });

    if (existingReview) {
      // If the user has already rated the product, update the existing rating
      await prisma.review.update({
        where: {
          id: existingReview.id,
        },
        data: {
          rating: rating,
        },
      });

      return "Rating updated successfully.";
    } else {
      // If the user has not rated the product yet, add a new rating
      await prisma.review.create({
        data: {
          rating: rating,
          userId: userId,
          productId: productId,
        },
      });

      return "Rating added successfully.";
    }
  } catch (error) {
    return `Failed to add rating: ${error}`;
  }
};
