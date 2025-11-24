import { Context } from "@apollo/client";

// ==================== CONSTANTS ====================

const MAX_EXPORT_LIMIT = 10000;
const BATCH_SIZE = 1000;
const COUNT_TIMEOUT = 30000;
const BATCH_DELAY = 100;

// ==================== HELPER FUNCTIONS ====================

// Build where clause for filtering
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

// Fetch export data from database
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

// Get total count with timeout protection
async function getTotalCountWithTimeout(prisma: any, whereClause: any): Promise<number> {
    return await Promise.race([
        prisma.package.count({ where: whereClause }),
        new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Count query timeout')), COUNT_TIMEOUT)
        )
    ]);
}

// Calculate effective limit for export
const calculateExportLimit = (totalCount: number): number => {
    if (totalCount > MAX_EXPORT_LIMIT) {
        console.warn(`Export limited to ${MAX_EXPORT_LIMIT} records. Total: ${totalCount}`);
    }
    return Math.min(totalCount, MAX_EXPORT_LIMIT);
};

// Fetch all packages in batches
async function fetchPackagesInBatches(
    prisma: any,
    whereClause: any,
    limit: number
): Promise<any[]> {
    const allPackages = [];
    console.log(`Fetching ${limit} packages in batches of ${BATCH_SIZE}`);

    for (let offset = 0; offset < limit; offset += BATCH_SIZE) {
        const batchSize = Math.min(BATCH_SIZE, limit - offset);
        const batch = await fetchExportData(prisma, whereClause, offset, batchSize);
        allPackages.push(...batch);

        // Prevent database overload with delay between batches
        if (offset + batchSize < limit) {
            await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
        }
    }

    return allPackages;
}

// Fetch all packages (single or batched)
async function fetchAllPackages(
    prisma: any,
    whereClause: any,
    limit: number
): Promise<any[]> {
    if (limit <= BATCH_SIZE) {
        return await fetchExportData(prisma, whereClause, 0, limit);
    }
    return await fetchPackagesInBatches(prisma, whereClause, limit);
}

// Build pagination response
const buildPaginationResponse = (packages: any[], totalCount: number) => ({
    totalCount,
    totalPages: 1,
    currentPage: 1,
    pageSize: packages.length,
    hasNextPage: false,
    hasPreviousPage: false,
});

// Check if error has a message property
const hasErrorMessage = (error: unknown): error is { message: string } => {
    return typeof error === "object" && error !== null && "message" in error;
};

// Handle export errors with specific messages
const handleExportError = (error: unknown): never => {
    console.error("Error in GetAllPackagesForExport resolver:", error);

    if (hasErrorMessage(error)) {
        if (error.message.includes('timeout')) {
            throw new Error("Export request timed out. Please try with more specific filters.");
        }

        if (error.message.includes('memory') || error.message.includes('limit')) {
            throw new Error("Export dataset too large. Please apply date range or status filters.");
        }
    }

    throw new Error("Failed to fetch packages for export. Please try again.");
};

// ==================== MAIN FUNCTION ====================

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
        
        // Build query filter
        const whereClause = buildWhereClause({ searchTerm, dateFrom, dateTo, statusFilter });

        // Get total count with timeout protection
        const totalCount = await getTotalCountWithTimeout(prisma, whereClause);

        // Calculate export limit
        const limit = calculateExportLimit(totalCount);

        // Fetch all packages
        const allPackages = await fetchAllPackages(prisma, whereClause, limit);

        // Log completion
        const processingTime = Date.now() - startTime;
        console.log(`Export completed: ${allPackages.length} packages in ${processingTime}ms`);

        // Return results
        return {
            packages: allPackages,
            pagination: buildPaginationResponse(allPackages, totalCount),
        };

    } catch (error) {
        handleExportError(error);
    }
};