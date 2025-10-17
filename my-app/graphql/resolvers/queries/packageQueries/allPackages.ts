import { Context } from "@apollo/client";

export const getAllPackages = async (
  _: any,
  { page, pageSize, searchTerm, dateFrom, dateTo, statusFilter }: {
    page?: number;
    pageSize?: number;
    searchTerm?: string;
    dateFrom?: string;
    dateTo?: string;
    statusFilter?: string | string[];
  },
  { prisma }: Context
) => {
  try {
    const whereClause = buildWhereClause({ searchTerm, dateFrom, dateTo, statusFilter });

    // Run background auto-update occasionally (20% of requests)
    if (Math.random() < 0.2) {
      updateExpiredPackagesAsync(prisma);
    }

    const isPaginated = page !== undefined && pageSize !== undefined;

    if (isPaginated) {
      return await getPaginatedPackages(prisma, whereClause, page!, pageSize!);
    } else {
      return await getAllPackagesWithLimit(prisma, whereClause);
    }

  } catch (error) {
    console.error("Error in getAllPackages resolver:", error);
    throw new Error("Failed to fetch packages");
  }
};

function buildWhereClause({
  searchTerm,
  dateFrom,
  dateTo,
  statusFilter,
}: {
  searchTerm?: string;
  dateFrom?: string;
  dateTo?: string;
  statusFilter?: string | string[];
}) {
  let whereClause: any = {};

  if (searchTerm) {
    whereClause.OR = [
      { customId: { contains: searchTerm, mode: 'insensitive' } },
      { deliveryReference: { contains: searchTerm, mode: 'insensitive' } },
      {
        Checkout: {
          OR: [
            { userId: { contains: searchTerm, mode: 'insensitive' } },
            { userName: { contains: searchTerm, mode: 'insensitive' } },
            { phone: { has: searchTerm } }
          ]
        }
      }
    ];
  }

  if (statusFilter) {
    if (Array.isArray(statusFilter)) {
      whereClause.status = { in: statusFilter };
    } else {
      whereClause.status = statusFilter;
    }
  }

  if (dateFrom || dateTo) {
    whereClause.createdAt = {};

    if (dateFrom) {
      whereClause.createdAt.gte = new Date(dateFrom);
    }

    if (dateTo) {
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999);
      whereClause.createdAt.lte = endDate;
    }
  }

  return whereClause;
}

// Handle paginated requests with parallel queries for performance
async function getPaginatedPackages(prisma: any, whereClause: any, page: number, pageSize: number) {
  const skip = (page - 1) * pageSize;

  const [totalCount, packages] = await Promise.all([
    prisma.package.count({ where: whereClause }),
    prisma.package.findMany({
      where: whereClause,
      include: {
        Checkout: {
          include: {
            Governorate: true,
            productInCheckout: {
              include: {
                product: {
                  include: {
                    productDiscounts: true
                  },
                },
              },
            },
            Coupons: true,
            User: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: pageSize,
    })
  ]);

  return {
    packages,
    pagination: {
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
      pageSize,
      hasNextPage: skip + pageSize < totalCount,
      hasPreviousPage: page > 1,
    }
  };
}

// Handle non-paginated requests with safety limit to prevent crashes
async function getAllPackagesWithLimit(prisma: any, whereClause: any) {
  const MAX_LIMIT = 5000;

  const totalCount = await prisma.package.count({ where: whereClause });

  if (totalCount > MAX_LIMIT) {
    console.warn(`Large dataset detected (${totalCount}). Limiting to ${MAX_LIMIT} records.`);
  }

  const packages = await prisma.package.findMany({
    where: whereClause,
    include: {
      Checkout: {
        include: {
          Governorate: true,
          productInCheckout: {
            include: {
              product: {
                include: {
                  productDiscounts: true
                },
              },
            },
          },
          Coupons: true,
          User: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: Math.min(totalCount, MAX_LIMIT),
  });

  return {
    packages,
    pagination: {
      totalCount,
      totalPages: 1,
      currentPage: 1,
      pageSize: packages.length,
      hasNextPage: false,
      hasPreviousPage: false,
    }
  };
}

// Auto-update expired packages in background (doesn't block main query)
async function updateExpiredPackagesAsync(prisma: any) {
  try {
    const gracePeriodSeconds = 20;
    const expirationThreshold = new Date(Date.now() - gracePeriodSeconds * 1000);

    const result = await prisma.package.updateMany({
      where: {
        AND: [
          { status: "PROCESSING" },
          { createdAt: { lt: expirationThreshold } },
          {
            Checkout: {
              paymentMethod: "CREDIT_CARD"
            }
          }
        ]
      },
      data: {
        status: "PAYMENT_REFUSED"
      }
    });

    if (result.count > 0) {
      console.log(`Background: Updated ${result.count} expired packages`);
    }

  } catch (error) {
    console.error("Background auto-update failed:", error);
  }
}