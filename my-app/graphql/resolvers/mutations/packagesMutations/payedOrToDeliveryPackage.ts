import { Context } from "@/pages/api/graphql";
type PaymentMethod = "CREDIT_CARD" | "CASH_ON_DELIVERY";

export const payedOrToDeliveryPackage = async (
  _: any,
  {
    packageId,
    status,
    paymentMethod,
  }: {
    packageId: string;
    paymentMethod: PaymentMethod;
    status: "PAYED_AND_DELIVERED" | "TRANSFER_TO_DELIVERY_COMPANY";
  },
  { prisma }: Context
): Promise<string> => {
  try {
    const existingPackage = await prisma.package.findUnique({
      where: { id: packageId },
      include: { Checkout: true },
    });

    if (!existingPackage) {
      throw new Error("Package not found");
    }

    if (!existingPackage.Checkout) {
      throw new Error("Checkout not found for this package");
    }

    if (
      status === "TRANSFER_TO_DELIVERY_COMPANY" &&
      paymentMethod !== "CREDIT_CARD"
    ) {
      // Fetch the products associated with the checkout
      const checkoutProducts = await prisma.productInCheckout.findMany({
        where: { checkoutId: existingPackage.Checkout.id },
      });

      for (const product of checkoutProducts) {
        await prisma.product.update({
          where: { id: product.productId },
          data: {
            inventory: { decrement: product.productQuantity },
            solde: { increment: product.productQuantity },
          },
        });
      }
      await prisma.package.update({
        where: { id: packageId },
        data: { inTransitAt: new Date() },
      });
    } else if (paymentMethod === "CREDIT_CARD") {
      await prisma.package.update({
        where: { id: packageId },
        data: { inTransitAt: new Date() },
      });
    } else {
      await prisma.package.update({
        where: { id: packageId },
        data: { delivredAt: new Date() },
      });
    }

    await prisma.package.update({
      where: { id: packageId },
      data: { status },
    });

    return "Package updated successfully.";
  } catch (error) {
    console.error("Error updating package:", error);
    throw new Error("Failed to update package");
  }
};
