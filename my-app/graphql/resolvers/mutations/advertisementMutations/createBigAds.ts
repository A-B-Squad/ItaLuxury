import { Context } from "@/pages/api/graphql";

export const createBigAds = async (
    _: any,
    { input }: { input: any },
    { prisma }: Context
) => {
    try {
        // Ensure input is valid
        if (!input.link || !input.position || input.images.length === 0) {
            throw new Error("Invalid input data");
        }

        // Fetch existing data for the same position
        const existingData = await prisma.advertisement.findMany({
            where: {
                position: "BigAds"
            }
        });

        // Check if the data already exists in the database
        const existingEntry = existingData.find((item: any) =>
            item.link === input.link && item.position === input.position
        );

        if (existingEntry) {
            // Update existing data
            await prisma.advertisement.updateMany({
                where: { link: input.link, position: input.position },
                data: input
            });
        } else {
            // Create new data
            await prisma.advertisement.create({
                data: input
            });
        }

        // Delete data from the database that is not included in the input
        for (const item of existingData) {
            if (item.link !== input.link || item.position !== input.position) {
                await prisma.advertisement.deleteMany({
                    where: { link: item.link, position: item.position },
                });
            }
        }

        // Return success message
        return "Advertisement data updated successfully";
    } catch (error) {
        // Handle errors
        console.error("Error creating/updating advertisement data:", error);
        throw new Error("Failed to create/update advertisement data");
    }
};
