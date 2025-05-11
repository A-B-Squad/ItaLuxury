import { Context } from "@/pages/api/graphql";

export const deleteReview = async (
  _: any,
  { reviewId }: { reviewId: string },
  { prisma }: Context
) => {
  try {
    // Check if the review exists
    const reviewExists = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!reviewExists) {
      return new Error(`Review with ID ${reviewId} does not exist.`);
    }

    // Delete the review
    await prisma.review.delete({
      where: { id: reviewId },
    });

    return true;
  } catch (error: any) {
    console.error("Error deleting review:", error);
    return new Error(`Failed to delete review: ${error.message}`);
  }
};