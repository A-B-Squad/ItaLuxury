import { Context } from "@/pages/api/graphql";

export const products = async (_:any,__:any,{prisma}:Context)=>{
    try {
        const products = await prisma.product.findMany()
        return products
    } catch (error) {
        console.log('Failed to fetch products', error);
        throw new Error('Failed to fetch products')
    }
}