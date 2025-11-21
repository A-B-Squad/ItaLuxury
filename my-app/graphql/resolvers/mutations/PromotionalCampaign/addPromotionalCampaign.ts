import { Context } from "@apollo/client";
import moment from "moment-timezone";
import { revalidateTag } from "next/cache";

interface PromotionalCampaignInput {
  discountPercentage?: number;
  discountAmount?: number;
  dateOfStart: string;
  dateOfEnd: string;
  campaignName?: string;
  createdById?: string;
  conditions?: {
    minPrice?: number;
    maxPrice?: number;
    categoryIds?: string[];
    brandIds?: string[];
    isVisible?: boolean;
    hasInventory?: boolean;
    excludeProductIds?: string[];
  };
}

export const addPromotionalCampaign = async (
  _: any,
  { input }: { input: PromotionalCampaignInput },
  { prisma }: Context
): Promise<{
  success: boolean;
  message: string;
  affectedProducts: number;
  campaignId?: string;
}> => {
  try {
    const {
      discountPercentage,
      discountAmount,
      dateOfStart,
      dateOfEnd,
      campaignName = "Black Friday Campaign",
      createdById,
      conditions = {},
    } = input;

    // Validate dates
    const startDate = moment(dateOfStart, 'DD/MM/YYYY HH:mm', true);
    const endDate = moment(dateOfEnd, 'DD/MM/YYYY HH:mm', true);

    if (!startDate.isValid() || !endDate.isValid()) {
      throw new Error(`Invalid date provided: start - ${dateOfStart}, end - ${dateOfEnd}`);
    }

    if (endDate.isBefore(startDate)) {
      throw new Error('End date must be after start date');
    }

    // Validate discount input
    if (!discountPercentage && !discountAmount) {
      throw new Error('Either discountPercentage or discountAmount must be provided');
    }

    if (discountPercentage && (discountPercentage <= 0 || discountPercentage > 100)) {
      throw new Error('Discount percentage must be between 1 and 100');
    }

    // Determine discount type and value
    const discountType = discountPercentage ? 'PERCENTAGE' : 'FIXED_AMOUNT';
    const discountValue = discountPercentage || discountAmount || 0;

    // Build where clause based on conditions
    const whereClause: any = {
      AND: [] // Always initialize AND as array
    };

    if (conditions.minPrice !== undefined) {
      whereClause.AND.push({ price: { gte: conditions.minPrice } });
    }

    if (conditions.maxPrice !== undefined) {
      whereClause.AND.push({ price: { lte: conditions.maxPrice } });
    }

    if (conditions.categoryIds && conditions.categoryIds.length > 0) {
      whereClause.AND.push({
        categories: {
          some: {
            id: { in: conditions.categoryIds },
          },
        },
      });
    }

    if (conditions.brandIds && conditions.brandIds.length > 0) {
      whereClause.AND.push({
        brandId: { in: conditions.brandIds },
      });
    }

    if (conditions.isVisible !== undefined) {
      whereClause.AND.push({ isVisible: conditions.isVisible });
    }

    if (conditions.hasInventory === true) {
      whereClause.AND.push({ inventory: { gt: 0 } });
    } else if (conditions.hasInventory === false) {
      whereClause.AND.push({ inventory: { lte: 0 } });
    }

    if (conditions.excludeProductIds && conditions.excludeProductIds.length > 0) {
      whereClause.AND.push({
        id: { notIn: conditions.excludeProductIds },
      });
    }

    // Remove AND if empty
    if (whereClause.AND.length === 0) {
      delete whereClause.AND;
    }

    console.log('WHERE CLAUSE:', JSON.stringify(whereClause, null, 2));

    // Fetch all products matching conditions
    const products = await prisma.product.findMany({
      where: whereClause,
      select: {
        id: true,
        price: true,
        name: true, 
      },
    });

    console.log(`Found ${products.length} products matching conditions`);

    if (products.length === 0) {
      return {
        success: false,
        message: 'No products found matching the specified conditions',
        affectedProducts: 0,
      };
    }

    // Create discount campaign record
    const campaign = await prisma.discountCampaign.create({
      data: {
        name: campaignName,
        type: 'PROMOTIONAL_CAMPAIGN',
        dateStart: startDate.toDate(),
        dateEnd: endDate.toDate(),
        isActive: true,
        conditions: conditions as any,
        productsAffected: products.length,
        createdById: createdById,
      },
    });

    // Process each product using transaction for better performance
    let affectedCount = 0;
    const errors: string[] = [];

    // Process in batches to avoid memory issues with large product sets
    const batchSize = 100;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (product: { price: number; id: any; name: any; }) => {
          try {
            // Calculate new price
            let discountedPrice: number;
            
            if (discountPercentage) {
              discountedPrice = product.price * (1 - discountPercentage / 100);
            } else if (discountAmount) {
              discountedPrice = product.price - discountAmount;
            } else {
              return;
            }

            // Ensure new price is not negative
            if (discountedPrice < 0) {
              discountedPrice = 0;
            }

            // Round to 3 decimal places (for Tunisian Dinar)
            discountedPrice = Math.round(discountedPrice * 1000) / 1000;

            // Deactivate any existing active discounts for this product during this period
            await prisma.productDiscount.updateMany({
              where: {
                productId: product.id,
                isActive: true,
                isDeleted: false,
                OR: [
                  {
                    AND: [
                      { dateOfStart: { lte: endDate.toDate() } },
                      { dateOfEnd: { gte: startDate.toDate() } },
                    ],
                  },
                ],
              },
              data: {
                isActive: false,
              },
            });

            // Create new discount
            await prisma.productDiscount.create({
              data: {
                productId: product.id,
                price: product.price,
                newPrice: discountedPrice,
                discountType: discountType as any,
                discountValue: discountValue,
                campaignName: campaignName,
                campaignType: 'PROMOTIONAL_CAMPAIGN',
                dateOfStart: startDate.toDate(),
                dateOfEnd: endDate.toDate(),
                isActive: true,
                isDeleted: false,
                createdById: createdById,
              },
            });

            affectedCount++;
          } catch (error: any) {
            console.error(`Error processing product ${product.id}:`, error);
            errors.push(`Product ${product.id} (${product.name}): ${error.message}`);
          }
        })
      );
    }

    // Update campaign with actual affected count
    await prisma.discountCampaign.update({
      where: { id: campaign.id },
      data: { productsAffected: affectedCount },
    });

    // Revalidate cache
    try {
      revalidateTag('collection-search');
    } catch (e) {
      console.log('Cache revalidation skipped');
    }

    const message = errors.length > 0
      ? `Black Friday discounts added to ${affectedCount} products. ${errors.length} errors occurred.`
      : `Black Friday discounts successfully added to ${affectedCount} products`;

    return {
      success: true,
      message,
      affectedProducts: affectedCount,
      campaignId: campaign.id,
    };

  } catch (error: any) {
    console.error("Error adding Black Friday discounts:", error);
    throw new Error(`Failed to add Black Friday discounts: ${error.message}`);
  }
};