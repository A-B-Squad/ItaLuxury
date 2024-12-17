import { Context } from "@/pages/api/graphql";

export const getAllPackages = async (_: any, __: any, { prisma }: Context) => {
  try {
    const gracePeriodSeconds = 20;
    const currentTime = Date.now();

    // Step 1: Fetch only relevant packages with limited includes
    const allPackages = await prisma.package.findMany({
      where: {
        status: "PROCESSING",
        Checkout: {
          paymentMethod: "CREDIT_CARD",
        },
      },
      include: {
        Checkout: {
          include: {
            Governorate: true,
            productInCheckout: {
              include: {
                product: {
                  include: {
                    productDiscounts: true
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });

    // Step 2: Identify packages to update based on the grace period
    const packagesToUpdate = allPackages.filter((pkg) => {
      const expirationTime = new Date(pkg.createdAt).getTime() + gracePeriodSeconds * 1000;
      return currentTime > expirationTime;
    });

    // Step 3: Batch update statuses within a transaction
    if (packagesToUpdate.length > 0) {
      await prisma.$transaction(
        packagesToUpdate.map((pkg) =>
          prisma.package.update({
            where: { customId: pkg.customId },
            data: { status: "PAYMENT_REFUSED" },
          })
        )
      );
      console.log(`${packagesToUpdate.length} packages marked as PAYMENT_REFUSED.`);
    }

    // Step 4: Refetch all packages after the updates for a consistent response
    const updatedPackages = await prisma.package.findMany({
      include: {
        Checkout: {
          include: {
            Governorate: true,
            productInCheckout: {
              include: {
                product: {
                  include: {
                    productDiscounts: true
                  },
                },
              },
            },
            Coupons: true,
            User: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return updatedPackages;
  } catch (error) {
    console.error("Error in getAllPackages resolver:", error);
    throw new Error("Failed to fetch packages");
  }
};