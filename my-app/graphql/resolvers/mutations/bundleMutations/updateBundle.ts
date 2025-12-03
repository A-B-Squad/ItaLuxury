import { Context } from "@apollo/client";

export const updateBundle = async (
    _: any,
    {
        id,
        name,
        description,
        type,
        status,
        startDate,
        endDate,
        minPurchaseAmount,
        minQuantity,
        requiredProductRefs,
        anyProductRefs,
        requiredCategoryIds,
        requiredBrandIds,
        requireAllProducts,
        freeProductQuantity,
        freeProductRef,
        discountPercentage,
        discountAmount,
        applyDiscountTo,
        givesFreeDelivery,
        giftProductRef,
        giftQuantity,
        maxUsagePerUser,
        maxUsageTotal,
    }: {
        id: string;
        name?: string;
        description?: string;
        type?: 'BUY_X_GET_Y_FREE' | 'PERCENTAGE_OFF' | 'FIXED_AMOUNT_OFF' | 'FREE_DELIVERY' | 'FREE_GIFT';
        status?: 'ACTIVE' | 'INACTIVE';
        startDate?: string;
        endDate?: string;
        minPurchaseAmount?: number;
        minQuantity?: number;
        requiredProductRefs?: string[];
        anyProductRefs?: string[];
        requiredCategoryIds?: string[];
        requiredBrandIds?: string[];
        requireAllProducts?: boolean;
        freeProductQuantity?: number;
        freeProductRef?: string;
        discountPercentage?: number;
        discountAmount?: number;
        applyDiscountTo?: string;
        givesFreeDelivery?: boolean;
        giftProductRef?: string;
        giftQuantity?: number;
        maxUsagePerUser?: number;
        maxUsageTotal?: number;
    },
    { prisma }: Context
) => {
    try {
        const updateData: any = {};

        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (type !== undefined) updateData.type = type;
        if (status !== undefined) updateData.status = status;
        if (startDate !== undefined) updateData.startDate = new Date(startDate);
        if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;

        // Conditions
        if (minPurchaseAmount !== undefined) updateData.minPurchaseAmount = minPurchaseAmount;
        if (minQuantity !== undefined) updateData.minQuantity = minQuantity;
        if (requiredProductRefs !== undefined) updateData.requiredProductRefs = requiredProductRefs;
        if (anyProductRefs !== undefined) updateData.anyProductRefs = anyProductRefs;
        if (requiredCategoryIds !== undefined) updateData.requiredCategoryIds = requiredCategoryIds;
        if (requiredBrandIds !== undefined) updateData.requiredBrandIds = requiredBrandIds;
        if (requireAllProducts !== undefined) updateData.requireAllProducts = requireAllProducts;

        // Rewards
        if (freeProductQuantity !== undefined) updateData.freeProductQuantity = freeProductQuantity;
        if (freeProductRef !== undefined) updateData.freeProductRef = freeProductRef;
        if (discountPercentage !== undefined) updateData.discountPercentage = discountPercentage;
        if (discountAmount !== undefined) updateData.discountAmount = discountAmount;
        if (applyDiscountTo !== undefined) updateData.applyDiscountTo = applyDiscountTo;
        if (givesFreeDelivery !== undefined) updateData.givesFreeDelivery = givesFreeDelivery;
        if (giftProductRef !== undefined) updateData.giftProductRef = giftProductRef;
        if (giftQuantity !== undefined) updateData.giftQuantity = giftQuantity;

        // Limits
        if (maxUsagePerUser !== undefined) updateData.maxUsagePerUser = maxUsagePerUser;
        if (maxUsageTotal !== undefined) updateData.maxUsageTotal = maxUsageTotal;

        const bundle = await prisma.bundle.update({
            where: { id },
            data: updateData,
        });

        return bundle;
    } catch (error) {
        throw new Error("Failed to update bundle");
    }
};
