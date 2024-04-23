import { Context } from "@/pages/api/graphql";

export const searchProducts = async (
  _: any,
  {
    input,
    page = 1,
    pageSize = 10,
  }: { input: ProductSearchInput; page?: number; pageSize?: number },
  { prisma }: Context
) => {
  const { query, minPrice, maxPrice, categoryId, colorId } = input;

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
      whereCondition.colors = { some: { id: colorId } };
    }

    const products = await prisma.product.findMany({
      where: whereCondition,
      take: pageSize, // Limit number of products per page
      skip: (page - 1) * pageSize, // Calculate pagination offset
      include: {
        categories: true,
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

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
};
