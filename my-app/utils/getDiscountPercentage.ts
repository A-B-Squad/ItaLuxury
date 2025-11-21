import { getActiveDiscount } from "./getActiveDiscount";

/**
 * Get discount percentage
 */
export const getDiscountPercentage = (product: any): number => {
    const activeDiscount = getActiveDiscount(product);
    if (!activeDiscount) return 0;

    const saved = product.price - activeDiscount.newPrice;
    return Math.round((saved / product.price) * 100);
};