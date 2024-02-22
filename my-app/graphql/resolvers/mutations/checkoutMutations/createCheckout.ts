import { Context } from "@/pages/api/graphql";

export const createCheckout = async (
  _: any,
  { input }: { input: CreateCheckoutInput },
  { prisma }: Context
) => {
    try {
        const {packageId,status} = input
        const checkout = await prisma.checkout.create({
            data:{
                packageId,
                status
            }
        })
        return checkout
    } catch (error) {
        console.log('Failed to create checkout'+error);
        throw new Error('Failed to create checkout') 
    }    
};
