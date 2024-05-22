import { Context } from "@/pages/api/graphql";

export const sellProduct = async (
  _: any,
  {
    productId,
    quantitySold,
  }: { productId: string; quantitySold: number },
  { prisma }: Context
) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });


    if (!product) {
      return new Error(`Product with ID ${productId} not found`)
    }

    // Check if there is enough quantity to sell
    if (product.inventory <= quantitySold) {
      return new Error(`Insufficient quantity available for product ${product.name}`)
    }

    // Update the product's inventory and solde fields
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        inventory: { decrement: quantitySold },
        solde: { increment: quantitySold },
      },
    });

    console.log(updatedProduct);

    return updatedProduct;
  } catch (error) {
    return `Error selling product: ${error}`
  }
};
