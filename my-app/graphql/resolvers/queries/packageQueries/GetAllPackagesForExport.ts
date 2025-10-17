import { Context } from "@apollo/client";

export const GetAllPackagesForExport = async (
    _: any,
    { searchTerm, dateFrom, dateTo, statusFilter }: {
        searchTerm?: string;
        dateFrom?: string;
        dateTo?: string;
        statusFilter?: string | string[];
    },
    { prisma }: Context
) => {
    try {
        const startTime = Date.now();
        const whereClause = buildWhereClause({ searchTerm, dateFrom, dateTo, statusFilter });

        // Prevent indefinite hanging with timeout protection
        const totalCount = await Promise.race([
            prisma.package.count({ where: whereClause }),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Count query timeout')), 30000)
            )
        ]) as number;

        const MAX_EXPORT_LIMIT = 10000;
        const BATCH_SIZE = 1000;

        if (totalCount > MAX_EXPORT_LIMIT) {
            console.warn(`Export limited to ${MAX_EXPORT_LIMIT} records. Total: ${totalCount}`);
        }

        const limit = Math.min(totalCount, MAX_EXPORT_LIMIT);
        let allPackages = [];

        if (limit <= BATCH_SIZE) {
            allPackages = await fetchExportData(prisma, whereClause, 0, limit);
        } else {
            console.log(`Fetching ${limit} packages in batches of ${BATCH_SIZE}`);

            for (let offset = 0; offset < limit; offset += BATCH_SIZE) {
                const batchSize = Math.min(BATCH_SIZE, limit - offset);
                const batch = await fetchExportData(prisma, whereClause, offset, batchSize);
                allPackages.push(...batch);

                // Prevent database overload
                if (offset + batchSize < limit) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }
        }

        const processingTime = Date.now() - startTime;
        console.log(`Export completed: ${allPackages.length} packages in ${processingTime}ms`);

        return {
            packages: allPackages,
            pagination: {
                totalCount,
                totalPages: 1,
                currentPage: 1,
                pageSize: allPackages.length,
                hasNextPage: false,
                hasPreviousPage: false,
            },
        };

    } catch (error) {
        console.error("Error in GetAllPackagesForExport resolver:", error);

        if (typeof error === "object" && error !== null && "message" in error && typeof (error as any).message === "string") {
            if ((error as any).message.includes('timeout')) {
                throw new Error("Export request timed out. Please try with more specific filters.");
            }

            if ((error as any).message.includes('memory') || (error as any).message.includes('limit')) {
                throw new Error("Export dataset too large. Please apply date range or status filters.");
            }
        }

        throw new Error("Failed to fetch packages for export. Please try again.");
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

async function fetchExportData(prisma: any, whereClause: any, offset: number, limit: number) {
    return await prisma.package.findMany({
        where: whereClause,
        include: {
            Checkout: {
                include: {
                    Governorate: true,
                    productInCheckout: {
                        include: {
                            product: true
                        }
                    },
                    Coupons: true,
                    User: true,
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        skip: offset,
        take: limit
    });
}