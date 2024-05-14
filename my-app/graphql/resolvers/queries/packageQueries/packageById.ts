import { Context } from "@/pages/api/graphql";

export const packageById = async (_: any, { packageId }: { packageId: string }, { prisma }: Context) => {
    try {
        const existingPackage = await prisma.package.findUnique({
            where: { id: packageId }, include: {
                Checkout: {
                    include: {
                        products: {
                            include: {
                                product: true
                            }
                        },
                        User: true
                    }
                }
            }
        });
        if (!existingPackage) {
            return "Package not found"
        }
        return existingPackage;
    } catch (error) {
        console.error("Error in getPackages resolver:", error);
        return "Failed to fetch package";
    }
}
