import { Context } from "@apollo/client";

export const advertismentByPosition = async (_: any, { position }: { position: string }, { prisma }: Context) => {
    try {
        // Input validation
        if (!position) {
            return new Error("Position is required");
        }

        // Retrieve advertisement by position
        const advertisement = await prisma.advertisement.findMany({ where: { position } });

        if (!advertisement) {
            return new Error("Advertisement not found");
        }

        return advertisement;
    } catch (error) {
        // Error handling
        console.error("Error retrieving advertisement:", error);
        return `Failed to retrieve advertisement ${error}`;
    }
};
