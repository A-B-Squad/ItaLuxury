import { Context } from "@apollo/client";

export const allNewProducts = async (
  _: any,
  { limit, visibleProduct }: { visibleProduct: boolean; limit?: number },
  { prisma }: Context
) => {
  try {
    let takeValue = Number(limit) ? Number(limit) : undefined;

    const products = await prisma.product.findMany({
      where: {
        isVisible: visibleProduct ?? true,

      },
      include: {
        categories: {
          include: { subcategories: { include: { subcategories: true } } },
        },
        productDiscounts: {
          where: {
            isActive: true,
            isDeleted: false,
            dateOfStart: { lte: new Date() },
            dateOfEnd: { gte: new Date() }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        baskets: true,
        reviews: true,
        favoriteProducts: true,
        Colors: true,

        Brand: true,
      },
      take: takeValue,
      orderBy: [
        { createdAt: 'desc' },
      ],

    });

    return products;
  } catch (error) {
    console.log("Failed to fetch products", error);
    return error;
  }
};