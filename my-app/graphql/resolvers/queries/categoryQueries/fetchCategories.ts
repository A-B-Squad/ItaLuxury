import { Context } from "@/pages/api/graphql";

export const categories = async (_: any, __: any, { prisma }: Context) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                products: true, // Include products related to categories
                subcategories: true // Include subcategories related to categories
            }
        });
        return categories;
    } catch (error) {
        console.log('Failed to fetch categories', error);
        return new Error('Failed to fetch categories');
    }
};
