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
        console.log('existingGroup group product variant with id:', existingGroup);

        if (!existingGroup) {
            return 'Product group not found'
        }

       let deletedGroup = await prisma.groupProductVariant.delete(
            {
                where: { id },
            });

            console.log('Deleted group product variant:', deletedGroup);

        return 'Product group deleted successfully';
    } catch (error) {
        return ('Failed to create product group');
    }
}