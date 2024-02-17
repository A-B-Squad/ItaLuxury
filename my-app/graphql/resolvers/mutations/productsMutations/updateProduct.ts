import { Context } from "@/pages/api/graphql";

// Resolver for updating a product
export const updateProduct = async (
  _: any,
  { id, input }: { id: number; input: ProductUpdateInput },
  { prisma }: Context
) => {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: input,
    });
    return updatedProduct;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product.");
  }
};
