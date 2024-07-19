import { Context } from "@/pages/api/graphql";

export const findUniqueCoupons = async (_: any, { codeInput }: { codeInput: string }, { prisma }: Context) => {
    try {
        const uniqueCoupons = await prisma.coupons.findFirst({
            where: {
                code: codeInput
            }
        });

        if (uniqueCoupons) {
            const checkoutCoupons = await prisma.checkout.findFirst({
                where: {
                    couponsId: uniqueCoupons.id
                }
            });

            if (!checkoutCoupons) return uniqueCoupons;
        }

        return null;
    } catch (error) {
        console.log(`Failed to fetch coupons`, error);
        return new Error(`Failed to fetch coupons`);
    }
};
