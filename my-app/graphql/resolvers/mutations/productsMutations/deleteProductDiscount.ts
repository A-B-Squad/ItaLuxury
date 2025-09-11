import { Context } from "@apollo/client";

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
    await prisma.product.update({
      where: { id: productId },
      data: {
        updatedAt: new Date(),
      }
    });
    return "Product  Discount deleted successfully.";
  } catch (error) {
    console.error("Error deleting Discount product:", error);
    return error;
  }
};
