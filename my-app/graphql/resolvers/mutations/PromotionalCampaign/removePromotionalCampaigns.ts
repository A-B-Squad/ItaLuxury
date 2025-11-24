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

// ==================== HELPER FUNCTIONS ====================

// Build category conditions
const buildCategoryConditions = (categoryIds?: string[]) => {
  if (categoryIds && categoryIds.length > 0) {
    return [{
      categories: {
        some: {
          id: { in: categoryIds },
        },
      },
    }];
  }
  return [];
};

// Build brand conditions
const buildBrandConditions = (brandIds?: string[]) => {
  if (brandIds && brandIds.length > 0) {
    return [{ brandId: { in: brandIds } }];
  }
  return [];
};

// Build product ID conditions
const buildProductIdConditions = (productIds?: string[]) => {
  if (productIds && productIds.length > 0) {
    return [{ id: { in: productIds } }];
  }
  return [];
};

// Build complete product where clause
const buildProductWhereClause = (conditions?: RemovePromotionalCampaignsConditions) => {
  if (!conditions) return {};

  const allConditions = [
    ...buildCategoryConditions(conditions.categoryIds),
    ...buildBrandConditions(conditions.brandIds),
    ...buildProductIdConditions(conditions.productIds),
  ];

  if (allConditions.length === 0) {
    return {};
  }

  return { AND: allConditions };
};

// Fetch product IDs based on conditions
const fetchProductIds = async (
  prisma: any,
  productWhereClause: any
): Promise<string[]> => {
  if (Object.keys(productWhereClause).length === 0) {
    return [];
  }

  const products = await prisma.product.findMany({
    where: productWhereClause,
    select: { id: true },
  });

  return products.map((p: ProductIdObject) => p.id);
};

// Build discount where clause
const buildDiscountWhereClause = (
  campaignName?: string,
  productIds?: string[]
) => {
  const whereClause: any = {
    campaignType: 'PROMOTIONAL_CAMPAIGN',
    isDeleted: false,
  };

  if (campaignName) {
    whereClause.campaignName = campaignName;
  }

  if (productIds && productIds.length > 0) {
    whereClause.productId = { in: productIds };
  }

  return whereClause;
};

// Check if discounts exist
const checkDiscountsExist = async (
  prisma: any,
  discountWhereClause: any
): Promise<boolean> => {
  const count = await prisma.productDiscount.count({
    where: discountWhereClause,
  });
  return count > 0;
};

// Perform soft delete on discounts
const softDeleteDiscounts = async (
  prisma: any,
  discountWhereClause: any,
  campaignName?: string
) => {
  const result = await prisma.productDiscount.updateMany({
    where: discountWhereClause,
    data: {
      isDeleted: true,
      isActive: false,
    },
  });

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

  return result;
};

// Perform hard delete on discounts
const hardDeleteDiscounts = async (
  prisma: any,
  discountWhereClause: any,
  campaignName?: string
) => {
  const result = await prisma.productDiscount.deleteMany({
    where: discountWhereClause,
  });

  if (campaignName) {
    await prisma.discountCampaign.deleteMany({
      where: {
        name: campaignName,
        type: 'PROMOTIONAL_CAMPAIGN',
      },
    });
  }

  return result;
};

// Execute delete operation (soft or hard)
const executeDelete = async (
  prisma: any,
  discountWhereClause: any,
  softDelete: boolean,
  campaignName?: string
) => {
  if (softDelete) {
    return await softDeleteDiscounts(prisma, discountWhereClause, campaignName);
  }
  return await hardDeleteDiscounts(prisma, discountWhereClause, campaignName);
};

// Generate success message
const generateSuccessMessage = (
  count: number,
  softDelete: boolean,
  campaignName?: string
): string => {
  const action = softDelete ? 'deactivated' : 'removed';

  if (campaignName) {
    return `Successfully ${action} ${count} promotional discounts from campaign "${campaignName}"`;
  }

  return `Successfully ${action} ${count} promotional discounts`;
};

// ==================== MAIN FUNCTION ====================

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
    // Build product query and fetch matching product IDs
    const productWhereClause = buildProductWhereClause(conditions);
    const productIds = await fetchProductIds(prisma, productWhereClause);

    // Early return if conditions specified but no products found
    if (Object.keys(productWhereClause).length > 0 && productIds.length === 0) {
      return {
        success: true,
        message: "No products found matching the specified conditions",
        removedCount: 0,
      };
    }

    // Build discount query
    const discountWhereClause = buildDiscountWhereClause(campaignName, productIds);

    // Check if any discounts exist
    const discountsExist = await checkDiscountsExist(prisma, discountWhereClause);
    if (!discountsExist) {
      return {
        success: true,
        message: "No promotional discounts found matching the criteria",
        removedCount: 0,
      };
    }

    // Execute delete operation
    const result = await executeDelete(
      prisma,
      discountWhereClause,
      softDelete,
      campaignName
    );

    // Revalidate cache
    revalidateTag('collection-search');

    return {
      success: true,
      message: generateSuccessMessage(result.count, softDelete, campaignName),
      removedCount: result.count,
    };
  } catch (error: any) {
    console.error("Error removing promotional discounts:", error);
    throw new Error(`Failed to remove promotional discounts: ${error.message}`);
  }
};