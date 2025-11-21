import { Context } from "@apollo/client";
import moment from "moment-timezone";
import { revalidateTag } from "next/cache";

interface ReactivateCampaignResult {
    success: boolean;
    message: string;
    reactivatedCount?: number;
    warning?: string;
}

export const reactivateCampaign = async (
    _: any,
    { campaignName }: { campaignName: string },
    { prisma }: Context
): Promise<ReactivateCampaignResult> => {
    try {
        console.log(`🔵 Attempting to reactivate campaign: ${campaignName}`);

        // Find the campaign
        const campaign = await prisma.discountCampaign.findFirst({
            where: {
                name: campaignName,
            },
        });

        if (!campaign) {
            throw new Error(`Campaign "${campaignName}" not found`);
        }

        const now = moment();
        const startDate = moment(campaign.dateStart);
        const endDate = moment(campaign.dateEnd);

        // Validate dates
        if (endDate.isBefore(now)) {
            throw new Error(
                `Cannot reactivate campaign "${campaignName}": End date (${endDate.format(
                    "DD/MM/YYYY HH:mm"
                )}) has already passed. Please create a new campaign with updated dates.`
            );
        }

        // Check if campaign hasn't started yet
        const isNotStarted = startDate.isAfter(now);

        // Check if campaign is currently in valid date range
        const isInDateRange = startDate.isSameOrBefore(now) && endDate.isSameOrAfter(now);

        // Warning for future campaigns
        let warning: string | undefined;
        if (isNotStarted) {
            warning = `Campaign will be active starting ${startDate.format("DD/MM/YYYY HH:mm")}`;
        }

        // Find all product discounts for this campaign
        const productDiscounts = await prisma.productDiscount.findMany({
            where: {
                campaignName: campaignName,
            },
        });

        if (productDiscounts.length === 0) {
            throw new Error(`No discounts found for campaign "${campaignName}"`);
        }

        // Check for overlapping active discounts on the same products
        const productIds = productDiscounts.map((d: { productId: any; }) => d.productId);

        const overlappingDiscounts = await prisma.productDiscount.findMany({
            where: {
                productId: { in: productIds },
                isActive: true,
                isDeleted: false,
                campaignName: { not: campaignName }, // Different campaign
                OR: [
                    {
                        AND: [
                            { dateOfStart: { lte: endDate.toDate() } },
                            { dateOfEnd: { gte: startDate.toDate() } },
                        ],
                    },
                ],
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (overlappingDiscounts.length > 0) {
            const conflictingProducts = overlappingDiscounts
                .map((d: { product: { name: any; }; }) => d.product.name)
                .slice(0, 5)
                .join(", ");

            throw new Error(
                `Cannot reactivate: ${overlappingDiscounts.length} product(s) already have active discounts in this date range. Examples: ${conflictingProducts}${overlappingDiscounts.length > 5 ? "..." : ""
                }`
            );
        }

        // Reactivate the campaign
        await prisma.discountCampaign.update({
            where: { id: campaign.id },
            data: {
                isActive: true,
                updatedAt: new Date(),
            },
        });

        // Reactivate all product discounts for this campaign
        const result = await prisma.productDiscount.updateMany({
            where: {
                campaignName: campaignName,
            },
            data: {
                isActive: isInDateRange, 
                isDeleted: false,
                updatedAt: new Date(),
            },
        });

        console.log(`✅ Reactivated ${result.count} discounts for campaign: ${campaignName}`);

        // Revalidate cache
        try {
            revalidateTag('collection-search');
        } catch (e) {
            console.log('Cache revalidation skipped');
        }

        let message = `Campaign "${campaignName}" successfully reactivated with ${result.count} discount(s)`;

        if (isNotStarted) {
            message += `. Campaign will become active on ${startDate.format("DD/MM/YYYY HH:mm")}`;
        } else if (isInDateRange) {
            message += `. Campaign is now active and will end on ${endDate.format("DD/MM/YYYY HH:mm")}`;
        }

        return {
            success: true,
            message,
            reactivatedCount: result.count,
            warning,
        };

    } catch (error: any) {
        console.error("❌ Error reactivating campaign:", error);
        throw new Error(`Failed to reactivate campaign: ${error.message}`);
    }
};

// Optional: Helper function to extend campaign dates
export const extendCampaignDates = async (
    _: any,
    {
        campaignName,
        newEndDate
    }: {
        campaignName: string;
        newEndDate: string; // Format: 'DD/MM/YYYY HH:mm'
    },
    { prisma }: Context
): Promise<ReactivateCampaignResult> => {
    try {
        console.log(`🔵 Extending campaign dates: ${campaignName}`);

        const endDate = moment(newEndDate, 'DD/MM/YYYY HH:mm', true);

        if (!endDate.isValid()) {
            throw new Error(`Invalid date provided: ${newEndDate}`);
        }

        const now = moment();

        if (endDate.isBefore(now)) {
            throw new Error('New end date must be in the future');
        }

        // Find the campaign
        const campaign = await prisma.discountCampaign.findFirst({
            where: { name: campaignName },
        });

        if (!campaign) {
            throw new Error(`Campaign "${campaignName}" not found`);
        }

        // Update campaign end date
        await prisma.discountCampaign.update({
            where: { id: campaign.id },
            data: {
                dateEnd: endDate.toDate(),
                isActive: true,
                updatedAt: new Date(),
            },
        });

        // Update all product discounts end date
        const result = await prisma.productDiscount.updateMany({
            where: { campaignName: campaignName },
            data: {
                dateOfEnd: endDate.toDate(),
                isActive: true,
                isDeleted: false,
                updatedAt: new Date(),
            },
        });

        console.log(`✅ Extended ${result.count} discounts until ${endDate.format("DD/MM/YYYY HH:mm")}`);

        // Revalidate cache
        try {
            revalidateTag('collection-search');
        } catch (e) {
            console.log('Cache revalidation skipped');
        }

        return {
            success: true,
            message: `Campaign "${campaignName}" extended until ${endDate.format("DD/MM/YYYY HH:mm")} with ${result.count} discount(s) reactivated`,
            reactivatedCount: result.count,
        };

    } catch (error: any) {
        console.error("❌ Error extending campaign:", error);
        throw new Error(`Failed to extend campaign: ${error.message}`);
    }
};

// Helper function to check if campaign can be reactivated
export const canReactivateCampaign = async (
    _: any,
    { campaignName }: { campaignName: string },
    { prisma }: Context
): Promise<{
    canReactivate: boolean;
    reason?: string;
    suggestion?: string;
}> => {
    try {
        const campaign = await prisma.discountCampaign.findFirst({
            where: { name: campaignName },
        });

        if (!campaign) {
            return {
                canReactivate: false,
                reason: "Campaign not found",
            };
        }

        const now = moment();
        const endDate = moment(campaign.dateEnd);

        if (endDate.isBefore(now)) {
            return {
                canReactivate: false,
                reason: `Campaign ended on ${endDate.format("DD/MM/YYYY HH:mm")}`,
                suggestion: "Create a new campaign with updated dates or extend the end date",
            };
        }

        // Check for overlapping discounts
        const productDiscounts = await prisma.productDiscount.findMany({
            where: { campaignName: campaignName },
            select: { productId: true },
        });

        const productIds = productDiscounts.map((d: { productId: any; }) => d.productId);

        const overlappingCount = await prisma.productDiscount.count({
            where: {
                productId: { in: productIds },
                isActive: true,
                isDeleted: false,
                campaignName: { not: campaignName },
                OR: [
                    {
                        AND: [
                            { dateOfStart: { lte: campaign.dateEnd } },
                            { dateOfEnd: { gte: campaign.dateStart } },
                        ],
                    },
                ],
            },
        });

        if (overlappingCount > 0) {
            return {
                canReactivate: false,
                reason: `${overlappingCount} product(s) have conflicting active discounts`,
                suggestion: "Deactivate conflicting campaigns first",
            };
        }

        return {
            canReactivate: true,
        };

    } catch (error: any) {
        return {
            canReactivate: false,
            reason: error.message,
        };
    }
};