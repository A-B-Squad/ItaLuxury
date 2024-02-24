import { Context } from "@/pages/api/graphql";


export const productColors = async (_: any, { productId }: { productId: string }, { prisma }: Context) => {
    try {
        // Retrieve product colors for the specified product ID
        const productColors = await prisma.colors.findMany({
            where: {
                products: {
                    some: {
                        id: productId
                    }
                }
            }
        });

        return productColors;
    } catch (error) {
        console.log(`Failed to fetch product colors for product ID ${productId}:`, error);
        return new Error(`Failed to fetch product colors for product ID ${productId}`);
    }
};
