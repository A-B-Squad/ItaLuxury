import { Context } from "@apollo/client";

export const createGroupProductVariant = async (_: any,
    { input }: { input: { groupProductName: string } },
    { prisma }: Context

) => {
    try {
        const { groupProductName } = input;

        // Check if group name already exists
        const existingGroup = await prisma.groupProductVariant.findUnique({
            where: { groupProductName }
        });

        if (existingGroup) {
            return 'Product group name already exists'
        }

        return await prisma.groupProductVariant.create({
            data: {
                groupProductName
            },

        });
    } catch (error) {
        return ('Failed to create product group');
    }
}