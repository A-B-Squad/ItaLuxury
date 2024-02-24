import { Context } from "@/pages/api/graphql";

export const productReview = async (_: any, { productId }: { productId: string }, { prisma }: Context) => {
    try {
        // Retrieve product review for the specified product ID
        const productReview = await prisma.review.findMany({
            where: {
                productId: productId
            }
        });

        return productReview;
    } catch (error) {
        console.log(`Failed to fetch product review for product ID ${productId}:`, error);
        return new Error(`Failed to fetch product review for product ID ${productId}`);
    }
};
