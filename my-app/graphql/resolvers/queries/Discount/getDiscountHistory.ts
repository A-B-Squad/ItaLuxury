import { Context } from "@apollo/client";

export const getDiscountHistory = async (
    _: any,
    { productName }: { productName: string },
    { prisma }: Context
): Promise<any[]> => {
    try {
        // Find product by name using findFirst (since name is not unique)
        const product = await prisma.product.findFirst({
            where: { name: productName },
            select: { id: true, name: true },
        });

        if (!product) {
            throw new Error(`Product with name "${productName}" not found`);
        }

        // Fetch all discount history for the product
        const discounts = await prisma.productDiscount.findMany({
            where: {
                productId: product.id,
                // Include soft-deleted discounts in history for audit purposes
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        price: true,
                    },
                },
                createdBy: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        role: true,
                    },
                },
            },
            orderBy: [
                { isActive: 'desc' },
                { createdAt: 'desc' }, 
            ],
        });

        return discounts;
    } catch (error: any) {
        console.error("Error fetching discount history:", error);
        throw new Error(`Failed to fetch discount history: ${error.message}`);
    }
};