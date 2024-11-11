import { Context } from "@/pages/api/graphql";

export const fetchMainCategories = async (_: any, __: any, { prisma }: Context
) => {
    try {
        const categories = await prisma.category.findMany({
            where: { parentId: null },

            include: {
                subcategories: true 
            }
        });

        return categories;
    } catch (error) {
        console.log('Failed to fetch categories', error);
        throw new Error('Failed to fetch categories');
    }
};

