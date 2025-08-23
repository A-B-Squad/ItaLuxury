import { Context } from "@apollo/client";

interface ProductSearchInput {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryName?: string;
  colorName?: string;
  choice?: "in-discount" | "new-product";
  brandName?: string;
  page: number;
  pageSize?: number;
  visibleProduct?: boolean;
  sortBy?: "createdAt" | "price" | "name";
  sortOrder?: "asc" | "desc";
}



export const searchProducts = async (
  _: any,
  { input }: { input: ProductSearchInput },
  { prisma }: Context
) => {

  const normalizedQuery = input.query
    ? input.query.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    : "";

  try {
    const whereCondition: Record<string, any> = {
      ...(input.visibleProduct !== null && { isVisible: input.visibleProduct }),
      ...(input.query && {
        OR: [
          { name: { contains: normalizedQuery, mode: "insensitive" } },
          { reference: { contains: normalizedQuery, mode: "insensitive" } },
          { description: { contains: normalizedQuery, mode: "insensitive" } },
          {
            categories: {
              some: { name: { contains: normalizedQuery, mode: "insensitive" } },
            },
          },
        ],
      }),
      ...(input.minPrice !== undefined &&
        input.maxPrice !== undefined && {
        price: { gte: input.minPrice, lte: input.maxPrice },
      }),
      ...(input.categoryName && { categories: { some: { name: input.categoryName } } }),
      ...(input.brandName && { Brand: { name: input.brandName } }),
      ...(input.colorName && { Colors: { color: input.colorName } }),
      ...(input.choice === "in-discount" && { productDiscounts: { some: {} } }),
      ...(input.choice === "new-product" && {
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }),
    };
    const skip = (input.page - 1) * (input.pageSize || 10);
    const orderBy = input.sortBy
      ? { [input.sortBy]: input.sortOrder || "desc" }
      : { createdAt: input.sortOrder || "desc" };
    const [products, totalCount, categories] = await Promise.all([
      prisma.product.findMany({
        where: whereCondition,
        take: input.pageSize || 12,
        skip,
        include: {
          categories: {
            include: { subcategories: { include: { subcategories: true } } },
          },
          productDiscounts: true,
          baskets: true,
          reviews: true,
          favoriteProducts: true,
          Colors: true,
          Brand: true,
          ProductInCheckout:
          {
            include: {
              checkout: {
                include: {
                  package: { select: { status: true } },
                  Governorate: { select: { name: true } }
                }
              }
            }
          }
        },
        distinct: ["id"],
        orderBy,
      }),
      prisma.product.count({ where: whereCondition }),
      prisma.category.findMany({
        where: { name: { contains: normalizedQuery, mode: "insensitive" } },
        take: input.pageSize || 12,
      }),
    ]);

    return {
      results: { products, categories },
      totalCount,
      pagination: {
        currentPage: input.page,
        totalPages: Math.ceil(totalCount / (input.pageSize || 10)),
        hasNextPage: (input.page * (input.pageSize || 10)) < totalCount,
        hasPreviousPage: input.page > 1,
      },
    };
  } catch (error) {
    console.error("Error in searchProducts:", {
      message: error instanceof Error ? error.message : "Unknown error",
      input,
      timestamp: new Date().toISOString(),
    });
    throw new Error("Unable to fetch products. Please try again later.");
  }
};