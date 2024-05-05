import { Context } from "@/pages/api/graphql";

export const allDeals = async (_: any, __: any, { prisma }: Context) => {
    try {

        const products = await prisma.topDeals.findMany({
            include: {
                product: {
                    
                    include: {
                        productDiscounts: {
                            include: { Discount: true }
                        }, Colors: true, attributes: true, categories: {
                            include: {
                                subcategories: {
                                    include: { subcategories: true }
                                }
                            }
                        }
                    }
                }

            },
        });
        return products;
    } catch (error) {
        console.log('Failed to fetch products', error);
        return (error);
    }
};
