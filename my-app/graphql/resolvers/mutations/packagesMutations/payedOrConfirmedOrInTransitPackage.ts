import { Context } from "@/pages/api/graphql";
type PaymentMethod = "CREDIT_CARD" | "CASH_ON_DELIVERY";
type Status = "PAYED_AND_DELIVERED" | "TRANSFER_TO_DELIVERY_COMPANY" | "CONFIRMED";

export const payedOrConfirmedOrInTransitPackage = async (
  _: any,
  {
    packageId,
    status,
    paymentMethod,
    deliveryReference,
  }: {
    packageId: string;
    paymentMethod: PaymentMethod;
    status: Status;
    deliveryReference?: string | null;
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
    const updateData: any = {
      status,
    };
    
    // Add  delivery reference if provided
    if (deliveryReference) {
      updateData.deliveryReference = deliveryReference;
    }
    
    if (
      status === "CONFIRMED" &&
      paymentMethod !== "CREDIT_CARD"
    ) {

      updateData.isConfirmedAt = new Date();

      // Update product inventory and sales in a transaction
      await prisma.$transaction(async (tx:any) => {
        const checkoutProducts = await tx.productInCheckout.findMany({
          where: { checkoutId: existingPackage.Checkout!.id },
        });

        for (const product of checkoutProducts) {
          await tx.product.update({
            where: { id: product.productId },
            data: {
              inventory: { decrement: product.productQuantity },
              solde: { increment: product.productQuantity },
            },
          });
        }
      });
    } else if (status === "TRANSFER_TO_DELIVERY_COMPANY") {
      updateData.inTransitAt = new Date();
    }
    else if (status === "PAYED_AND_DELIVERED") {
      updateData.delivredAt = new Date();
    }

    await prisma.package.update({
      where: { id: packageId },
      data: updateData,
    });

    return "Package updated successfully.";
  } catch (error) {
    console.error("Error updating package:", error);
    throw new Error("Failed to update package");
  }
};
