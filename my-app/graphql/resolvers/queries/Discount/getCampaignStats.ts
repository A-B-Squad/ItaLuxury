import { Context } from "@apollo/client";

export const getCampaignStats = async (
  _: any,
  { campaignId }: { campaignId: string },
  { prisma }: Context
): Promise<any | null> => {
  try {
    // Fetch the campaign
    const campaign = await prisma.discountCampaign.findUnique({
      where: { id: campaignId },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }

    // Get all discounts for this campaign
    const discounts = await prisma.productDiscount.findMany({
      where: {
        campaignName: campaign.name,
        campaignType: campaign.type,
      },
      select: {
        id: true,
        productId: true,
        isActive: true,
        isDeleted: true,
      },
    });

    // Get product IDs from discounts
    const productIds = discounts.map((d: { productId: any; }) => d.productId);

    // Calculate revenue from orders during campaign period
    // Get checkouts within the campaign date range
    const checkouts = await prisma.checkout.findMany({
      where: {
        createdAt: {
          gte: campaign.dateStart,
          lte: campaign.dateEnd,
        },
      },
      include: {
        productInCheckout: {
          where: {
            productId: {
              in: productIds,
            },
          },
          select: {
            productId: true,
            productQuantity: true,
            price: true,
            discountedPrice: true,
          },
        },
      },
    });

    // Calculate total revenue from discounted products
    let totalRevenue = 0;
    let productsSold = 0;

    checkouts.forEach((checkout: { productInCheckout: any[]; }) => {
      checkout.productInCheckout.forEach(item => {
        const itemPrice = item.discountedPrice > 0 ? item.discountedPrice : item.price;
        totalRevenue += itemPrice * item.productQuantity;
        productsSold += item.productQuantity;
      });
    });

    // Count active vs inactive/deleted discounts
    const activeDiscounts = discounts.filter((d: { isActive: any; isDeleted: any; }) => d.isActive && !d.isDeleted).length;
    const inactiveDiscounts = discounts.filter((d: { isActive: any; isDeleted: any; }) => !d.isActive || d.isDeleted).length;

    // Update campaign with calculated stats
    const updatedCampaign = await prisma.discountCampaign.update({
      where: { id: campaignId },
      data: {
        totalRevenue: totalRevenue,
        productsAffected: discounts.length,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    // Return campaign with additional computed stats
    return {
      ...updatedCampaign,
      // Add computed fields that aren't in the DB
      stats: {
        activeDiscounts,
        inactiveDiscounts,
        totalDiscounts: discounts.length,
        productsSold,
        averageRevenuePerProduct: discounts.length > 0 ? totalRevenue / discounts.length : 0,
      },
    };
  } catch (error: any) {
    console.error("Error fetching campaign stats:", error);
    throw new Error(`Failed to fetch campaign stats: ${error.message}`);
  }
};
