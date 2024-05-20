import { Context } from "@/pages/api/graphql";

export const searchProducts = async (
  _: any,
  { input }: { input: ProductSearchInput & { page: number; pageSize: number } },
  { prisma }: Context
) => {
  const { query, minPrice, maxPrice, categoryId, colorId, page, choice, markeId, pageSize } =
    input;

  try {
    let whereCondition: any = {};

    if (query) {
      whereCondition.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { categories: { some: { name: { contains: query, mode: "insensitive" } } } },

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
    if (markeId) {
      whereCondition.Brand = { id: markeId };
    }

    if (colorId) {
      whereCondition.Colors = { id: colorId };
    }
    if (choice === "in-discount") {
      whereCondition.productDiscounts = { some: {} };
    } else if (choice === "new-product") {
      whereCondition.createdAt = { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }; // Filter products created within the last 30 days (adjust as needed)
    }


    // Calculate skip based on page and pageSize
    const skip = (page - 1) * pageSize;

    // Fetch products based on specified filters and pagination
    const products = await prisma.product.findMany({
      where: {
        ...whereCondition,
        isVisible: true

      },
      take: pageSize,
      skip,
      include: {
        categories: { include: { subcategories: { include: { subcategories: true } } } }, // Include categories related to products

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
    });

    const totalCount = await prisma.product.count();

    const categories = await prisma.category.findMany({
      where: { name: { contains: query || "", mode: "insensitive" } },
      take: 5
    })

    return {
      results: {
        products,
        categories
      },
      totalCount: totalCount,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
