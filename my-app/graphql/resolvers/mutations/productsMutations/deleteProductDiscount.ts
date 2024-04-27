import { Context } from "@/pages/api/graphql";

// Resolver for deleting a product
export const deleteProductDiscount = async (
  _: any,
  { productId }: { productId: string },
  { prisma }: Context
) => {
  try {
    await prisma.productDiscount.delete({
      where: { productId },
    });
    return "Product  Discount deleted successfully.";
  } catch (error) {
    console.error("Error deleting Discount product:", error);
    return error;
    return new Error("Failed to delete product.");
  }
};
