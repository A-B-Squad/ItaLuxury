import { getActiveDiscount } from "./getActiveDiscount";


export const getCurrentPrice = (product: any): number => {
  const activeDiscount = getActiveDiscount(product);
  return activeDiscount ? activeDiscount.newPrice : product.price;
};