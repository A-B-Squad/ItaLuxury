import { Context } from "@/pages/api/graphql";

export const addProductToTopDeals = async (
    _: any,
    { productId }: { productId: string },
    { prisma }: Context
) => {
    try {
        const createdTopDeal = await prisma.topDeals.create({
            data: {
                productId
            },
            include: {
                product: {
                    include: {
                        productDiscounts: true, Colors: true, attributes: true, categories: true
                    }
                }
            }
        });

        return "product Added to Top Deals";
    } catch (error: any) {
        console.error("Error creating TopDeals:", error);
        throw error; // Rethrow the error to be caught by the caller
    }
};
