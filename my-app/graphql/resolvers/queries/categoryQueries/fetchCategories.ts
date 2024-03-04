import { Context } from "@/pages/api/graphql";

const fetchCategoriesRecursively = async (prisma: any, parentId: string | null): Promise<any[]> => {
    try {
        const categories = await prisma.category.findMany({
            where: { parentId },
            include: {
                subcategories: true

            }
        });

        const categoriesWithSubcategories = await Promise.all(
            categories.map(async (category: any) => {
                const subcategories = await fetchCategoriesRecursively(prisma, category.id);
                return { ...category, subcategories };
            })
        );

        return categoriesWithSubcategories;
    } catch (error) {
        console.log('Failed to fetch categories', error);
        throw new Error('Failed to fetch categories');
    }
};

export const categories = async (_: any, __: any, { prisma }: Context) => {
    try {
        const rootCategories = await fetchCategoriesRecursively(prisma, null);
        return rootCategories;
    } catch (error) {
        console.log('Failed to fetch categories', error);
        throw new Error('Failed to fetch categories');
    }
};
