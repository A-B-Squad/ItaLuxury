import { Context } from "@apollo/client";

export const getActiveBundles = async (
    _: any,
    __: any,
    { prisma }: Context
) => {
    try {
        const now = new Date();

        const bundles = await prisma.bundle.findMany({
            where: {
                status: 'ACTIVE',
                startDate: { lte: now },
                OR: [
                    { endDate: null },
                    { endDate: { gte: now } },
                ],
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return bundles;
    } catch (error) {
        throw new Error("Failed to fetch active bundles");
    }
};