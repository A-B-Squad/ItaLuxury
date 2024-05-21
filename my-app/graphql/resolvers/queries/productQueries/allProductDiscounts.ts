import { Context } from "@/pages/api/graphql";

export const productsDiscounts = async (_: any, { limit }: { limit?: number }, { prisma }: Context) => {
    try {
        // Retrieve all product discounts
        let takeValue = limit ? limit : undefined;

        const allProductDiscounts = await prisma.productDiscount.findMany({
            where: {
                product: {
                    isVisible: true
                }
            },
            include: {
                product: {
                    include: {
                        categories: { include: { subcategories: { include: { subcategories: true } } } },
                        productDiscounts: {
                            include: { Discount: true }
                        },
                        baskets: true,
                        reviews: true,
                        favoriteProducts: true,
                        attributes: true,
                        Colors: true,
                        Brand: true,

                    }
                },
                Discount: true
            },
            take: takeValue
        });

        const formattedProducts = allProductDiscounts.map(({ product }, Discount) => {
            return {
                id: product?.id,
                name: product?.name,
                price: product?.price,
                isVisible: product?.isVisible,
                reference: product?.reference,
                description: product?.description,
                inventory: product?.inventory,
                solde: product?.solde,
                images: product?.images,
                createdAt: product?.createdAt,
                attributes: product?.attributes,
                baskets: product?.baskets,
                categories: product?.categories,
                Brand: product?.Brand,
                Colors: product?.Colors,
                favoriteProducts: product?.favoriteProducts,
                reviews: product?.reviews,
                productDiscounts: product?.productDiscounts
            };
        });


        return formattedProducts;
    } catch (error) {
        console.log('Failed to fetch product discounts:', error);
        return new Error('Failed to fetch product discounts');
    }
};
