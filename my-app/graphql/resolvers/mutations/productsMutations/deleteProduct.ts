import { Context } from "@/pages/api/graphql";

// Resolver for deleting a product
export const deleteProduct = async (
  _: any,
  { id }: { id: number },
  { prisma }: Context
) => {
  try {
    const deletedProduct = await prisma.product.delete({
      where: { id },
    });
    return deletedProduct;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product.");
  }
};
