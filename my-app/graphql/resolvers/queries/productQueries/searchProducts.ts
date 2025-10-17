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

// Helper function to generate search variations
const generateSearchVariations = (query: string): string[] => {
  const variations = [query];

  // Add individual words for multi-word queries
  if (query.includes(" ")) {
    variations.push(...query.split(" ").filter(word => word.length > 2));
  }

  // Add partial matches (for typos/incomplete words)
  if (query.length > 3) {
    variations.push(query.substring(0, query.length - 1));
  }

  return [...new Set(variations)];
};

// Helper function to create flexible search conditions with enhanced filtering
const createSearchConditions = (query: string, searchVariations: string[]) => {
  // Primary fields to search in (name, description, technicalDetails, reference)
  const primaryFieldsExactMatch = {
    OR: [
      { name: { equals: query, mode: "insensitive" } },
      { reference: { equals: query, mode: "insensitive" } },
      { description: { equals: query, mode: "insensitive" } },
      { technicalDetails: { equals: query, mode: "insensitive" } },
    ]
  };

  const primaryFieldsContainsMatch = {
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { reference: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { technicalDetails: { contains: query, mode: "insensitive" } },
    ]
  };

  // Extended search including categories and brands
  const extendedContainsMatch = {
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { reference: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { technicalDetails: { contains: query, mode: "insensitive" } },
      {
        categories: {
          some: {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } }
            ]
          },
        },
      },
      { Brand: { name: { contains: query, mode: "insensitive" } } },
      {
        categories: {
          some: {
            subcategories: {
              some: { name: { contains: query, mode: "insensitive" } }
            }
          }
        }
      }
    ]
  };

  const fuzzyMatch = {
    OR: searchVariations.flatMap(variation => [
      { name: { contains: variation, mode: "insensitive" } },
      { reference: { contains: variation, mode: "insensitive" } },
      { description: { contains: variation, mode: "insensitive" } },
      { technicalDetails: { contains: variation, mode: "insensitive" } },
      { Brand: { name: { contains: variation, mode: "insensitive" } } },
      {
        categories: {
          some: { name: { contains: variation, mode: "insensitive" } }
        }
      }
    ])
  };

  return {
    primaryFieldsExactMatch,
    primaryFieldsContainsMatch,
    extendedContainsMatch,
    fuzzyMatch
  };
};

