import { Context } from "@/pages/api/graphql";
import moment from 'moment-timezone'; // Import Moment Timezone

const DEFAULT_TIMEZONE = 'Africa/Tunis'; // Set default timezone to Tunisia

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
            const currentDateDefaultTZ = moment().tz(DEFAULT_TIMEZONE); // Get current date in the default timezone

            const expiredDiscountIds = product.productDiscounts
                .filter(discount => {
                    const discountEndDate = moment.tz(discount.dateOfEnd, DEFAULT_TIMEZONE); // Convert discount end date to moment object in default timezone
                    return discountEndDate.isSameOrBefore(currentDateDefaultTZ); // Check if discount has expired
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
                const discountEndDate = moment.tz(discount.dateOfEnd, DEFAULT_TIMEZONE); // Convert discount end date to moment object in default timezone
                return discountEndDate.isAfter(moment()); // Check if discount is still valid
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
