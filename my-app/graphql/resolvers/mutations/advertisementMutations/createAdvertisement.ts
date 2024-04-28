import { Context } from "@/pages/api/graphql";

export const createAdvertisement = async (
    _: any,
    { input }: { input: createAdvertisementInputType },
    { prisma }: Context
) => {
    try {
        const { images, position,link } = input;
        // Create the advertisement
        const advertisement = await prisma.advertisement.create({
            data: {
                images,
                position,
                link
            },
        });
        // Return the created advertisement
        return advertisement;
    } catch (error) {
        // Handle errors
        console.error("Error creating advertisement:", error);
        return new Error("Failed to create advertisement");
    }
};
