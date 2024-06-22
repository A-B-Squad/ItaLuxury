import { Context } from "@/pages/api/graphql";

export const createCarouselAdvertisement = async (
    _: any,
    { input }: { input: any },
    { prisma }: Context
) => {
    try {
        // 1. Fetch all existing data from the database
        const existingData = await prisma.advertisement.findMany({ where: { position: "slider" } });

        // 2. Compare input data with existing data
        const newDataIds = input.map((item: any) => ({ link: item.link, position: item.position }));
        const existingDataIds = existingData.map((item: any) => ({ link: item.link, position: item.position }));

        // 3. Update existing data with input data
        for (const item of input) {
            if (existingDataIds.some(existingItem => existingItem.link === item.link && existingItem.position === item.position)) {
                await prisma.advertisement.updateMany({
                    where: { link: item.link, position: item.position },
                    data: item
                });
            } else {
                // 4. Create new data if it doesn't exist in the database
                await prisma.advertisement.create({
                    data: item
                });
            }
        }

        // 5. Delete data from the database that is not included in the input
        for (const item of existingData) {
            if (!newDataIds.some((newItem: { link: string | null; position: string; }) => newItem.link === item.link && newItem.position === item.position)) {
                await prisma.advertisement.deleteMany({
                    where: { link: item.link, position: item.position },
                });
            }
        }

        // Return success message
        return "Advertisement data updated successfully"
    } catch (error) {
        // Handle errors
        console.error("Error creating/updating advertisement data:", error);
        throw new Error("Failed to create/update advertisement data");
    }
};
