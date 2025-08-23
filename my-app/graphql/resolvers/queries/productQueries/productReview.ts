import { Context } from "@apollo/client";

export const productReview = async (
  _: any,
  { productId, userId }: { productId: string; userId?: string },
  { prisma }: Context
) => {
  try {
    if (userId) {
      // If user ID is provided, fetch reviews for the specified user and product
      const userProductReview = await prisma.review.findMany({
        where: {
          productId: productId,
          userId: userId,
        },
      });

      return userProductReview;
    } else {
      // If user ID is not provided, fetch all reviews for the specified product
      const allProductReviews = await prisma.review.findMany({
        where: {
          productId: productId,
        },
      });

      return allProductReviews;
    }
  } catch (error) {
    console.log(`Failed to fetch product review for product ID ${productId}:`, error);
    return new Error(`Failed to fetch product review for product ID ${productId}`);
  }
};
