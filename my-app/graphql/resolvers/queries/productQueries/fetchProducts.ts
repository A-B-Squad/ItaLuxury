import { Context } from "@/pages/api/graphql";

export const products = async (_: any, { limit }: { limit?: number }, { prisma }: Context) => {
    try {
        let takeValue = limit ? limit : undefined;

        const products = await prisma.product.findMany({
            include: {
                categories: { include: { subcategories: true } }, // Include categories related to products
                productDiscounts: {
                    include: {
                        Discount: true // Include discount related to ProductDiscounts

                    }
                }, // Include product discount related to products
                baskets: true, // Include baskets related to products
                reviews: true, // Include reviews related to products
                favoriteProducts: true, // Include favorite products related to products
                attributes: true,// Include attributes related to products
                Colors: true
            },
            take: takeValue // Limit the number of products to the value of takeValue
        });
        return products;
    } catch (error) {
        console.log('Failed to fetch products', error);
        return (error);
    }
};
