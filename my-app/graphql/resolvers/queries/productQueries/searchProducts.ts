import { Context } from "@/pages/api/graphql";
import { Prisma } from "@prisma/client";

interface ProductSearchInput {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;

  colorId?: string;
  choice?: "in-discount" | "new-product";
  brandId?: string;
  page: number;
  pageSize?: number;
  visibleProduct?: boolean;
}

export const searchProducts = async (
  _: any,
  { input }: { input: ProductSearchInput },
  { prisma }: Context
) => {
  const {
    query,
    minPrice,
    maxPrice,
    categoryId,
    colorId,
    page,
    choice,
    brandId,
    pageSize,
    visibleProduct,
  } = input;

  try {
    const whereCondition: Prisma.ProductWhereInput = {
      ...(visibleProduct !== null &&
        visibleProduct !== undefined && {
          isVisible: visibleProduct,
        }),
      ...(query && {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { reference: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          {
            categories: {
              some: { name: { contains: query, mode: "insensitive" } },
            },
          },
        ],
      }),
      ...(minPrice !== undefined &&
        maxPrice !== undefined && {
          price: { gte: minPrice, lte: maxPrice },
        }),
      ...(categoryId && { categories: { some: { id: categoryId } } }),
      ...(brandId && { Brand: { id: brandId } }),
      ...(colorId && { Colors: { id: colorId } }),
      ...(choice === "in-discount" && { productDiscounts: { some: {} } }),
      ...(choice === "new-product" && {
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }),
    };

    const skip = (page - 1) * (pageSize || 0);

    const threeWeekPeriod = Math.floor(
      Date.now() / (3 * 7 * 24 * 60 * 60 * 1000)
    );

    // Define an array of ordering options
    const orderOptions: Prisma.ProductOrderByWithRelationInput[] = [
      { createdAt: Prisma.SortOrder.desc },
      { price: Prisma.SortOrder.asc },
      { name: Prisma.SortOrder.asc },
    ];
    // Select the current ordering based on the 3-week period
    const currentOrdering = orderOptions[threeWeekPeriod % orderOptions.length];

    const [products, totalCount, categories] = await Promise.all([
      prisma.product.findMany({
        where: whereCondition,
        take: pageSize || undefined,
        skip,
        include: {
          categories: {
            include: { subcategories: { include: { subcategories: true } } },
          },
          productDiscounts: { include: { Discount: true } },
          baskets: true,
          reviews: true,
          favoriteProducts: true,
          attributes: true,
          Colors: true,
          Brand: true,
        },
        orderBy: currentOrdering,
      }),
      prisma.product.count({ where: whereCondition }),
      prisma.category.findMany({
        where: { name: { contains: query || "", mode: "insensitive" } },
        take: 8,
      }),
    ]);

    return {
      results: { products, categories },
      totalCount,
    };
  } catch (error) {
    console.error("Error in searchProducts:", error);
    throw new Error("An error occurred while searching for products");
  }
};
