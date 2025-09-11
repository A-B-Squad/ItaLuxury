import { Context } from "@apollo/client";

export const updateGroupProductVariant = async (_: any,
    { input }: { input: { id: string, groupProductName: string } },
    { prisma }: Context

) => {
    try {
        const { id, groupProductName } = input;

        // Check if group name already exists
        const existingGroup = await prisma.groupProductVariant.findUnique({
            where: { id }
        });

        if (existingGroup) {
            return 'Product group not found'
        }
        if (groupProductName && groupProductName !== existingGroup.groupProductName) {
            const nameConflict = await prisma.groupProductVariant.findUnique({
                where: { groupProductName }
            });


            if (nameConflict) {
                return 'Product group name already exists'
            }
        }

        await prisma.groupProductVariant.update(
            {
                where: { id },
                data: {
                    groupProductName
                }
            });

        return 'Product group updated successfully';
    } catch (error) {
        return ('Failed to create product group');
    }
}