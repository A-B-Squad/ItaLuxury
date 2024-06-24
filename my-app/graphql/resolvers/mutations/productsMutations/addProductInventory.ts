import { Context } from "@/pages/api/graphql";

// Resolver for deleting a product
export const addProductInventory = async (
  _: any,
  { productId, inventory }: { productId: string; inventory: number },
  { prisma }: Context
) => {
  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        inventory: {
          increment: inventory,
        },
      },
    });
    return "product inventory update";
  } catch (error) {
    console.error("Error update product:", error);
    return error;
  }
};
