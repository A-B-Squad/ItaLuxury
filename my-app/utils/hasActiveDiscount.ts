


/**
 * Check if product has an active discount
 */
export const hasActiveDiscount = (product: any): boolean => {
  if (!product.productDiscounts || product.productDiscounts.length === 0) {
    return false;
  }

  const now = Date.now();

  return product.productDiscounts.some((discount: any) => {
    const startTime = Number(discount.dateOfStart);
    const endTime = Number(discount.dateOfEnd);
    return (
      discount.isActive &&
      !discount.isDeleted &&
      startTime <= now &&
      endTime >= now
    );
  });
};