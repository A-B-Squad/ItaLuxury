import { Context } from "@/pages/api/graphql";

interface UpdateCheckoutInput {
  checkoutId: string;
  total?: number;
  manualDiscount: GLfloat;
  productInCheckout?: Array<{
    productId: string;
    productQuantity: number;
    price: number;
    discountedPrice: number;
  }>;
}

export const updateProductInCheckout = async (
  _: any,
  { input }: { input: UpdateCheckoutInput },
  { prisma }: Context
) => {
  try {
    const { checkoutId, total, productInCheckout, manualDiscount } = input;

    // Fetch the existing checkout
    const existingCheckout = await prisma.checkout.findUnique({
      where: { id: checkoutId },
      include: { productInCheckout: true },
    });

    if (!existingCheckout) {
      throw new Error("Checkout not found");
    }

    // Prepare the update data
    const updateData: any = {};

    if (total !== undefined) updateData.total = total;
    if (manualDiscount !== undefined) updateData.manualDiscount = manualDiscount;

    // Handle product updates
    if (productInCheckout) {
      // Delete existing productInCheckout entries
      await prisma.productInCheckout.deleteMany({
        where: { checkoutId },
      });

      // Create new productInCheckout entries
      updateData.productInCheckout = {
        create: productInCheckout.map((product) => ({
          productId: product.productId,
          productQuantity: product.productQuantity,
          price: product.price,
          discountedPrice: product.discountedPrice,
        })),
      };
    }

    // Perform the update
    const updatedCheckout = await prisma.checkout.update({
      where: { id: checkoutId },
      data: updateData,
      include: { productInCheckout: true },
    });

    return "updated Checkout";
  } catch (error) {
    console.error("Error updating checkout:", error);
    throw error;
  }
};
