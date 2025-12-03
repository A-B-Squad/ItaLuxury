import { Context } from "@apollo/client";

export const getBundle = async (
    _: any,
    { id }: { id: string },
    { prisma }: Context
) => {
    try {
        const bundle = await prisma.bundle.findUnique({
            where: { id },
        });

        if (!bundle) {
            throw new Error("Bundle not found");
        }

        return bundle;
    } catch (error) {
        throw new Error("Failed to fetch bundle");
    }
};