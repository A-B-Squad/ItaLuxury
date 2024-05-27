import { Context } from '@/pages/api/graphql';

export const updateSectionVisibility = async (_: any, { section, visibility_status }: { section: string, visibility_status: boolean }, { prisma }: Context): Promise<any> => {
    try {
        const updatedSection = await prisma.content_visibility.updateMany({
            where: { section },
            data: { visibility_status: visibility_status },
        });

        return updatedSection;
    } catch (error) {
        console.error('Failed to update section visibility', error);
        throw new Error('Failed to update section visibility');
    }
};
