import { Context } from "@/pages/api/graphql";
import { createPendingPackage } from "../packagesMutations/createPendingPackage";
export const createCheckout = async (
    _: any,
    { input }: { input: CreateCheckoutInput },
    { prisma }: Context
) => {
    try {
        const { userId, governorateId, address, total, phone } = input;

        // Retrieve user's basket to get product IDs
        const userBasket = await prisma.basket.findMany({
            where: {
                userId
            },
            include: {
                Product: true
            }
        });


        if (!userBasket.length) {
            return new Error("User's basket not found");
        }

        const productIds = Array.isArray(userBasket)
            ? userBasket.map(basket => basket.productId)
            : [];

        // Create the checkout with the provided data and product IDs from the basket
        const newCheckout = await prisma.checkout.create({
            data: {
                userId,
                governorateId,
                productIds,
                phone,
                address,
                total
            },
        });

        await prisma.package.create({
            data: {
                checkoutId: newCheckout.id,
                status: "PENDING"
            },
        });

        return newCheckout;

    } catch (error) {
        // Handle errors
        console.error("Error creating checkout:", error);
        return new Error("Failed to create checkout");
    }
};