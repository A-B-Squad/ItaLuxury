import { Context } from "@apollo/client";

// ============================================
// CREATE BUNDLE - UPDATED TO USE INPUT PARAMETER
// ============================================
export const createBundle = async (
  _: any,
  { input }: { input: {
    name: string;
    description?: string;
    type: 'BUY_X_GET_Y_FREE' | 'PERCENTAGE_OFF' | 'FIXED_AMOUNT_OFF' | 'FREE_DELIVERY' | 'FREE_GIFT';
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
  }},
  { prisma }: Context
) => {

console.log("Creating bundle with input:", input);

  try {
    const bundle = await prisma.bundle.create({
      data: {
        name: input.name,
        description: input.description || '',
        type: input.type,
        status: input.status || 'ACTIVE', 
        startDate: input.startDate ? new Date(input.startDate) : new Date(),
        endDate: input.endDate ? new Date(input.endDate) : null,
        
        // Conditions
        minPurchaseAmount: input.minPurchaseAmount || 0,
        minQuantity: input.minQuantity || 0,
        requiredProductRefs: input.requiredProductRefs || [],
        anyProductRefs: input.anyProductRefs || [],
        requiredCategoryIds: input.requiredCategoryIds || [],
        requiredBrandIds: input.requiredBrandIds || [],
        requireAllProducts: input.requireAllProducts || false,
        
        // Rewards
        freeProductQuantity: input.freeProductQuantity || 0,
        freeProductRef: input.freeProductRef || '',
        discountPercentage: input.discountPercentage || 0,
        discountAmount: input.discountAmount || 0,
        applyDiscountTo: input.applyDiscountTo || 'ALL',
        givesFreeDelivery: input.givesFreeDelivery || false,
        giftProductRef: input.giftProductRef || '',
        giftQuantity: input.giftQuantity || 1,
        
        // Limits
        maxUsagePerUser: input.maxUsagePerUser || null,
        maxUsageTotal: input.maxUsageTotal || null,
        
      },
    });
console.log("Bundle created successfully:", bundle);
    return bundle;
  } catch (error) {
    console.error("Error creating bundle:", error);
    throw new Error("Failed to create bundle");
  }
};