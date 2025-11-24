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

// ==================== HELPER FUNCTIONS ====================

// Validate and parse dates
const validateDates = (dateOfStart: string, dateOfEnd: string) => {
  const startDate = moment(dateOfStart, 'DD/MM/YYYY HH:mm', true);
  const endDate = moment(dateOfEnd, 'DD/MM/YYYY HH:mm', true);

  if (!startDate.isValid() || !endDate.isValid()) {
    throw new Error(`Invalid date provided: start - ${dateOfStart}, end - ${dateOfEnd}`);
  }

  if (endDate.isBefore(startDate)) {
    throw new Error('End date must be after start date');
  }

  return { startDate, endDate };
};

// Validate discount input
const validateDiscount = (discountPercentage?: number, discountAmount?: number) => {
  if (!discountPercentage && !discountAmount) {
    throw new Error('Either discountPercentage or discountAmount must be provided');
  }

  if (discountPercentage && (discountPercentage <= 0 || discountPercentage > 100)) {
    throw new Error('Discount percentage must be between 1 and 100');
  }

  const discountType = discountPercentage ? 'PERCENTAGE' : 'FIXED_AMOUNT';
  const discountValue = discountPercentage || discountAmount || 0;

  return { discountType, discountValue };
};

// Build price conditions
const buildPriceConditions = (minPrice?: number, maxPrice?: number) => {
  const conditions = [];
  
  if (minPrice !== undefined) {
    conditions.push({ price: { gte: minPrice } });
  }
  
  if (maxPrice !== undefined) {
    conditions.push({ price: { lte: maxPrice } });
  }
  
  return conditions;
};

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

// Build visibility and inventory conditions
const buildInventoryConditions = (isVisible?: boolean, hasInventory?: boolean) => {
  const conditions = [];
  
  if (isVisible !== undefined) {
    conditions.push({ isVisible });
  }
  
  if (hasInventory === true) {
    conditions.push({ inventory: { gt: 0 } });
  } else if (hasInventory === false) {
    conditions.push({ inventory: { lte: 0 } });
  }
  
  return conditions;
};

// Build exclusion conditions
const buildExclusionConditions = (excludeProductIds?: string[]) => {
  if (excludeProductIds && excludeProductIds.length > 0) {
    return [{ id: { notIn: excludeProductIds } }];
  }
  return [];
};

// Build complete where clause
const buildWhereClause = (conditions: PromotionalCampaignInput['conditions']) => {
  if (!conditions) return {};

  const allConditions = [
    ...buildPriceConditions(conditions.minPrice, conditions.maxPrice),
    ...buildCategoryConditions(conditions.categoryIds),
    ...buildBrandConditions(conditions.brandIds),
    ...buildInventoryConditions(conditions.isVisible, conditions.hasInventory),
    ...buildExclusionConditions(conditions.excludeProductIds),
  ];

  if (allConditions.length === 0) {
    return {};
  }

  return { AND: allConditions };
};

// Calculate discounted price
const calculateDiscountedPrice = (
  originalPrice: number,
  discountPercentage?: number,
  discountAmount?: number
): number => {
  let discountedPrice: number;

  if (discountPercentage) {
    discountedPrice = originalPrice * (1 - discountPercentage / 100);
  } else if (discountAmount) {
    discountedPrice = originalPrice - discountAmount;
  } else {
    return originalPrice;
  }

  // Ensure non-negative and round to 3 decimals
  discountedPrice = Math.max(0, discountedPrice);
  return Math.round(discountedPrice * 1000) / 1000;
};

// Deactivate existing discounts
const deactivateExistingDiscounts = async (
  prisma: any,
  productId: string,
  startDate: moment.Moment,
  endDate: moment.Moment
) => {
  await prisma.productDiscount.updateMany({
    where: {
      productId,
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
};

// Create discount for a single product
const createProductDiscount = async (
  prisma: any,
  product: { price: number; id: string; name: string },
  discountData: {
    discountPercentage?: number;
    discountAmount?: number;
    discountType: string;
    discountValue: number;
    campaignName: string;
    startDate: moment.Moment;
    endDate: moment.Moment;
    createdById?: string;
  }
) => {
  const discountedPrice = calculateDiscountedPrice(
    product.price,
    discountData.discountPercentage,
    discountData.discountAmount
  );

  await deactivateExistingDiscounts(
    prisma,
    product.id,
    discountData.startDate,
    discountData.endDate
  );

  await prisma.productDiscount.create({
    data: {
      productId: product.id,
      price: product.price,
      newPrice: discountedPrice,
      discountType: discountData.discountType,
      discountValue: discountData.discountValue,
      campaignName: discountData.campaignName,
      campaignType: 'PROMOTIONAL_CAMPAIGN',
      dateOfStart: discountData.startDate.toDate(),
      dateOfEnd: discountData.endDate.toDate(),
      isActive: true,
      isDeleted: false,
      createdById: discountData.createdById,
    },
  });
};

// Process products in batches
const processProductBatch = async (
  prisma: any,
  products: Array<{ price: number; id: string; name: string }>,
  discountData: any
) => {
  let affectedCount = 0;
  const errors: string[] = [];
  const batchSize = 100;

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (product) => {
        try {
          await createProductDiscount(prisma, product, discountData);
          affectedCount++;
        } catch (error: any) {
          console.error(`Error processing product ${product.id}:`, error);
          errors.push(`Product ${product.id} (${product.name}): ${error.message}`);
        }
      })
    );
  }

  return { affectedCount, errors };
};

// Generate success/error message
const generateResultMessage = (affectedCount: number, errors: string[]) => {
  if (errors.length > 0) {
    return `Black Friday discounts added to ${affectedCount} products. ${errors.length} errors occurred.`;
  }
  return `Black Friday discounts successfully added to ${affectedCount} products`;
};

// Revalidate cache safely
const revalidateCacheSafely = () => {
  try {
    revalidateTag('collection-search');
  } catch (e) {
    console.log('Cache revalidation skipped');
  }
};

// ==================== MAIN FUNCTION ====================

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

    // Validate inputs
    const { startDate, endDate } = validateDates(dateOfStart, dateOfEnd);
    const { discountType, discountValue } = validateDiscount(discountPercentage, discountAmount);

    // Build query and fetch products
    const whereClause = buildWhereClause(conditions);
    console.log('WHERE CLAUSE:', JSON.stringify(whereClause, null, 2));

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

    // Create campaign record
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

    // Process products
    const { affectedCount, errors } = await processProductBatch(prisma, products, {
      discountPercentage,
      discountAmount,
      discountType,
      discountValue,
      campaignName,
      startDate,
      endDate,
      createdById,
    });

    // Update campaign with actual count
    await prisma.discountCampaign.update({
      where: { id: campaign.id },
      data: { productsAffected: affectedCount },
    });

    revalidateCacheSafely();

    return {
      success: true,
      message: generateResultMessage(affectedCount, errors),
      affectedProducts: affectedCount,
      campaignId: campaign.id,
    };
  } catch (error: any) {
    console.error("Error adding Black Friday discounts:", error);
    throw new Error(`Failed to add Black Friday discounts: ${error.message}`);
  }
};