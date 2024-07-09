import { Context } from "@/pages/api/graphql";


export const packageById = async (
  _: any,
  { packageId }: { packageId: string },
  { prisma }: Context
) => {
  try {
    
    const existingPackages = await prisma.package.findMany({
      where: { OR: [
        { customId: packageId },
        { id: packageId },
      ], },
      include: {
        Checkout: {
          include: {
            productInCheckout: {
              include: {
                product: {
                  include: {
                    productDiscounts: {
                      include: {
                        Discount: true,
                      },
                    },
                  },
                },
              },
            },
            Coupons: true,
            User: true,
          },
        },
      },
    });
    
    console.log(existingPackages);
    
    if (existingPackages.length === 0) {
      return null;
    }
    return existingPackages[0]; // Return the first matching package
  } catch (error) {
    console.error("Error in packageById resolver:", error);
    throw new Error("Failed to fetch package");
  }
};