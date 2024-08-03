import { Context } from "@/pages/api/graphql";

interface RefundPackageInput {
  packageId: string;
  cause: string;
  brokenProducts: { productId: string; quantity: number }[];
}

export const refundPackage = async (
  _: any,
  { input }: { input: RefundPackageInput },
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

    if (!findPackage || findPackage.status !== "PAYED") {
      throw new Error("Package not found or not in a refundable state");
    }

    const products = findPackage.Checkout?.productInCheckout;

    if (products && products.length > 0) {
      for (const product of products) {
        const brokenProduct = brokenProducts.find(
          (bp) => bp.productId === product.productId
        );
        const brokenQuantity = brokenProduct ? brokenProduct.quantity : 0;
        const refundQuantity = product.productQuantity;

        const updateData: any = {
          solde: { decrement: refundQuantity },
        };

        if (cause==="BROKEN") {
          updateData.broken = { increment: brokenQuantity };
          updateData.inventory = { increment: refundQuantity - brokenQuantity };
        } else {
          updateData.inventory = { increment: refundQuantity };
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
      data: { status: "REFUNDED" },
    });

    return "Package refunded successfully";
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while refunding the package.");
  }
};
