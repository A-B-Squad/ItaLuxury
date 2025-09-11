import { Context } from "@apollo/client";


export const categories = async (_: any, __: any, { prisma }: Context) => {
    try {
        const Categories = await prisma.category.findMany({
            where: { parentId: null },
            include: {
                subcategories: {
                    include: { subcategories: true },
                },
            },
        });

        return Categories;
    } catch (error) {
        console.log('Failed to fetch categories', error);
        throw new Error('Failed to fetch categories');
    }
};
