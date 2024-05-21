import { Context } from "@/pages/api/graphql";

export const removeProductFromBasket = async (
  _: any,
  { productId, basketId }: { productId: string, basketId: string },
  { prisma }: Context
) => {
  try {
    await prisma.basket.deleteMany({
      where: { id:basketId, productId }
    })
    return `product with id ${productId} Deleted`
  } catch (error) {
    console.error("Failed to remove product from basket:", error);
    return new Error("Failed to remove product from basket");
  }
};
