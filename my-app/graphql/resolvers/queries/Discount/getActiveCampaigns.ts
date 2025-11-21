import { Context } from "@apollo/client";


export const getActiveCampaigns = async (
    _: any,
    __: any,
    { prisma }: Context
): Promise<any[]> => {
    try {
        const now = new Date();

        const campaigns = await prisma.discountCampaign.findMany({
            where: {
                isActive: true,
                dateStart: {
                    lte: now, 
                },
                dateEnd: {
                    gte: now, 
                },
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        role: true,
                    },
                },
            },
            orderBy: {
                dateStart: 'desc',
            },
        });

        return campaigns;
    } catch (error: any) {
        console.error("Error fetching active campaigns:", error);
        throw new Error(`Failed to fetch active campaigns: ${error.message}`);
    }
};
