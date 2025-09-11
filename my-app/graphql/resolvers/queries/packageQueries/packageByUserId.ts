import { Context } from "@apollo/client";

export const packageByUserId = async (
  _: any,
  { userId }: { userId: string },
  { prisma }: Context
) => {
  try {
    const existingPackage = await prisma.package.findMany({
      where: { Checkout: { userId: userId } },
      include: {
        Checkout: {
          include: {
            productInCheckout: {
              include: {
                product: {
                  include: {
                    productDiscounts: true
                  },
                },
              },
            },
            User: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!existingPackage || existingPackage.length === 0) {
      return "Package not found";
    }

    return existingPackage;
  } catch (error) {
    console.error("Error in getPackages resolver:", error);
    return "Failed to fetch package";
  }
};
