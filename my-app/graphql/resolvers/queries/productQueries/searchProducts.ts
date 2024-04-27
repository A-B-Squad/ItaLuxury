import { Context } from "@/pages/api/graphql";

export const searchProducts = async (
  _: any,
  { input }: { input: ProductSearchInput & { page: number; pageSize: number } },
  { prisma }: Context
) => {
  const { query, minPrice, maxPrice, categoryId, colorId, page, pageSize } =
    input;

  try {
    let whereCondition: any = {};

    if (query) {
      whereCondition.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      whereCondition.AND = [
        { price: { gte: minPrice } },
        { price: { lte: maxPrice } },
      ];
    }

    if (categoryId) {
      whereCondition.categories = { some: { id: categoryId } };
    }

    if (colorId) {
      whereCondition.Colors = { id: colorId };
    }

    // Calculate skip based on page and pageSize
    const skip = (page - 1) * pageSize;

    // Fetch products based on specified filters and pagination
    const products = await prisma.product.findMany({
      where: whereCondition,
      take: pageSize,
      skip,
      include: {
        categories: {
          include: {
            subcategories: true,
          },
        },
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
      },
    });

    const totalCount = await prisma.product.count();

    console.log("====================================");
    console.log({
      results: products,
      totalCount: totalCount,
    });
    console.log("====================================");
    return {
      results: products,
      totalCount: totalCount,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
