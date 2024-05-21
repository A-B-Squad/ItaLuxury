import { Context } from "@/pages/api/graphql";


export const productDiscount = async (_: any, { productId }: { productId: string }, { prisma }: Context) => {
    try {
        // Retrieve the product discount information based on productId
        const productDiscount = await prisma.productDiscount.findFirst({
            where: {
                productId: productId,
                product: {
                    isVisible: true
                }
            }
        });

        if (!productDiscount) {
            return new Error(`Product discount not found for product ID ${productId}`);
        }

        return productDiscount;
    } catch (error) {
        console.log(`Failed to fetch product discount for product ID ${productId}`, error);
        return new Error(`Failed to fetch product discount for product ID ${productId}`);
    }
};