export const searchProducts = async (
  _: any,
  { input }: { input: ProductSearchInput },
  { prisma }: Context
): Promise<SearchResult> => {
  const startTime = Date.now();

  try {
    const baseConditions: Record<string, any> = {
      ...(input.visibleProduct !== null && { isVisible: input.visibleProduct }),
      ...(input.minPrice !== undefined && input.maxPrice !== undefined && {
        price: { gte: input.minPrice, lte: input.maxPrice },
      }),
      ...(input.categoryName && {
        categories: {
          some: {
            name: { contains: input.categoryName, mode: "insensitive" }
          }
        }
      }),
      ...(input.brandName && {
        Brand: {
          name: { contains: input.brandName, mode: "insensitive" }
        }
      }),
      ...(input.colorName && { Colors: { color: input.colorName } }),
      ...(input.choice === "in-discount" && { productDiscounts: { some: {} } }),
      ...(input.choice === "new-product" && {
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }),
    };

    let searchConditions: any = {};
    let searchType: "exact" | "fuzzy" | "partial" = "exact";

    if (input.query) {
      const Query = input.query;
      const searchVariations = generateSearchVariations(Query);
      const {
        primaryFieldsExactMatch,
        primaryFieldsContainsMatch,
        extendedContainsMatch,
        fuzzyMatch
      } = createSearchConditions(Query, searchVariations);

      // Try different search strategies in order of relevance
      // 1. First try exact matches in primary fields (name, description, technicalDetails, reference)
      const primaryExactResults = await prisma.product.count({
        where: { ...baseConditions, ...primaryFieldsExactMatch }
      });

      if (primaryExactResults > 0) {
        searchConditions = primaryFieldsExactMatch;
        searchType = "exact";
      } else {
        // 2. Try partial matches in primary fields
        const primaryContainsResults = await prisma.product.count({
          where: { ...baseConditions, ...primaryFieldsContainsMatch }
        });

        if (primaryContainsResults > 0) {
          searchConditions = primaryFieldsContainsMatch;
          searchType = "partial";
        } else {
          // 3. Try extended search including categories and brands
          const extendedResults = await prisma.product.count({
            where: { ...baseConditions, ...extendedContainsMatch }
          });

          if (extendedResults > 0) {
            searchConditions = extendedContainsMatch;
            searchType = "partial";
          } else {
            // 4. Finally try fuzzy search
            searchConditions = fuzzyMatch;
            searchType = "fuzzy";
          }
        }
      }
    }

    const whereCondition = { ...baseConditions, ...searchConditions };
    const skip = (input.page - 1) * (input.pageSize || 12);

    // Sorting logic
    let orderBy: any = [];

    switch (input.sortBy) {
      case "outOfStock":
        orderBy = [
          { inventory: input.sortOrder === "desc" ? "asc" : "desc" },
          { createdAt: "desc" },
        ];
        break;

      case "inventory":
        orderBy = [
          { inventory: input.sortOrder || "desc" },
          { createdAt: "desc" },
        ];
        break;

      case "createdAt":
        orderBy = [
          { createdAt: input.sortOrder || "desc" },
        ];
        break;

      case "price":
        orderBy = [
          { price: input.sortOrder || "desc" },
          { createdAt: "desc" },
        ];
        break;

      case "name":
        orderBy = [
          { name: input.sortOrder || "asc" },
          { createdAt: "desc" },
        ];
        break;

      case "isVisible":
        orderBy = [
          { isVisible: input.sortOrder || "desc" },
          { createdAt: "desc" },
        ];
        break;

      default:
        orderBy = [
          { createdAt: "desc" },
        ];
    }


    const [products, totalCount, categories] = await Promise.all([
      // Main product search
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
        orderBy,
      }),

      // Total count
      prisma.product.count({ where: whereCondition }),

      // Related categories
      input.query ? prisma.category.findMany({
        where: {
          name: { contains: input.query, mode: "insensitive" }
        },
        take: 5,
        select: { id: true, name: true }
      }) : [],
    ]);

    // Get search suggestions if no products found and query exists
    const suggestions = input.query && products.length === 0
      ? await prisma.product.findMany({
        where: {
          isVisible: true,
          OR: [
            { name: { contains: input.query.substring(0, 3), mode: "insensitive" } },
            { description: { contains: input.query.substring(0, 3), mode: "insensitive" } },
            { technicalDetails: { contains: input.query.substring(0, 3), mode: "insensitive" } },
            { reference: { contains: input.query.substring(0, 3), mode: "insensitive" } },
            { Brand: { name: { contains: input.query.substring(0, 3), mode: "insensitive" } } }
          ]
        },
        take: 5,
        select: { name: true, description: true, technicalDetails: true, reference: true },
        orderBy: [
          { updatedAt: 'desc' },
          { createdAt: 'desc' },
        ]
      }).then((results: any[]) =>
        results.map((p: any) => ({
          name: p.name,
          matchedField:
            p.name?.toLowerCase().includes(input.query!.toLowerCase()) ? 'name' :
              p.description?.toLowerCase().includes(input.query!.toLowerCase()) ? 'description' :
                p.technicalDetails?.toLowerCase().includes(input.query!.toLowerCase()) ? 'technicalDetails' :
                  p.reference?.toLowerCase().includes(input.query!.toLowerCase()) ? 'reference' : 'other'
        }))
      )
      : [];

    const processingTime = Date.now() - startTime;

    return {
      results: {
        products,
        categories,
        ...(suggestions.length > 0 && { suggestions })
      },
      totalCount,
      pagination: {
        currentPage: input.page,
        totalPages: Math.ceil(totalCount / (input.pageSize || 12)),
        hasNextPage: (input.page * (input.pageSize || 12)) < totalCount,
        hasPreviousPage: input.page > 1,
      },
    };

  } catch (error) {
    console.error("Error in searchProducts:", {
      message: error instanceof Error ? error.message : "Unknown error",
      input,
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined,
    });

    throw new Error("Unable to fetch products. Please try again later.");
  }
};