import { Context } from "@/pages/api/graphql";

interface CancelPackageInput {
  packageId: string;
  cause: string;
  brokenProducts: { productId: string; quantity: number }[];
}

export const cancelPackage = async (
  _: any,
  { input }: { input: CancelPackageInput },
  { prisma }: Context
) => {
  const { packageId, cause, brokenProducts } = input;
  try {
    const findPackage = await prisma.package.findFirst({
      where: { id: packageId },
      include: {
        Checkout: {
          include: {
            productInCheckout: true,
          },
        },
      },
    });

    if (
      !findPackage ||
      (findPackage.status !== "PROCESSING" &&
        findPackage.status !== "TRANSFER_TO_DELIVERY_COMPANY")
    ) {
      throw new Error("Package not found or not in a cancellable state");
    }

    const products = findPackage.Checkout?.productInCheckout;

    if (products && products.length > 0) {
      for (const product of products) {
        const brokenProduct = brokenProducts.find(
          (bp) => bp.productId === product.productId
        );
        const brokenQuantity = brokenProduct ? brokenProduct.quantity : 0;
        const notBrokenQuantity = product.productQuantity - brokenQuantity;

        const updateData: any = {
          broken: { increment: brokenQuantity },
        };

        if (findPackage.status === "TRANSFER_TO_DELIVERY_COMPANY") {
          updateData.solde = { decrement: product.productQuantity };
          updateData.inventory = { increment: notBrokenQuantity };
        }

        await prisma.product.update({
          where: { id: product.productId },
          data: updateData,
        });

        if (brokenQuantity > 0) {
          await prisma.breakedProduct.create({
            data: {
              productId: product.productId,
              quantity: brokenQuantity,
              cause: cause,
            },
          });
        }
      }
    }

    await prisma.package.update({
      where: { id: packageId },
      data: { status: "CANCELLED" },
    });

    return "Package cancelled successfully";
  } catch (error) {
    console.log(error);
    throw new Error("An error occurred while cancelling the package.");
  }
};
