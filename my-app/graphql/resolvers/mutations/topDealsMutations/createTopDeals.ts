import { Context } from "@/pages/api/graphql";

export const createTopDeals = async (
    _: any,
    { input }: { input: addTopDealProduct },
    { prisma }: Context
) => {
    try {
        const { productId } = input;
        const createdTopDeal = await prisma.topDeals.create({
            data: {
                productId
            },
            include: {
                product: {
                    include: {
                        productDiscounts: {
                            include: { Discount: true }
                        }, Colors: true, attributes: true, categories: true
                    }
                }
            }
        });

        return createdTopDeal;
    } catch (error: any) {
        console.error("Error creating TopDeals:", error);
        throw error; // Rethrow the error to be caught by the caller
    }
};
