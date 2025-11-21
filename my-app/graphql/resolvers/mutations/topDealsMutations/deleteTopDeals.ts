import { Context } from "@apollo/client";

export const deleteTopDeals = async (
    _: any,
    { productId }: { productId: string },
    { prisma }: Context
) => {
    try {

        await prisma.topDeals.delete({
            where: {
                productId
            }
        });
        return "delete TopDeals with success";
    } catch (error: any) {
        console.error("Error deleted TopDeals:", error);
        return error;
    }
};
