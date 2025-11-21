import { Context } from "@apollo/client";

export const fetchMainCategories = async (
    _: any,
    __: any,
    { prisma }: Context
) => {
    try {
        const categories = await prisma.category.findMany({
            where: {
                parentId: null,
            },
            include: {
                subcategories: {
                    include: {
                        subcategories: true,
                    },
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
            orderBy: {
                order: 'asc',
            },
        });

        return categories;
    } catch (error) {
        console.error("Error fetching main categories:", error);
        throw new Error("Failed to fetch categories");
    }
};