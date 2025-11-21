import { Context } from "@apollo/client";


export const getAllCampaigns = async (
    _: any,
    __: any,
    { prisma }: Context
): Promise<any[]> => {
    try {

        const campaigns = await prisma.discountCampaign.findMany({
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
                createdAt: 'desc',
            },
        });

        return campaigns;
    } catch (error: any) {
        console.error("Error fetching active campaigns:", error);
        throw new Error(`Failed to fetch active campaigns: ${error.message}`);
    }
};
