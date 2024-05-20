import { Context } from "@/pages/api/graphql";

export const deleteTopDeals = async (
    // Defining an async function called deleteTopDeals
    _: any,
    { input }: { input: addTopDealProduct }, // Destructuring the second argument into input
    { prisma }: Context // Destructuring the third argument into prisma
) => {
    try {
        const {
            productId
        } = input;
        const deleteTopDeals = await prisma.topDeals.delete({
            where: {
                productId
            }
        });
        return "delete TopDeals with success";
    } catch (error: any) {
        // Handle errors gracefully
        console.error("Error deleted TopDeals:", error);
        return error;
    }
};
