import { Context } from "@/pages/api/graphql";

export const deleteBasketById = async (
  _: any,
  { basketId }: { basketId: string },
  { prisma }: Context
) => {
  try {
    const deletedBasket = await prisma.basket.delete({
      where: { id: basketId }
    })
    return "Basket Deleted Successfully"
  } catch (error) {
    console.error("Failed to remove product from basket:", error);
    return new Error("Failed to remove product from basket");
  }
};
