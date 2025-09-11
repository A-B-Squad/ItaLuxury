import { Context } from "@apollo/client";

export const deleteGroupProductVariant = async (_: any,
    { id }: { id: string },
    { prisma }: Context

) => {
    try {
        // Check if group name already exists
        const existingGroup = await prisma.groupProductVariant.findUnique({
            where: { id }
        });

        if (existingGroup) {
            return 'Product group not found'
        }

        await prisma.groupProductVariant.delete(
            {
                where: { id },
            });

        return 'Product group deleted successfully';
    } catch (error) {
        return ('Failed to create product group');
    }
}