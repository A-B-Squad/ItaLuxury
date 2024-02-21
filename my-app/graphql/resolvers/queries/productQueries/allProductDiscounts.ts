import { Context } from "@/pages/api/graphql";


export const productsDiscounts = async (_: any, __: any, { prisma }: Context) => {
    try {
        // Retrieve all product discounts
        const allProductDiscounts = await prisma.productDiscount.findMany();

        return allProductDiscounts;
    } catch (error) {
        console.log('Failed to fetch product discounts:', error);
        throw new Error('Failed to fetch product discounts');
    }
};
