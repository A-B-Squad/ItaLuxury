import { Context } from "@apollo/client";

export const getAllProductGroups = async (
    _: any,
    __: any,
    { prisma }: Context) => {
    try {
        return await prisma.groupProductVariant.findMany();
    } catch (error) {
        return 'Failed to fetch product groups'
    }
}