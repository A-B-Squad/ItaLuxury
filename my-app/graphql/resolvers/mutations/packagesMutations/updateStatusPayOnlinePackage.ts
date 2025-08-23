import { Context } from "@apollo/client";

type Status =
  | "PAYMENT_REFUSED"
  | "PAYED_NOT_DELIVERED";

interface UpdateStatusPayOnlinePackageInput {
  packageId: string;
  paymentStatus: Status;
}

export const updateStatusPayOnlinePackage = async (
  _: any,
  { packageId, paymentStatus }: UpdateStatusPayOnlinePackageInput,
  { prisma }: Context
) => {
  try {
    const existingPackage = await prisma.package.findUnique({
      where: { customId: packageId },
      include: { Checkout: true },
    });

    if (!existingPackage) {
      throw new Error("Package not found");
    }

    if (!existingPackage.Checkout) {
      throw new Error("Checkout not found for this package");
    }

    const updatedPackage = await prisma.package.update({
      where: { customId: packageId },
      data: {
        status:
          paymentStatus === "PAYED_NOT_DELIVERED"
            ? "PAYED_NOT_DELIVERED"
            : "PAYMENT_REFUSED",
      },
    });

    if (paymentStatus === "PAYED_NOT_DELIVERED") {
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
    }
    return `Package status updated to ${updatedPackage.status}`;
  } catch (error) {
    console.error("Error updating package status:", error);
    throw error;
  }
};
