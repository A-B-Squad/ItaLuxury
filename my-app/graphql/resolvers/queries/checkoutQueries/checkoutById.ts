import { Context } from "@/pages/api/graphql";

export const checkoutById = async (
  _: any,
  { basketId }: { basketId: string },
  { prisma }: Context
) => {
  try {
    const checkouts = await prisma.checkout.findMany({
      where: {
        basketId
      },
      include: {
        basket: {
          include: {
            User: true,
            Product: true // Include products related to the basket
          }
        }
      }
    });

    return checkouts;
  } catch (error) {
    console.log(`Failed to fetch checkouts for basket with ID ${basketId}`, error);
    throw new Error(`Failed to fetch checkouts for basket with ID ${basketId}`);
  }
};
