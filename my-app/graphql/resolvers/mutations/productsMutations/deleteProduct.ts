import { Context } from "@/pages/api/graphql";

// Resolver for deleting a product
export const deleteProduct = async (
  _: any,
  { productId }: { productId: string },
  { prisma }: Context
) => {
  try {
    await prisma.product.delete({
      where: { id: productId },
    });
    return "Product deleted";
  } catch (error) {
    console.error("Error deleting product:", error);
    return error;
    return new Error("Failed to delete product.");
  }
};
