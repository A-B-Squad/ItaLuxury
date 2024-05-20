import { Context } from "@/pages/api/graphql";

export const products = async (_: any, { limit }: { limit?: number }, { prisma }: Context) => {
    try {
        let takeValue = limit ? limit : undefined;

        const products = await prisma.product.findMany({
            where: {
                isVisible: true
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

        for (const product of products) {
            const currentDate = new Date();

            const expiredDiscountIds = product.productDiscounts
                .filter(discount => {
                    const discountEndDate = new Date(discount.dateOfEnd);
                    return discountEndDate <= currentDate;
                })
                .map(expiredDiscount => expiredDiscount.id);

            if (expiredDiscountIds.length > 0) {
                await prisma.productDiscount.deleteMany({
                    where: {
                        id: {
                            in: expiredDiscountIds
                        }
                    }
                });
            }

            const validProductDiscounts = product.productDiscounts.filter(discount => {
                const discountEndDate = new Date(discount.dateOfEnd);
                return discountEndDate > currentDate;
            });

            await prisma.product.update({
                where: { id: product.id },
                data: {
                    productDiscounts: {
                        set: validProductDiscounts.map(validDiscount => ({ id: validDiscount.id }))
                    }
                }
            });
        }

        return products;
    } catch (error) {
        console.log('Failed to fetch products', error);
        return error;
    }
};
