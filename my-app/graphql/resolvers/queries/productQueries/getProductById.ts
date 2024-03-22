import { Context } from "@/pages/api/graphql";


export const productById = async (_: any, { id }: { id: string }, { prisma }: Context) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                categories: true, // Include categories related to the product
                productDiscounts: true, // Include product discount related to the product
                baskets: true, // Include baskets related to the product
                reviews: true, // Include reviews related to the product
                favoriteProducts: true, // Include favorite products related to the product
                attributes: true, // Include attributes related to the product
                ProductColorImage:{
                    include:{
                        Colors:true
                    }
                }
            }
        })
        if (!product) {
            return new Error("Product not found")
        }

        return product
    } catch (error) {
        console.log('Failed to fetch products', error);
        return new Error('Failed to fetch products');
    }
}