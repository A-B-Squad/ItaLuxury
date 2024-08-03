import { Context } from "@/pages/api/graphql";

export const deleteTopDeals = async (
    // Defining an async function called deleteTopDeals
    _: any,
    { productId }: { productId: string }, // Destructuring the second argument into input
    { prisma }: Context // Destructuring the third argument into prisma
) => {
    try {
      
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
