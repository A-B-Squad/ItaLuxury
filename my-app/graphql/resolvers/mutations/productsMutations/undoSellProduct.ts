import { Context } from "@/pages/api/graphql";

export const undoSellProduct = async (
  _: any,
  {
    productId,
    quantityReturned,
  }: { productId: string; quantityReturned: number },
  { prisma }: Context
) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Update the product's inventory and solde fields
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        inventory: { increment: quantityReturned },
        solde: { decrement: quantityReturned },
      },
    });

    return updatedProduct;
  } catch (error) {
    throw new Error(`Error undoing product sale: ${error}`);
  }
};
