import { Context } from "@/pages/api/graphql";
import moment from 'moment-timezone'; 

const DEFAULT_TIMEZONE = 'Africa/Tunis'; 

export const products = async (_: any, { limit }: { limit?: number }, { prisma }: Context) => {
    try {
        let takeValue = Number(limit) ? Number(limit) : undefined;

        const products = await prisma.product.findMany({
            where: {
                // isVisible: true
            },
            include: {
                categories: { include: { subcategories: { include: { subcategories: true } } } },
                productDiscounts: {
                    include: {
                        Discount: true
                    }
                },
                baskets: true,
                reviews: true,
                favoriteProducts: true,
                attributes: true,
                Colors: true,
                Brand: true
            },
            take: takeValue
        });

     
        return products;
    } catch (error) {
        console.log('Failed to fetch products', error);
        return error;
    }
};
