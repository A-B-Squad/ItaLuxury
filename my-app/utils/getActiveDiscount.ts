
export const getActiveDiscount = (product: any) => {
  if (!product.productDiscounts || product.productDiscounts.length === 0) {
    return null;
  }

  const now = Date.now(); 
  
  return product.productDiscounts.find((discount: any) => {
    // Convert string timestamps to numbers
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