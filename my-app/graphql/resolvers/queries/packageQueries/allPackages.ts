import { Context } from "@/pages/api/graphql";

export const getAllPackages = async (_: any, __: any, { prisma }: Context) => {
    try {
        const allPackages = await prisma.package.findMany({
            include: {
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
        return allPackages;
    } catch (error) {
        console.error("Error in getAllPackages resolver:", error);
        return `Failed to fetch packages" ${error}`;
    }
}
