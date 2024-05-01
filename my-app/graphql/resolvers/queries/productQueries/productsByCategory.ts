import { Context } from "@/pages/api/graphql";

export const productsByCategory = async (_: any, { categoryName }: { categoryName: string }, { prisma }: Context) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                categories: {
                    some: {
                        name: categoryName
                    }
                }
            },
            include: {
                categories: { include: { subcategories: { include: { subcategories: true } } } }, // Include categories related to products

                productDiscounts: true, // Include product discount related to products
                baskets: true, // Include baskets related to products
                reviews: true, // Include reviews related to products
                favoriteProducts: true, // Include favorite products related to products
                Colors: true, // Include colors related to products
                attributes: true // Include attributes related to products
            }
        });
        return products;
    } catch (error) {
        console.log(`Failed to fetch products for category ${categoryName}`, error);
        return new Error(`Failed to fetch products for category ${categoryName}`);
    }
};
