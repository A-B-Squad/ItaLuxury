import { Context } from "@apollo/client";

export const getAllPackages = async (
  _: any,
  { page, pageSize, searchTerm, dateFrom, dateTo }: {
    page?: number;
    pageSize?: number;
    searchTerm?: string;
    dateFrom?: string;
    dateTo?: string;
  },
  { prisma }: Context
) => {
  try {
    // Validate orderBy field to prevent injection

    let whereClause: any = {};

    // Add search conditions if searchTerm is provided
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

    // Add date range filtering if provided
    if (dateFrom || dateTo) {
      whereClause.createdAt = {};

      if (dateFrom) {
        whereClause.createdAt.gte = new Date(dateFrom);
      }

      if (dateTo) {
        // Add one day to include the end date fully
        const endDate = new Date(dateTo);
        endDate.setDate(endDate.getDate() + 1);
        whereClause.createdAt.lt = endDate;
      }
    }

    // Check if pagination is requested
    const isPaginated = page !== undefined && pageSize !== undefined;

    // Your commented code for auto-updating packages
    const gracePeriodSeconds = 20;
    const currentTime = Date.now();

    // Step 1: Fetch only relevant packages with limited includes
    const allPackages = await prisma.package.findMany({
      where: {
        status: "PROCESSING",
        Checkout: {
          paymentMethod: "CREDIT_CARD",
        },
      },
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
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });

    // Step 2: Identify packages to update based on the grace period
    const packagesToUpdate = allPackages.filter((pkg: any) => {
      const expirationTime = new Date(pkg.createdAt).getTime() + gracePeriodSeconds * 1000;
      return currentTime > expirationTime;
    });

    // Step 3: Batch update statuses within a transaction
    if (packagesToUpdate.length > 0) {
      await prisma.$transaction(
        packagesToUpdate.map((pkg: any) =>
          prisma.package.update({
            where: { customId: pkg.customId },
            data: { status: "PAYMENT_REFUSED" },
          })
        )
      );
      console.log(`${packagesToUpdate.length} packages marked as PAYMENT_REFUSED.`);
    }

    // Get total count for pagination info with the same where clause
    const totalCount = await prisma.package.count({
      where: whereClause
    });

    // Add pagination if requested
    if (isPaginated) {
      const skip = (page! - 1) * pageSize!;
      const take = pageSize;

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
        skip,
        take,
      });

      // Return paginated result
      return {
        packages,
        pagination: {
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize!),
          currentPage: page,
          pageSize,
          hasNextPage: skip + take! < totalCount,
          hasPreviousPage: page! > 1,
        }
      };
    } else {
      // Return all packages without pagination but with where clause applied
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
      });

      return {
        packages,
        pagination: {
          totalCount,
          totalPages: 1,
          currentPage: 1,
          pageSize: totalCount,
          hasNextPage: false,
          hasPreviousPage: false,
        }
      };
    }
  } catch (error) {
    console.error("Error in getAllPackages resolver:", error);
    throw new Error("Failed to fetch packages");
  }
};