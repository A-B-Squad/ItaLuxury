import { Context } from "@apollo/client";

export const addProductToTopDeals = async (
    _: any,
    { productId }: { productId: string },
    { prisma }: Context
) => {
    try {
        await prisma.topDeals.create({
            data: {
                productId
            },
            include: {
                product: {
                    include: {
                        productDiscounts: true, Colors: true, categories: true
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
