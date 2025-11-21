import { Context } from "@apollo/client";
import { revalidateTag } from "next/cache";

interface ProductIdObject {
  id: string;
}

interface RemovePromotionalCampaignsConditions {
  categoryIds?: string[];
  brandIds?: string[];
  productIds?: string[];
}

export const removePromotionalCampaigns = async (
  _: any, 
  {
    conditions,
    campaignName,
    softDelete = true,
  }: {
    conditions?: RemovePromotionalCampaignsConditions;
    campaignName?: string;
    softDelete?: boolean;
  },
  { prisma }: Context
): Promise<{
  success: boolean;
  message: string;
  removedCount: number;
}> => {
  try {
    // Build where clause for products
    const productWhereClause: any = {};
    const andConditions: any[] = [];

    if (conditions?.categoryIds && conditions.categoryIds.length > 0) {
      andConditions.push({
        categories: {
          some: {
            id: { in: conditions.categoryIds },
          },
        },
      });
    }

    if (conditions?.brandIds && conditions.brandIds.length > 0) {
      andConditions.push({
        brandId: { in: conditions.brandIds },
      });
    }

    if (conditions?.productIds && conditions.productIds.length > 0) {
      andConditions.push({
        id: { in: conditions.productIds },
      });
    }

    // Only add AND if there are conditions
    if (andConditions.length > 0) {
      productWhereClause.AND = andConditions;
    }

    // Get product IDs if conditions are provided
    let productIds: string[] = [];

    if (Object.keys(productWhereClause).length > 0) {
      const products = await prisma.product.findMany({
        where: productWhereClause,
        select: { id: true },
      });
      productIds = products.map((p: ProductIdObject) => p.id);

      // If no products found matching the conditions, return early
      if (productIds.length === 0) {
        return {
          success: true,
          message: "No products found matching the specified conditions",
          removedCount: 0,
        };
      }
    }

    // Build discount where clause
    const discountWhereClause: any = {
      campaignType: 'PROMOTIONAL_CAMPAIGN',
      isDeleted: false, 
    };

    // Add campaign name filter if provided
    if (campaignName) {
      discountWhereClause.campaignName = campaignName;
    }

    // Add product filter if we have product IDs from conditions
    if (productIds.length > 0) {
      discountWhereClause.productId = { in: productIds };
    }

    // Check if any discounts exist before attempting to remove
    const existingDiscounts = await prisma.productDiscount.count({
      where: discountWhereClause,
    });

    if (existingDiscounts === 0) {
      return {
        success: true,
        message: "No promotional discounts found matching the criteria",
        removedCount: 0,
      };
    }

    let result;

    if (softDelete) {
      // Soft delete: mark as deleted and inactive
      result = await prisma.productDiscount.updateMany({
        where: discountWhereClause,
        data: {
          isDeleted: true,
          isActive: false,
        },
      });

      // If a specific campaign was targeted, deactivate it
      if (campaignName) {
        await prisma.discountCampaign.updateMany({
          where: {
            name: campaignName,
            type: 'PROMOTIONAL_CAMPAIGN',
          },
          data: {
            isActive: false,
          },
        });
      }
    } else {
      // Hard delete: permanently remove discounts
      result = await prisma.productDiscount.deleteMany({
        where: discountWhereClause,
      });

      // If a specific campaign was targeted, delete it too
      if (campaignName) {
        await prisma.discountCampaign.deleteMany({
          where: {
            name: campaignName,
            type: 'PROMOTIONAL_CAMPAIGN',
          },
        });
      }
    }

    // Revalidate cache
    revalidateTag('collection-search');

    const action = softDelete ? 'deactivated' : 'removed';
    const message = campaignName
      ? `Successfully ${action} ${result.count} promotional discounts from campaign "${campaignName}"`
      : `Successfully ${action} ${result.count} promotional discounts`;

    return {
      success: true,
      message,
      removedCount: result.count,
    };

  } catch (error: any) {
    console.error("Error removing promotional discounts:", error);
    throw new Error(`Failed to remove promotional discounts: ${error.message}`);
  }
};