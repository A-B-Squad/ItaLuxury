import { Context } from "@/pages/api/graphql";

export const sellProduct = async (
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

    if (product.inventory < quantityReturned) {
      throw new Error("Insufficient inventory");
    }

    // Update the product's inventory and solde fields
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        inventory: { decrement: quantityReturned },
        solde: { increment: quantityReturned },
      },
    });

    return updatedProduct;
  } catch (error) {
    throw new Error(`Error selling product: ${error}`);
  }
};
