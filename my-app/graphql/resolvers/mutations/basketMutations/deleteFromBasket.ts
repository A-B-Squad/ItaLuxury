import { Context } from "@/pages/api/graphql";

export const removeProductFromBasket = async (
  _: any,
  { basketId }: { basketId: string },
  { prisma }: Context
) => {
  try {
    const deletedBasket = await prisma.basket.delete({
        where:{id:basketId}
    })
    return deletedBasket
  } catch (error) {
    console.error("Failed to remove product from basket:", error);
    throw new Error("Failed to remove product from basket");
  }
};
