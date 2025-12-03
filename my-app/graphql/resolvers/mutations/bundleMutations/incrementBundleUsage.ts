import { Context } from "@apollo/client";

export const incrementBundleUsage = async (
    _: any,
    { id }: { id: string },
    { prisma }: Context
) => {
    try {
        const bundle = await prisma.bundle.update({
            where: { id },
            data: {
                currentUsage: { increment: 1 },
            },
        });

        // Check if max usage reached, deactivate if needed
        if (bundle.maxUsageTotal && bundle.currentUsage >= bundle.maxUsageTotal) {
            await prisma.bundle.update({
                where: { id },
                data: { status: 'INACTIVE' },
            });
        }

        return bundle;
    } catch (error) {
        throw new Error("Failed to increment bundle usage");
    }
};