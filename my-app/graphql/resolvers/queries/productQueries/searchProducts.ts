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
  sortBy?: "createdAt" | "price" | "name" | "isVisible" | "outOfStock" | "inventory";
  sortOrder?: "asc" | "desc";
}

interface SearchResult {
  results: {
    products: any[];
    categories: any[];
    suggestions?: string[];
  };
  totalCount: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

const createSearchConditions = (query: string) => {

  return {
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { reference: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { technicalDetails: { contains: query, mode: "insensitive" } },

      { searchKeywords: { contains: query, mode: "insensitive" } },

      { Brand: { name: { contains: query, mode: "insensitive" } } },
      {
        categories: {
          some: {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { subcategories: { some: { name: { contains: query, mode: "insensitive" } } } }
            ]
          }
        }
      }
    ]
  };
};

export const searchProducts = async (
  _: any,
  { input }: { input: ProductSearchInput },
  { prisma }: Context
): Promise<SearchResult> => {
  try {
    const baseConditions: any = {
      ...(input.visibleProduct !== undefined && { isVisible: input.visibleProduct }),
      ...(input.minPrice !== undefined && input.maxPrice !== undefined && {
        price: { gte: input.minPrice, lte: input.maxPrice }
      }),
      ...(input.categoryName && {
        categories: { some: { name: { contains: input.categoryName, mode: "insensitive" } } }
      }),
      ...(input.brandName && {
        Brand: { name: { contains: input.brandName, mode: "insensitive" } }
      }),
      ...(input.colorName && { Colors: { color: input.colorName } }),
      ...(input.choice === "in-discount" && {
        productDiscounts: {
          some: {
            isActive: true,
            isDeleted: false,
            dateOfStart: { lte: new Date() },
            dateOfEnd: { gte: new Date() }
          }
        }
      }),
      ...(input.choice === "new-product" && {
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      })
    };

    const whereCondition = input.query
      ? { ...baseConditions, ...createSearchConditions(input.query) }
      : baseConditions;

    const pageSize = input.pageSize || 12;
    const skip = (input.page - 1) * pageSize;

    // Simplified sorting
    const orderBy: any = (() => {
      switch (input.sortBy) {
        case "outOfStock":
          return [{ inventory: input.sortOrder === "desc" ? "asc" : "desc" }, { createdAt: "desc" }];
        case "inventory":
          return [{ inventory: input.sortOrder || "desc" }, { createdAt: "desc" }];
        case "price":
          return [{ price: input.sortOrder || "desc" }, { createdAt: "desc" }];
        case "name":
          return [{ name: input.sortOrder || "asc" }, { createdAt: "desc" }];
        case "isVisible":
          return [{ isVisible: input.sortOrder || "desc" }, { createdAt: "desc" }];
        default:
          return [{ createdAt: input.sortOrder || "desc" }];
      }
    })();

    const [products, totalCount, categories] = await Promise.all([
      prisma.product.findMany({
        where: whereCondition,
        take: pageSize,
        skip,
        include: {
          categories: { include: { subcategories: { include: { subcategories: true } } } },
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
          GroupProductVariant: true,
          ProductInCheckout: {
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
        orderBy
      }),
      prisma.product.count({ where: whereCondition }),
      input.query
        ? prisma.category.findMany({
          where: { name: { contains: input.query, mode: "insensitive" } },
          take: 5,
          select: { id: true, name: true }
        })
        : []
    ]);

    // Simplified suggestions
    const suggestions = input.query && products.length === 0
      ? await prisma.product.findMany({
        where: {
          isVisible: true,
          ...createSearchConditions(input.query.substring(0, 3))
        },
        take: 5,
        select: { name: true },
        orderBy: { createdAt: "desc" }
      }).then((results: any[]) => results.map(p => p.name))
      : [];

    return {
      results: { products, categories, ...(suggestions.length && { suggestions }) },
      totalCount,
      pagination: {
        currentPage: input.page,
        totalPages: Math.ceil(totalCount / pageSize),
        hasNextPage: input.page * pageSize < totalCount,
        hasPreviousPage: input.page > 1
      }
    };
  } catch (error) {
    console.error("Error in searchProducts:", error);
    throw new Error("Unable to fetch products. Please try again later.");
  }
};