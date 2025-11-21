import { Context } from "@apollo/client";

export const packageById = async (_: any, { packageId }: { packageId: string }, { prisma }: Context) => {
  try {
    const pkg = await prisma.package.findFirst({
      where: { OR: [{ customId: packageId }, { id: packageId }] },
      include: {
        Checkout: {
          include: {
            Governorate: true,
            productInCheckout: {
              include: {
                product: { include: { productDiscounts: true } },
              },
            },
            Coupons: true,
            User: { include: { pointTransactions: true } },
          },
        },
      },
    });
    return pkg;
  } catch (error) {
    console.error("Error in packageById resolver:", error);
    throw new Error("Failed to fetch package");
  }
};
