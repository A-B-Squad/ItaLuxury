import { Context } from "@/pages/api/graphql";

export const addRating = async (
  _: any,
  {
    productId,
    userId,
    rating,
  }: { productId: string; userId: string; rating: number },
  {prisma}:Context
) => {
    try {
        // Check if the user exists
        const userExists = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });
        if (!userExists) {
          return("User not found.");
        }
    
        // Check if the product exists
        const productExists = await prisma.product.findUnique({
          where: {
            id: productId,
          },
        });
        if (!productExists) {
          return("Product not found.");
        }
    
        // Add the rating
        const newReview = await prisma.review.create({
          data: {
            rating: rating,
            userId: userId,
            productId: productId,
          },
        });
    
        return "Review added successfully.";
      } catch (error) {
        return(`Failed to add rating: ${error}`);
      }
};
