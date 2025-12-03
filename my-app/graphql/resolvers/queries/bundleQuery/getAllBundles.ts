import { Context } from "@apollo/client";

export const getAllBundles = async (
    _: any,
    { status, type }: { status?: 'ACTIVE' | 'INACTIVE'; type?: string },
    { prisma }: Context
) => {
    try {
        console.log("Fetched bundles:");
        
        const bundles = await prisma.bundle.findMany({
            where: {
                ...(status && { status }),
                ...(type && { type }),
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return bundles;
    } catch (error) {
        throw new Error("Failed to fetch bundles");
    }
};
