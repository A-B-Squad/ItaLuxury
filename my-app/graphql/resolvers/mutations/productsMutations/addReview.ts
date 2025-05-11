import { Context } from "@/pages/api/graphql";

export const AddReview = async (
  _: any,
  {
    input,
  }: {
    input: {
      productId: string;
      userId?: string;
      rating: number;
      comment?: string;
      userName?: string;
    }
  },
  { prisma }: Context
) => {
  try {
    const { productId, userId, rating, comment, userName } = input;

    // Check if the product exists
    const productExists = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
    if (!productExists) {
      return "Product not found.";
    }

    // Create review data object
    const reviewData: any = {
      rating,
      productId,
    };

    // Add comment if provided
    if (comment) {
      reviewData.comment = comment;
    }

    // Handle registered user case
    if (userId) {
      // Check if the user exists
      const userExists = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!userExists) {
        return "User not found.";
      }

      reviewData.userId = userId;
      reviewData.userName = userExists.fullName;

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
          data: reviewData,
        });

        return "Rating updated successfully.";
      }
    }
    // Handle anonymous user case
    else {
      if (!userName) {
        return "Anonymous reviews require name .";
      }

      reviewData.userName = userName;
    }

    // Create new review
    await prisma.review.create({
      data: reviewData,
    });

    return "Rating added successfully.";
  } catch (error) {
    console.error("Error adding rating:", error);
    return `Failed to add rating: ${error}`;
  }
};
