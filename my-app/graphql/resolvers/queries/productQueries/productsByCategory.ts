import { Context } from "@apollo/client";

export const productsByCategory = async (
  _: any,
  { categoryName, limit }: { categoryName: string; limit: number },
  { prisma }: Context
) => {
  try {
    let whereCondition: any = { isVisible: true };

    if (categoryName) {
      whereCondition.categories = {
        some: {
          name: categoryName,
        },
      };
    }

    // Ensure takeValue is either undefined or a positive integer
    const takeValue = Number(limit) && Number(limit) > 0 ? limit : undefined;

    const products = await prisma.product.findMany({
      where: whereCondition,
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
    });

    return products;
  } catch (error) {
    console.log(`Failed to fetch products for category ${categoryName}`, error);
    throw new Error(`Failed to fetch products for category ${categoryName}`);
  }
};
