import { Context } from "@/pages/api/graphql";

export const productsLessThen20 = async (
  _: any,
  { limit }: { limit?: number },
  { prisma }: Context
) => {
  try {
    const takeValue = limit || undefined;

    const products = await prisma.product.findMany({
      where: {
        price: {
          lte: 20, // Filter for prices less than or equal to 20
        },
        isVisible: true,
      },
      include: {
        categories: {
          include: { subcategories: { include: { subcategories: true } } },
        }, // Include categories related to products
        productDiscounts: {
          include: {
            Discount: true,
          },
        },
        baskets: true,

        reviews: true,
        favoriteProducts: true,
        attributes: true,
        Colors: true,
        Brand: true,
      },
      take: takeValue,
    });
    return products;
  } catch (error) {
    console.log("Failed to fetch products", error);
    return error;
  }
};
